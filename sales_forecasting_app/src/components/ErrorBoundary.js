import React from 'react';
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Something went wrong!</Alert.Heading>
          <p>{this.state.error.toString()}</p>
          <hr />
          <p className="mb-0">
            Please refresh the page and try again. If the problem persists, 
            contact support.
          </p>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;