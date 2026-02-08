"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { errorContainer } from "@/lib/helper"

import { Search } from "lucide-react"

const SearchInput = ({ value, onChange }) => {
    const inputRef = React.useRef(null)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus()
        }, 10)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="p-2 border-b border-[#dcccbd] flex items-center gap-2 sticky top-0 bg-white z-10">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
                ref={inputRef}
                placeholder="Search"
                className="w-full text-sm outline-none bg-transparent"
                value={value}
                onChange={onChange}
                onKeyDown={(e) => e.stopPropagation()}
            />
        </div>
    )
}

function FormSelect({
    name,
    options = [],
    placeholder = "Select option",
    runForm = null,
    showError = true,
    className,
    triggerClassName,
    isSearch = false,
    ...props
}) {
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredOptions = React.useMemo(() => {
        if (!isSearch) return options
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [isSearch, options, searchQuery])

    return (
        <div className={cn("relative", className)}>
            <Select
                onValueChange={(value) => runForm?.setFieldValue(name, value)}
                value={runForm?.values[name] || ""}
                onOpenChange={(open) => {
                    if (!open) setSearchQuery("")
                }}
                {...props}
            >
                <SelectTrigger className={cn(
                    "h-11.25! px-4 py-1 border-muted-foreground rounded-md text-muted-foreground text-[14px] w-full bg-white",
                    triggerClassName
                )}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent
                    position={isSearch ? "popper" : "item-aligned"}
                    sideOffset={isSearch ? 4 : 0}
                    className={cn(
                        "bg-[#F8F5F2] border-[#dcccbd] p-0 overflow-hidden",
                        isSearch && "w-[var(--radix-select-trigger-width)]"
                    )}
                >
                    {isSearch && (
                        <SearchInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    )}
                    <div className={cn("overflow-y-auto", isSearch ? "max-h-[200px]" : "max-h-[300px]")}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground py-2.5 px-4"
                                >
                                    {option.label}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No results found
                            </div>
                        )}
                    </div>
                </SelectContent>
            </Select>
            {runForm && showError && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    )
}

export { FormSelect }
