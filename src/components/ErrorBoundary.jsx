import { Component } from 'react';
import { AlertTriangle, RotateCcw, ChevronDown } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">
              <AlertTriangle size={36} />
            </div>
            <h1 className="error-boundary-title">Something went wrong</h1>
            <p className="error-boundary-desc">
              We encountered an unexpected error. Please try refreshing the page, or return to the dashboard.
            </p>
            <div className="error-boundary-actions">
              <button
                className="error-boundary-btn error-boundary-btn-primary"
                onClick={() => window.location.reload()}
              >
                <RotateCcw size={16} />
                Refresh Page
              </button>
              <button
                className="error-boundary-btn error-boundary-btn-secondary"
                onClick={() => window.location.href = '/'}
              >
                Go to Dashboard
              </button>
            </div>
            <details className="error-boundary-details">
              <summary>
                <ChevronDown size={14} />
                Error Details
              </summary>
              <pre>{this.state.error?.toString()}</pre>
              {this.state.errorInfo?.componentStack && (
                <pre style={{ marginTop: 8 }}>{this.state.errorInfo.componentStack}</pre>
              )}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorLogging(WrappedComponent, componentName) {
  return function ErrorLoggedComponent(props) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
