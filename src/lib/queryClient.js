import { QueryClient } from "@tanstack/react-query";

/**
 * Create a QueryClient instance with sensible defaults.
 * This is shared across the application.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache data for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Disable automatic refetch on window focus
            refetchOnWindowFocus: false,
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
        },
    },
});
