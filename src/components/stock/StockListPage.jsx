"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import { usePost } from "@/hooks/useApi";
import { usePagination, normalizePagination } from "@/hooks/usePagination";
import { CommonPagination } from "@/components/CommonPagination";
import { useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { StateUpdate } from "@/lib/helper";
import { toast } from "sonner";

export function StockListPage({
    title,
    ServerData = null,
    addButtonText = "Add",
    searchPlaceholder = "Search...",
    fetchApiEndpoint,
    renderCard,
    renderSidebar,
    renderAddModal,
    renderEditModal,
    renderDeleteModal,
    alertComponent: AlertComponent,
    getItemId = (item) => item.id,
    getItemLabel = (item) => item.name || `Item ${item.id}`,
    listClassName = "flex flex-col gap-6",
}) {
    const isFirstMount = React.useRef(true)
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const initialPage = parseInt(searchParams.get("page")) || 1;
    const initialLimit = parseInt(searchParams.get("limit")) || 10;
    const initialSearch = searchParams.get("search") || "";
    const [search, setSearch] = React.useState(initialSearch);
    const [debouncedSearch] = useDebounce(search, 500);
    const [data, setData] = React.useState({
        isAddModalOpen: false,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        items: ServerData?.initialData || [],
        selectedData: null,
        selectedEditData: null,
        selectedDeleteData: null,
        isSidebarOpen: false,
        selectedSidebarData: null,
    });
    const {
        pagination,
        setPagination,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
    } = usePagination(
        initialLimit,
        ServerData?.initialPagination,
        initialPage
    );

    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlLimit = parseInt(searchParams.get("limit")) || 10;
    const urlSearch = searchParams.get("search") || "";

    // Sync URL for sharing/bookmarks without router.replace (that re-runs the server page + API)
    React.useEffect(() => {
        if (
            currentPage === urlPage &&
            limit === urlLimit &&
            debouncedSearch === urlSearch
        ) {
            return;
        }

        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage.toString());
        if (limit !== 10) params.set("limit", limit.toString());
        if (debouncedSearch) params.set("search", debouncedSearch);

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        window.history.replaceState(null, "", newUrl);
    }, [
        currentPage,
        limit,
        debouncedSearch,
        pathname,
        urlPage,
        urlLimit,
        urlSearch,
    ]);

    /* ---------------- FETCH ITEMS ---------------- */
    const { mutate: fetchItems, isPending: isLoading } = usePost(
        fetchApiEndpoint,
        {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    if ((!res.data.data || res.data.data.length === 0) && currentPage > 1) {
                        setCurrentPage((prev) => Math.max(1, prev - 1));
                        return;
                    }
                    if (res?.data?.pagination) {
                        setPagination(
                            normalizePagination(res.data.pagination, limit)
                        );
                    }
                    StateUpdate({ items: res.data.data }, setData);
                }
            },
            onError: (err) => {
                toast.error(err.message || "Failed to fetch data");
            }
        }
    );

    const refetch = () => {
        fetchItems({
            page: currentPage,
            limit: limit,
            search: debouncedSearch,
            pagination: "true",
        });
    };


    React.useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false
            return
        }
        const delayDebounceFn = setTimeout(() => {
            // getSketches({ page: currentPage, limit, search: searchQuery })
            refetch();
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [currentPage, limit, debouncedSearch])

    // React.useEffect(() => {
    //     refetch();
    // }, [currentPage, limit, debouncedSearch]);

    const handleAddItem = (newItem) => {
        // const itemData = {
        //     value: getItemId(newItem).toString(),
        //     label: getItemLabel(newItem),
        //     rawData: newItem,
        // };
        StateUpdate({ items: [...data.items, newItem] }, setData);
    };

    // const handleUpdateSuccess = (updatedItem) => {
    //     const updatedItems = data.items.map((item) =>
    //         getItemId(item).toString() === getItemId(updatedItem).toString()
    //             ? updatedItem
    //             : item
    //     );
    //     StateUpdate({ items: updatedItems, isSidebarOpen: false }, setData);
    // };

    const handleUpdateSuccess = (updatedItem) => {
        if (!updatedItem) return;
        const updatedItemId = getItemId(updatedItem);

        const updatedItems = data.items.map((item) => {
            const itemId = getItemId(item);
            return itemId !== undefined && itemId !== null && updatedItemId !== undefined && updatedItemId !== null && itemId.toString() === updatedItemId.toString()
                ? updatedItem
                : item;
        });

        StateUpdate(
            {
                items: updatedItems,
                isSidebarOpen: false,
                selectedSidebarData: null,
                isEditModalOpen: false,
                selectedEditData: null,
            },
            setData
        );
    };

    const handleDeleteSuccess = (deletedItemId) => {
        if (deletedItemId === undefined || deletedItemId === null) return;

        // Normalise the id – handle objects, numbers, strings
        let targetId;
        if (typeof deletedItemId === "object") {
            targetId = (getItemId(deletedItemId) ?? deletedItemId?.id ?? "").toString().trim();
        } else {
            targetId = deletedItemId.toString().trim();
        }
        const hasNextPage = currentPage < (pagination?.totalPages || 1);

        if (hasNextPage) {
            // Next page exists → refetch so next item slides in; just close modal
            setData((prev) => ({
                ...prev,
                isDeleteModalOpen: false,
                selectedDeleteData: null,
            }));
            refetch();
        } else {
            // Last page → filter locally, NO API call
            const updatedItems = data.items.filter((item) => {
                const itemId = getItemId(item);
                if (itemId === undefined || itemId === null) return true;
                return itemId.toString().trim() !== targetId;
            });

            // Single atomic state update — modal close + items filter together
            setData((prev) => ({
                ...prev,
                items: updatedItems,
                isDeleteModalOpen: false,
                selectedDeleteData: null,
            }));

            // Update pagination counts locally
            setPagination((prev) => {
                const newTotalRows = Math.max(0, (prev.totalRows || prev.total || 0) - 1);
                const lim = prev.limit || limit || 10;
                const newTotalPages = Math.max(1, Math.ceil(newTotalRows / lim));
                return {
                    ...prev,
                    totalRows: newTotalRows,
                    total: newTotalRows,
                    totalPages: newTotalPages,
                };
            });

            // If page is now empty and we're not on page 1, go back
            if (updatedItems.length === 0 && currentPage > 1) {
                setCurrentPage((prev) => Math.max(1, prev - 1));
            }
        }
    };
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex sm:items-center justify-between gap-4">
                <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
                    {title}
                </h1>
                <Button
                    onClick={() =>
                        StateUpdate({ isAddModalOpen: true }, setData)
                    }
                    className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-9.5 px-4 rounded-lg gap-2 font-semibold w-auto"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{addButtonText}</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </div>

            {/* Add Modal */}
            {renderAddModal &&
                renderAddModal({
                    open: data.isAddModalOpen,
                    onOpenChange: (isOpen) =>
                        StateUpdate({ isAddModalOpen: isOpen }, setData),
                    onAdd: handleAddItem,
                    refetch,
                })}

            {/* Edit Modal */}
            {renderEditModal &&
                renderEditModal({
                    open: data.isEditModalOpen,
                    onOpenChange: (isOpen) =>
                        StateUpdate(
                            {
                                isEditModalOpen: isOpen,
                                selectedEditData: isOpen
                                    ? data.selectedEditData
                                    : null,
                            },
                            setData
                        ),
                    initialData: data.selectedEditData,
                    onUpdate: handleUpdateSuccess,
                    refetch,
                })}

            {/* Delete Modal */}
            {renderDeleteModal &&
                renderDeleteModal({
                    open: data.isDeleteModalOpen,
                    onOpenChange: (isOpen) =>
                        StateUpdate(
                            {
                                isDeleteModalOpen: isOpen,
                                selectedDeleteData: isOpen
                                    ? data.selectedDeleteData
                                    : null,
                            },
                            setData
                        ),
                    selectedData: data.selectedDeleteData,
                    onDelete: handleDeleteSuccess,
                    refetch,
                })}

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <Input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder={searchPlaceholder}
                        className="pl-10 h-10 border-[#dcccbd] rounded-md placeholder:text-primary-foreground/50 text-[16px] sm:text-[18px] focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Alert Component */}
            {AlertComponent && <AlertComponent />}

            {/* Items List */}
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <p className="text-lg text-primary-foreground">
                        Loading {title.toLowerCase()}...
                    </p>
                </div>
            ) : data?.items?.length > 0 ? (
                <div className={listClassName}>
                    {data?.items.map((item) => {
                        const rawItem = item.rawData || item;
                        // return renderCard({
                        //     key: getItemId(rawItem),
                        //     item: rawItem,
                        //     onViewDetails: () =>
                        //         StateUpdate(
                        //             {
                        //                 isSidebarOpen: true,
                        //                 selectedSidebarData: rawItem,
                        //             },
                        //             setData
                        //         ),
                        // });
                        return renderCard({
                            key: getItemId(item),
                            item: rawItem,
                            onViewDetails: () =>
                                StateUpdate(
                                    {
                                        isSidebarOpen: true,
                                        selectedSidebarData: item,
                                    },
                                    setData
                                ),
                            onEdit: () =>
                                StateUpdate(
                                    {
                                        isEditModalOpen: true,
                                        selectedEditData: item,
                                    },
                                    setData
                                ),
                            onDelete: () =>
                                StateUpdate(
                                    {
                                        isDeleteModalOpen: true,
                                        selectedDeleteData: item,
                                    },
                                    setData
                                ),
                        });
                    })}
                </div>
            ) : (
                <div className="flex justify-center items-center py-10">
                    <p className="text-lg text-primary-foreground opacity-60">
                        No {title.toLowerCase()} found.
                    </p>
                </div>
            )}

            <CommonPagination
                pagination={pagination}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                limit={limit}
                setLimit={setLimit}
            />

            {/* Sidebar */}
            {/* {renderSidebar &&
                renderSidebar({
                    open: data.isSidebarOpen,
                    onOpenChange: (isOpen) =>
                        StateUpdate({ isSidebarOpen: isOpen }, setData),
                    selectedData: data.selectedSidebarData,
                    onUpdateSuccess: handleUpdateSuccess,
                })} */}
            {/* Sidebar */}
            {renderSidebar &&
                renderSidebar({
                    open: data.isSidebarOpen,
                    onOpenChange: (isOpen) =>
                        StateUpdate(
                            {
                                isSidebarOpen: isOpen,
                                selectedSidebarData: isOpen
                                    ? data.selectedSidebarData
                                    : null,
                            },
                            setData
                        ),
                    selectedData: data.selectedSidebarData,
                    onUpdateSuccess: handleUpdateSuccess,
                })}
        </div>
    );
}
