import React, { Component, ErrorInfo, ReactNode } from 'react';

import { useToast } from '@/components/ui/use-toast';

interface Props {
  children?: ReactNode;
  toast: ReturnType<typeof useToast>['toast'];
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.toast({ title: "Error", description: "Terjadi kesalahan yang tidak terduga.", variant: "destructive" });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
          <h1 className="text-4xl font-bold mb-4">Oops! Terjadi Kesalahan.</h1>
          <p className="text-lg text-center mb-6">Maaf, sepertinya ada yang tidak beres. Silakan coba lagi nanti atau hubungi dukungan.</p>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => window.location.reload()}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundaryWrapper = ({ children }: { children?: ReactNode }) => {
  const { toast } = useToast();
  return <ErrorBoundary toast={toast}>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWrapper;