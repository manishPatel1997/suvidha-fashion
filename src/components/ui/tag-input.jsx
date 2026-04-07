"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { errorContainer } from "@/lib/helper";

export function TagInput({
    name,
    runForm,
    label,
    className,
    readOnly = false,
}) {
    const [inputValue, setInputValue] = React.useState("");
    const value = runForm ? (runForm.values[name] || "") : "";
    const tags = value ? value.split(",").map((t) => t.trim()).filter((t) => t.length > 0) : [];
    const hasValue = tags.length > 0 || inputValue.length > 0;
    const id = React.useId();

    const addTag = (newTag) => {
        if (readOnly) return;
        const trimmed = newTag.trim();
        if (!trimmed) return;
        if (!tags.includes(trimmed)) {
            const newTags = [...tags, trimmed];
            runForm?.setFieldValue(name, newTags.join(","));
        }
        setInputValue("");
    };

    const removeTag = (indexToRemove) => {
        if (readOnly) return;
        const newTags = tags.filter((_, i) => i !== indexToRemove);
        runForm?.setFieldValue(name, newTags.length > 0 ? newTags.join(",") : "");
    };

    return (
        <div className={cn("relative z-0 group", className)}>
            <div
                className={cn(
                    "min-h-[48px] w-full rounded-md border border-muted-foreground bg-transparent px-3 pb-1 pt-[14px] text-[16px] text-[#1A1A1A] flex flex-wrap gap-2 items-center cursor-text transition-all",
                    "group-focus-within:ring-1 group-focus-within:ring-muted-foreground group-focus-within:outline-none"
                )}
                onClick={() => !readOnly && document.getElementById(id)?.focus()}
            >
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-[#E5DFDB] text-[#1A1A1A] px-3 py-1 rounded-full text-[14px] font-medium leading-none whitespace-nowrap cursor-default! my-0.5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {tag}
                        {!readOnly && (
                            <button
                                type="button"
                                className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] focus:outline-none transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTag(index);
                                }}
                            >
                                <X size={14} strokeWidth={2.5} />
                            </button>
                        )}
                    </span>
                ))}
                {!readOnly && (
                    <input
                        id={id}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag(inputValue);
                            } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
                                removeTag(tags.length - 1);
                            }
                        }}
                        onBlur={() => addTag(inputValue)}
                        className="flex-1 bg-transparent min-w-[80px] outline-none border-none text-[16px] p-0 shadow-none m-0 focus:ring-0 focus:outline-none text-[#1A1A1A]"
                    />
                )}
            </div>

            {label && (
                <label
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
                </label>
            )}

            {runForm && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    );
}
