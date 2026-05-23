import * as React from "react";

/** Normalize API pagination (page/currentPage, total/totalRows) for UI */
export function normalizePagination(pagination, fallbackLimit = 10) {
    if (!pagination) {
        return {
            totalRows: 0,
            totalPages: 1,
            currentPage: 1,
            page: 1,
            limit: fallbackLimit,
            total: 0,
        };
    }

    const limit = pagination.limit ?? fallbackLimit;
    const currentPage = pagination.currentPage ?? pagination.page ?? 1;
    const totalRows = pagination.totalRows ?? pagination.total ?? 0;
    const totalPages =
        pagination.totalPages ??
        Math.max(1, Math.ceil(totalRows / limit) || 1);

    return {
        ...pagination,
        limit,
        currentPage,
        page: currentPage,
        totalRows,
        total: totalRows,
        totalPages,
    };
}

export function usePagination(
    initialLimit = 10,
    initialPagination = null,
    initialPage = 1
) {
    const normalized = normalizePagination(initialPagination, initialLimit);

    const [pagination, setPagination] = React.useState(normalized);
    const [currentPage, setCurrentPage] = React.useState(initialPage);
    const [limit, setLimit] = React.useState(
        normalized.limit ?? initialLimit
    );

    return {
        pagination,
        setPagination,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
    };
}
