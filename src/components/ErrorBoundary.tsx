import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-error mb-4">
              خطایی رخ داده است
            </h2>
            <p className="text-base-content mb-4">
              لطفاً صفحه را رفرش کنید یا با پشتیبانی تماس بگیرید.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              رفرش صفحه
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
