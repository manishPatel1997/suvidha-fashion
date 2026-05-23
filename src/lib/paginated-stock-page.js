import { post } from "@/lib/server-api";
import { rethrowNavigationError } from "@/lib/server-errors";

const DEFAULT_PAGINATION = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
};

/**
 * Server-side fetch for stock/list pages (page, limit, pagination from URL).
 */
export async function fetchPaginatedList(
    apiEndpoint,
    searchParams,
    { errorLabel = "items" } = {}
) {
    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;

    let initialData = [];
    let initialPagination = { ...DEFAULT_PAGINATION, page, limit };

    try {
        const response = await post(apiEndpoint, {
            page,
            limit,
            pagination: "true",
        });

        initialData = response?.data?.data || [];
        initialPagination =
            response?.data?.pagination || {
                ...DEFAULT_PAGINATION,
                page,
                limit,
            };
    } catch (error) {
        rethrowNavigationError(error);
        console.error(`Error fetching ${errorLabel}:`, error);
    }

    return { initialData, initialPagination };
}

/**
 * Factory for auth stock list server pages — only api endpoint and client component differ.
 */
export function createPaginatedStockPage({
    apiEndpoint,
    Component,
    errorLabel = "items",
}) {
    async function Page({ searchParams }) {
        const { initialData, initialPagination } = await fetchPaginatedList(
            apiEndpoint,
            searchParams,
            { errorLabel }
        );

        return (
            <Component
                initialData={initialData}
                initialPagination={initialPagination}
            />
        );
    }

    return Page;
}
