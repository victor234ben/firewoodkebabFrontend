import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// Singleton client socket — never used for admin
let socket: Socket | null = null;
let reconnectAttempts = 0;

export function useSocketInit(token: string | null, userId: string | null) {
  useEffect(() => {
    // Tear down any existing socket before rebuilding
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    // Normalize: guard against "null" / "undefined" strings from localStorage
    const cleanToken =
      token && token !== "null" && token !== "undefined" ? token : null;

    socket = io(SOCKET_URL, {
      // Send empty auth object for guests — never send token: undefined
      auth: cleanToken ? { token: cleanToken } : {},
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
    });

    socket.on("connect", () => {
      reconnectAttempts = 0;
      toast.dismiss("socket-reconnect");

      if (userId) {
        socket!.emit("USER_JOIN", { userId });
      }
    });

    socket.on("USER_JOINED", () => {
      // Handled silently
    });

    socket.on("connect_error", (error) => {
      reconnectAttempts++;
      toast.error("Connection lost. Reconnecting...", {
        id: "socket-reconnect",
        description: `Attempt ${reconnectAttempts} of 5`,
      });
    });

    socket.on("error", (error) => {
      console.error("[Socket] Socket error:", error);
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket?.connect();
      }
    });

    // Clean up when token/userId changes (login, logout, guest transition)
    return () => {
      socket?.disconnect();
      socket = null;
      reconnectAttempts = 0;
    };
  }, [token, userId]);
}

export function useOrderSocket(
  orderId: string | undefined,
  onStatusChange: (data: { status: string; estimatedTime?: number }) => void,
) {
  const activeRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (!orderId || !socket?.connected) return;

    socket.emit("order:track", orderId);
    activeRoomRef.current = `order-${orderId}`;

    const handleOrderUpdate = (data: any) => {
      onStatusChange({
        status: data.status,
        estimatedTime: data.estimatedTime,
      });

      const toastMessages: Record<string, string> = {
        confirmed: "✅ Order confirmed!",
        preparing: "👨‍🍳 Your order is being prepared",
        out_for_delivery: `🚗 On the way! ETA: ${data.estimatedTime} mins`,
        delivered: "🎉 Order delivered!",
        cancelled: "❌ Order cancelled",
      };

      if (toastMessages[data.status]) {
        toast.success(toastMessages[data.status]);
      }
    };

    socket.on("ORDER_UPDATE", handleOrderUpdate);

    return () => {
      socket?.off("ORDER_UPDATE", handleOrderUpdate);
      if (activeRoomRef.current && socket?.connected) {
        socket?.emit("order:untrack", orderId);
      }
      activeRoomRef.current = null;
    };
  }, [orderId, onStatusChange]);
}

export function useNotifications(
  onNotification?: (data: {
    id: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    timestamp: Date;
  }) => void,
) {
  useEffect(() => {
    if (!socket?.connected) return;

    const handleNotification = (data: any) => {
      toast.info(data.title, {
        description: data.message,
      });

      onNotification?.(data);
    };

    socket.on("NOTIFICATION", handleNotification);

    return () => {
      socket?.off("NOTIFICATION", handleNotification);
    };
  }, [onNotification]);
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
