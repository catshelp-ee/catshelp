import { PostHogProvider } from 'posthog-js/react';
import { PropsWithChildren } from 'react';

const options = {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
}

export const PostHogProviderWrapper = ({ children }: PropsWithChildren) => {
    const env = import.meta.env.VITE_ENVIRONMENT;
    if (env !== 'PROD') {
        return <>{children}</>;
    }
    return (
        <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
            {children}
        </PostHogProvider>
    );
};

