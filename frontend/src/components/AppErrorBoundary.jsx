import React from "react";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("App render failed", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", padding: "24px", fontFamily: "sans-serif", background: "#f8fafc", color: "#0f172a" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Frontend error</h1>
          <p style={{ marginTop: "12px" }}>The page crashed while rendering. The error is shown below.</p>
          <pre style={{ marginTop: "16px", whiteSpace: "pre-wrap", background: "#e2e8f0", padding: "16px", borderRadius: "12px" }}>
            {this.state.error?.message || "Unknown render error"}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
