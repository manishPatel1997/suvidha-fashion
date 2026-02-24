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
import { Label } from "@/components/ui/label"

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
    label,
    floatingUi = false,
    readOnly = false,
    onChange,
    ...props
}) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const id = React.useId()
    const value = runForm?.values[name] || ""
    const hasValue = value !== ""

    const filteredOptions = React.useMemo(() => {
        if (!isSearch) return options

        const search = searchQuery.toLowerCase()

        return options.filter((option) => {
            const nameMatch =
                option.label?.toLowerCase().includes(search)

            const emailMatch =
                option.email?.toLowerCase().includes(search)

            return nameMatch || emailMatch
        })
    }, [isSearch, options, searchQuery])

    return (
        <div className={cn("relative", className)}>
            <Select
                onValueChange={(value) => {
                    runForm?.setFieldValue(name, value)
                    onChange?.(value)
                }}
                value={value}
                onOpenChange={(open) => {
                    if (!open) setSearchQuery("")
                }}
                {...props}
            >
                <SelectTrigger
                    id={id}
                    className={cn(
                        floatingUi
                            ? "h-12 w-full rounded-md border border-muted-foreground bg-transparent px-3 pb-1 text-[16px] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-muted-foreground outline-none!"
                            : "h-11.25! px-4 py-1 border-muted-foreground rounded-md text-muted-foreground text-[14px] w-full bg-white",
                        readOnly && "pointer-events-none select-none",
                        triggerClassName
                    )}
                >
                    <SelectValue placeholder={floatingUi ? " " : placeholder} />
                </SelectTrigger>

                <SelectContent
                    position={isSearch ? "popper" : "item-aligned"}
                    sideOffset={isSearch ? 4 : 0}
                    className={cn(
                        "bg-[#F8F5F2] border-[#dcccbd] p-0 overflow-hidden",
                        isSearch &&
                        "w-[var(--radix-select-trigger-width)]"
                    )}
                >
                    {isSearch && (
                        <SearchInput
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.target.value)
                            }
                        />
                    )}

                    <div className="overflow-y-auto max-h-[250px]">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground py-2.5 px-4"
                                >
                                    <div className="flex flex-col">
                                        <span>{option.label}</span>
                                        {/* {option.email && (
                                            <span className="text-xs text-muted-foreground">
                                                {option.email}
                                            </span>
                                        )} */}
                                    </div>
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

            {floatingUi && label && (
                <Label
                    htmlFor={id}
                    className={cn(
                        "absolute left-3 transition-all duration-150 transform z-10 origin-left bg-white px-1 pointer-events-none select-none",
                        hasValue
                            ? "top-2 -translate-y-4 scale-100 text-[#B0826A] text-[14px] font-semibold"
                            : "top-4 translate-y-0 scale-100 text-muted-foreground text-[16px] bg-transparent"
                    )}
                    style={{ fontFamily: "Lato" }}
                >
                    {label}
                </Label>
            )}

            {runForm && showError && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    )
}

export { FormSelect }
