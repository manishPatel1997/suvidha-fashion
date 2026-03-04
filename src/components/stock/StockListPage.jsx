"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import { usePost } from "@/hooks/useApi";
import { usePagination } from "@/hooks/usePagination";
import { CommonPagination } from "@/components/CommonPagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { StateUpdate } from "@/lib/helper";

export function StockListPage({
    title,
    addButtonText = "Add",
    searchPlaceholder = "Search...",
    fetchApiEndpoint,
    renderCard,
    renderSidebar,
    renderAddModal,
    alertComponent: AlertComponent,
    getItemId = (item) => item.id,
    getItemLabel = (item) => item.name || `Item ${item.id}`,
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const initialPage = parseInt(searchParams.get("page")) || 1;
    const initialLimit = parseInt(searchParams.get("limit")) || 10;
    const initialSearch = searchParams.get("search") || "";
    const [search, setSearch] = React.useState(initialSearch);
    const [debouncedSearch] = useDebounce(search, 500);

    const [data, setData] = React.useState({
        isAddModalOpen: false,
        items: [],
        selectedData: null,
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
    } = usePagination(initialLimit);

    React.useEffect(() => {
        setCurrentPage(initialPage);
    }, []);

    React.useEffect(() => {
        const params = new URLSearchParams();

        if (currentPage > 1) params.set("page", currentPage.toString());
        if (limit !== 10) params.set("limit", limit.toString());
        if (debouncedSearch) params.set("search", debouncedSearch);

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.replace(newUrl, { scroll: false });
    }, [currentPage, limit, debouncedSearch, pathname, router]);

    /* ---------------- FETCH ITEMS ---------------- */
    const { mutate: fetchItems, isPending: isLoading } = usePost(
        fetchApiEndpoint,
        {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    if (res?.data?.pagination) {
                        setPagination(res.data.pagination);
                    }
                    StateUpdate({ items: res.data.data }, setData);
                }
            },
        }
    );

    React.useEffect(() => {
        fetchItems({
            page: currentPage,
            limit: limit,
            search: debouncedSearch,
            pagination: "true",
        });
    }, [currentPage, limit, debouncedSearch]);

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
        const updatedItems = data.items.map((item) =>
            getItemId(item).toString() ===
                getItemId(updatedItem).toString()
                ? updatedItem
                : item
        );

        StateUpdate(
            {
                items: updatedItems,
                isSidebarOpen: false,
                selectedSidebarData: null, // VERY IMPORTANT
            },
            setData
        );
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
            ) : data?.items.length > 0 ? (
                <div className="flex flex-col gap-6">
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
