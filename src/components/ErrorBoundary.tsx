import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
          style={{
            background: "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
            color: "hsl(var(--foreground))"
          }}
        >
          <div className="max-w-md space-y-6">
            <p className="text-6xl animate-bounce">⚠️</p>
            <h1 className="text-3xl font-display font-black text-white">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">
              An unexpected error occurred in the application. Don't worry, your cart items are safe. Try reloading the page or return to our home page.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
                Reload Page
              </Button>
              <Button onClick={this.handleReset} className="rounded-xl">
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
