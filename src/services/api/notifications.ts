import client from "./client";
import type { NotificationPrefsDTO } from "@/types";

export const notificationsAPI = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    client.get("/notifications", { params }),
  getById: (id: string) => client.get(`/notifications/${id}`),
  markRead: (id: string) => client.put(`/notifications/${id}/read`),
  markAllRead: () => client.put("/notifications/mark-all-read"),
  updatePreferences: (prefs: NotificationPrefsDTO) =>
    client.put("/notifications/preferences", prefs),
};
