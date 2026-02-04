"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function WorkflowProgressCard({
    title = "1. Inspirations",
    progress = 50,
    currentCount = 5,
    totalCount = 20,
    images = [],
    onSkip,
    onEditTarget,
    onCompleted,
    onAddImage
}) {
    return (
        <div className="w-full border border-[#dcccbd] rounded-[15px] overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div className="px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd] flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-[#1a1a1a] font-sans">
                    {title}
                </h3>
                <Button
                    variant="outline"
                    onClick={onSkip}
                    className="h-[32px] px-6 border-[#dcccbd] text-[#1a1a1a] rounded-[8px] hover:bg-[#F8F5F2] text-[14px] font-medium"
                >
                    Skip
                </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
                {/* Progress Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center text-[14px] font-medium text-[#1a1a1a]">
                            <span>Workflow Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="relative w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${progress}%`,
                                    background: "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)"
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 min-w-fit">
                        <span className="text-[18px] font-sans font-medium">
                            <span className="text-[#8DB88D]">{String(currentCount).padStart(2, '0')}</span>
                            <span className="text-[#1a1a1a]">/{totalCount}</span>
                        </span>
                        <Button
                            variant="outline"
                            onClick={onEditTarget}
                            className="h-[36px] bg-[#F8F5F2] border-none text-[#1a1a1a] rounded-[8px] hover:bg-[#F0EDE9] text-[14px] font-medium px-4"
                        >
                            Edit Target
                        </Button>
                    </div>
                </div>

                {/* Gallery Section */}
                <div className="flex flex-wrap items-center gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="w-[85px] h-[85px] rounded-[10px] overflow-hidden border border-[#dcccbd]">
                            <img src={img} alt={`Work ${idx}`} className="w-full h-full object-cover" />
                        </div>
                    ))}

                    <button
                        onClick={onAddImage}
                        className="w-[85px] h-[85px] rounded-[10px] border-none bg-[#F8F5F2] flex items-center justify-center hover:bg-[#F0EDE9] transition-colors"
                    >
                        <PlusIcon className="w-8 h-8 text-[#dcccbd]" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end pt-2">
                    <Button
                        onClick={onCompleted}
                        className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-[#1a1a1a] h-[40px] px-8 rounded-[8px] font-semibold text-[16px]"
                    >
                        Completed
                    </Button>
                </div>
            </div>
        </div>
    )
}
