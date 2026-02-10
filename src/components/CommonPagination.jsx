import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
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

    return (
        <div className={cn("flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pb-10", className)}>
            <div className="flex items-center gap-2">
                <span className="text-sm text-primary-foreground font-medium whitespace-nowrap">
                    Show per page:
                </span>
                <Select
                    value={limit.toString()}
                    onValueChange={(val) => {
                        setLimit(parseInt(val));
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-[70px] h-9 border-[#dcccbd] text-primary-foreground">
                        <SelectValue placeholder={limit.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={cn(
                                "cursor-pointer border-[#dcccbd] text-primary-foreground hover:bg-[#dcccbd]/20",
                                currentPage === 1 && "pointer-events-none opacity-50"
                            )}
                        />
                    </PaginationItem>

                    <PaginationItem>
                        <span className="text-sm text-primary-foreground font-medium px-4">
                            Page {currentPage} of {pagination.totalPages}
                        </span>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, pagination.totalPages)
                                )
                            }
                            className={cn(
                                "cursor-pointer border-[#dcccbd] text-primary-foreground hover:bg-[#dcccbd]/20",
                                currentPage === pagination.totalPages && "pointer-events-none opacity-50"
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
