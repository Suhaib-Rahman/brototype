"use client";
import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            height: "100%",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            textAlign: "center",
            background: "var(--bg)",
            color: "var(--t-primary)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "var(--rose-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <AlertTriangle size={28} color="var(--rose)" />
          </div>
          <h3
            className="font-display"
            style={{ fontSize: "1.2rem", marginBottom: "8px" }}
          >
            Something went wrong
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--t-muted)",
              maxWidth: "400px",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            {this.state.error?.message ||
              "An unexpected error occurred in this section."}
          </p>
          <button
            onClick={this.handleReset}
            className="btn-primary"
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RefreshCcw size={14} /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
