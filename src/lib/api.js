import Cookies from "js-cookie";
import { toFormData } from "./helper";

/**
 * Base API URL - configure via environment variable
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3008";

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
    const token = Cookies.get("token");
    const isFormData = options.body instanceof FormData;
    const headers = {
        ...options.headers,
    };

    if (!isFormData) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        headers,
        ...options,
    });

    // Handle non-OK responses
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle JWT expiration or unauthorized
        if (response.status === 401 || errorData.message === "jwt expired") {
            Cookies.remove("token");
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

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

export async function post(url, body = {}, options = {}) {
    const isFormData = options.isFormData || body instanceof FormData;
    const finalBody = isFormData && !(body instanceof FormData) ? toFormData(body) : body;

    return fetcher(`${BASE_URL}${url}`, {
        method: "POST",
        body: isFormData ? finalBody : JSON.stringify(finalBody),
        ...options,
    });
}

export async function put(url, body = {}, options = {}) {
    const isFormData = options.isFormData || body instanceof FormData;
    const finalBody = isFormData && !(body instanceof FormData) ? toFormData(body) : body;

    return fetcher(`${BASE_URL}${url}`, {
        method: "PUT",
        body: isFormData ? finalBody : JSON.stringify(finalBody),
        ...options,
    });
}

export async function patch(url, body = {}, options = {}) {
    const isFormData = options.isFormData || body instanceof FormData;
    const finalBody = isFormData && !(body instanceof FormData) ? toFormData(body) : body;

    return fetcher(`${BASE_URL}${url}`, {
        method: "PATCH",
        body: isFormData ? finalBody : JSON.stringify(finalBody),
        ...options,
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
