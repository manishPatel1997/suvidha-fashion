import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function CommonPagination({
    pagination,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    className
}) {
    if (!pagination || pagination.totalPages <= 1) return null;

    const getPageRange = () => {
        const total = pagination.totalPages;
        const current = currentPage;
        const delta = 1; // Number of pages to show on either side of current
        const range = [];

        for (let i = 1; i <= total; i++) {
            if (
                i === 1 ||
                i === total ||
                (i >= current - delta && i <= current + delta)
            ) {
                range.push(i);
            } else if (range[range.length - 1] !== "...") {
                range.push("...");
            }
        }
        return range;
    };

    const pageRange = getPageRange();

    return (
        <div className={cn("flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pb-10", className)}>
            <div className="flex items-center gap-3">
                <span className="text-sm text-primary-foreground font-medium whitespace-nowrap opacity-80">
                    Show per page:
                </span>
                <Select
                    value={limit.toString()}
                    onValueChange={(val) => {
                        setLimit(parseInt(val));
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-[80px] h-9 border-[#dcccbd] text-primary-foreground bg-white hover:bg-[#dcccbd]/5 transition-colors focus:ring-[#dcccbd]">
                        <SelectValue placeholder={limit.toString()} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#dcccbd]">
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Pagination className="mx-0 w-auto">
                <PaginationContent className="gap-1 sm:gap-2">
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={cn(
                                "cursor-pointer border-[#dcccbd] text-primary-foreground hover:bg-[#dcccbd] hover:text-white transition-all",
                                currentPage === 1 && "pointer-events-none opacity-30"
                            )}
                        />
                    </PaginationItem>

                    {pageRange.map((page, index) => (
                        <PaginationItem key={index}>
                            {page === "..." ? (
                                <PaginationEllipsis className="text-primary-foreground opacity-50" />
                            ) : (
                                <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        "cursor-pointer border-[#dcccbd] transition-all size-9",
                                        currentPage === page
                                            ? "bg-[#dcccbd] text-white border-[#dcccbd] hover:bg-[#dcccbd] hover:text-white shadow-sm"
                                            : "text-primary-foreground hover:bg-[#dcccbd]/20 hover:text-primary-foreground"
                                    )}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, pagination.totalPages)
                                )
                            }
                            className={cn(
                                "cursor-pointer border-[#dcccbd] text-primary-foreground hover:bg-[#dcccbd] hover:text-white transition-all",
                                currentPage === pagination.totalPages && "pointer-events-none opacity-30"
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
