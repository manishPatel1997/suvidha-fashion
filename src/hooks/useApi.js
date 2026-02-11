"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, patch, del } from "@/lib/api";

/**
 * Custom hook for GET requests with caching
 *
 * @param {string|Array} queryKey - Unique key for caching (string or array)
 * @param {string} url - API endpoint URL
 * @param {Object} params - Optional query parameters
 * @param {Object} options - Optional React Query options
 * @returns {Object} Query result with data, isLoading, error, refetch, etc.
 *
 * @example
 * // Simple usage
 * const { data, isLoading, error } = useGet("users", "/api/users");
 *
 * // With query params
 * const { data } = useGet(["users", page], "/api/users", { page, limit: 10 });
 *
 * // With options
 * const { data } = useGet("user", "/api/user/1", {}, { enabled: isLoggedIn });
 */
export function useGet(queryKey, url, params = {}, options = {}) {
    return useQuery({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn: () => get(url, params),
        ...options,
    });
}

/**
 * Custom hook for POST requests (mutations)
 *
 * @param {string} url - API endpoint URL
 * @param {Object} options - Optional mutation options (onSuccess, onError, etc.)
 * @returns {Object} Mutation result with mutate, mutateAsync, isPending, error, etc.
 *
 * @example
 * const { mutate, isPending, error, isSuccess } = usePost("/api/users");
 *
 * // Trigger the mutation
 * mutate({ name: "John", email: "john@example.com" });
 *
 * // With async/await
 * const result = await mutateAsync({ name: "John" });
 *
 * // With callbacks
 * const { mutate } = usePost("/api/users", {
 *   onSuccess: (data) => console.log("Created:", data),
 *   onError: (error) => console.error("Failed:", error),
 * });
 */
export function usePost(url, options = {}) {
    const queryClient = useQueryClient();
    const { isFormData, ...mutationOptions } = options;

    return useMutation({
        mutationFn: (body) => post(url, body, { isFormData }),
        onSuccess: (data, variables, context) => {
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options.onError?.(error, variables, context);
        },
        ...mutationOptions,
    });
}

/**
 * Custom hook for PUT requests (full update mutations)
 *
 * @param {string} url - API endpoint URL
 * @param {Object} options - Optional mutation options
 * @returns {Object} Mutation result
 *
 * @example
 * const { mutate, isPending } = usePut("/api/users/1");
 * mutate({ name: "Updated Name", email: "new@example.com" });
 */
export function usePut(url, options = {}) {
    const { isFormData, ...mutationOptions } = options;
    return useMutation({
        mutationFn: (body) => put(url, body, { isFormData }),
        onSuccess: (data, variables, context) => {
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options.onError?.(error, variables, context);
        },
        ...mutationOptions,
    });
}

/**
 * Custom hook for PATCH requests (partial update mutations)
 *
 * @param {string} url - API endpoint URL
 * @param {Object} options - Optional mutation options
 * @returns {Object} Mutation result
 *
 * @example
 * const { mutate } = usePatch("/api/users/1");
 * mutate({ name: "Updated Name" }); // Only update name
 */
export function usePatch(url, options = {}) {
    const { isFormData, ...mutationOptions } = options;
    return useMutation({
        mutationFn: (body) => patch(url, body, { isFormData }),
        onSuccess: (data, variables, context) => {
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options.onError?.(error, variables, context);
        },
        ...mutationOptions,
    });
}

/**
 * Custom hook for DELETE requests
 *
 * @param {string} url - API endpoint URL
 * @param {Object} options - Optional mutation options
 * @returns {Object} Mutation result
 *
 * @example
 * const { mutate, isPending } = useDelete("/api/users/1");
 * mutate(); // No body needed for DELETE
 *
 * // With dynamic URL
 * const deleteUser = (id) => {
 *   const { mutate } = useDelete(`/api/users/${id}`);
 *   mutate();
 * };
 */
export function useDelete(url, options = {}) {
    return useMutation({
        mutationFn: () => del(url),
        onSuccess: (data, variables, context) => {
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options.onError?.(error, variables, context);
        },
        ...options,
    });
}

/**
 * Hook to get the QueryClient for manual cache operations
 *
 * @returns {QueryClient} The React Query client instance
 *
 * @example
 * const queryClient = useApiQueryClient();
 *
 * // Invalidate queries to refetch data
 * queryClient.invalidateQueries({ queryKey: ["users"] });
 *
 * // Set data manually
 * queryClient.setQueryData(["user", id], updatedUser);
 */
export function useApiQueryClient() {
    return useQueryClient();
}
