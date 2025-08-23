// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on component mount by default
      refetchOnMount: false,
      // Retry failed requests 1 time
      retry: 1,
      // Don't retry on certain error types
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});