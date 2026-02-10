import * as React from "react";

export function usePagination(initialLimit = 10) {
    const [pagination, setPagination] = React.useState({
        totalRows: 0,
        totalPages: 0,
        currentPage: 1,
        limit: initialLimit,
    });
    const [currentPage, setCurrentPage] = React.useState(1);
    const [limit, setLimit] = React.useState(initialLimit);

    return {
        pagination,
        setPagination,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
    };
}
