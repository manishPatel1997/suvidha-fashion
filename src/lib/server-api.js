import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3008";

/**
 * Server-side fetcher function
 */
async function serverFetcher(url, options = {}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        headers,
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('errorData', errorData)
        // Handle unauthorized or expired token
        if (response.status === 401 || errorData.message === "jwt expired") {
            redirect("/login");
        }

        const error = new Error(
            errorData.message || `Server request failed with status ${response.status}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

/**
 * Server-side POST request helper
 */
export async function post(url, body = {}, options = {}) {
    return serverFetcher(url, {
        method: "POST",
        body: JSON.stringify(body),
        ...options,
    });
}

/**
 * Server-side GET request helper
 */
export async function get(url, params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    return serverFetcher(finalUrl, {
        method: "GET",
    });
}
