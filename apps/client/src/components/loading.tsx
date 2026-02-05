import React from "react";

interface LoadingWrapperProps {
    loading: boolean;
    error?: Error | null;
    children: React.ReactNode;
    loadingComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
      loading,
      error,
      children,
      loadingComponent,
      errorComponent
  }) => {
    if (loading) {
        return <>{loadingComponent || <DefaultLoader />}</>;
    }

    if (error) {
        return <>{errorComponent || <DefaultError error={error} />}</>;
    }

    return <>{children}</>;
};

const DefaultLoader = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
);

const DefaultError: React.FC<{ error: Error }> = ({ error }) => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <p className="text-red-600 font-medium">Tekkis viga</p>
            <p className="text-gray-600 text-sm mt-2">{error.message}</p>
        </div>
    </div>
);