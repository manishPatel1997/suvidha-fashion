/**
 * Base API URL - configure via environment variable
 * Falls back to empty string for relative URLs
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Build URL with query parameters
 * @param {string} url - The base URL
 * @param {Object} params - Query parameters object
 * @returns {string} URL with query string
 */
function buildUrl(url, params) {
    if (!params || Object.keys(params).length === 0) {
        return `${BASE_URL}${url}`;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    return `${BASE_URL}${url}?${searchParams.toString()}`;
}

/**
 * Base fetcher function with error handling
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
async function fetcher(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    // Handle non-OK responses
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
            errorData.message || `Request failed with status ${response.status}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

/**
 * GET request helper
 * @param {string} url - The endpoint URL
 * @param {Object} params - Optional query parameters
 * @returns {Promise<any>} Response data
 */
export async function get(url, params = {}) {
    return fetcher(buildUrl(url, params), {
        method: "GET",
    });
}

/**
 * POST request helper
 * @param {string} url - The endpoint URL
 * @param {Object} body - Request body
 * @returns {Promise<any>} Response data
 */
export async function post(url, body = {}) {
    return fetcher(`${BASE_URL}${url}`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

/**
 * PUT request helper
 * @param {string} url - The endpoint URL
 * @param {Object} body - Request body
 * @returns {Promise<any>} Response data
 */
export async function put(url, body = {}) {
    return fetcher(`${BASE_URL}${url}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

/**
 * PATCH request helper
 * @param {string} url - The endpoint URL
 * @param {Object} body - Request body
 * @returns {Promise<any>} Response data
 */
export async function patch(url, body = {}) {
    return fetcher(`${BASE_URL}${url}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

/**
 * DELETE request helper
 * @param {string} url - The endpoint URL
 * @returns {Promise<any>} Response data
 */
export async function del(url) {
    return fetcher(`${BASE_URL}${url}`, {
        method: "DELETE",
    });
}

// Export fetcher for custom use cases
export { fetcher, buildUrl, BASE_URL };
