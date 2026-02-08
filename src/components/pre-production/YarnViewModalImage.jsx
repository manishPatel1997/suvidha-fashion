"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { CommonModal } from "../CommonModal";
import CloseIcon from "@/assets/CloseIcon";
import { cn } from "@/lib/utils";

export function YarnViewModalImage({ onOpenChange, open }) {
    const [image, setImage] = React.useState(null);
    const [color, setColor] = React.useState("#CCC0B0");
    const fileInputRef = React.useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    return (
        <CommonModal
            open={open}
            onOpenChange={onOpenChange}
            className="sm:max-w-[1200px]"
            contentClassName="max-w-[1200px] border-none shadow-none bg-transparent"
            containerClassName="px-4 py-4 sm:px-0 sm:py-4 lg:px-8 lg:pt-6 lg:pb-12"
            IsClose={false}
        >
            <div className="bg-white rounded-[20px] overflow-hidden flex flex-col relative overflow-y-auto max-h-[80vh]">
                <div className="self-end px-4 md:px-10">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-primary-foreground hover:opacity-70 transition-opacity  "
                    >
                        <CloseIcon width={17} height={17} color="#1a1a1a" />
                    </Button>
                </div>
                <div className="px-4 py-4 md:px-10 pb-6 flex flex-col md:flex-row gap-8">
                    <div
                        className="relative  h-[300px] md:h-auto md:w-[45%] rounded-[24px] overflow-hidden border border-[#DCCCBD]/30 group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image
                            src={image || "/design-thumb.png"}
                            alt="Yarn Preview"
                            fill
                            className={cn("object-cover")}
                        />
                        <div className="absolute inset-0 bg-[#1A1A1A]/40 flex items-center justify-center">
                            <Button
                                variant="secondary"
                                className="bg-[#D3D1CF] text-[#1A1A1A] font-semibold text-[18px] border-none shadow-sm h-10 px-6 rounded-lg pointer-events-none"
                            >
                                Upload New Image
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    {/* Right Side - Form */}
                    <div className="w-full md:w-[55%] space-y-6">



                        <div className="flex gap-4">
                            <div className="flex-1">
                                <FloatingInput label="Yarn Id" defaultValue="Y-1550" />
                            </div>
                            <div className="flex-1">
                                <FloatingInput label="Yarn" defaultValue="Cotton Yarn" hasEdit />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <FloatingInput label="Yarn Num Cons" defaultValue="40/1" hasEdit />
                            </div>
                            <div className="flex-1">
                                <FloatingInput label="Yarn Price" defaultValue="₹ 200 Meter" />
                            </div>
                        </div>

                        <FloatingInput
                            label="Yarn Vendor"
                            defaultValue="Shree Laxmi Yarn Traders, Surat"
                        />

                        <div className="relative">
                            <div
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm border border-gray-200 z-10 cursor-pointer overflow-hidden"
                                style={{ backgroundColor: color }}
                            >
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="opacity-0 w-full h-full cursor-pointer p-0 border-none"
                                />
                            </div>
                            <FloatingInput
                                label="Yarn Color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                onBlur={(e) => {
                                    if (!e.target.value) setColor("#CCC0B0");
                                }}
                                className="pl-10 uppercase"
                            />
                        </div>

                        <div className="pt-2">
                            <FloatingTextarea
                                label="Note"
                                defaultValue="Soft Texture With High Durability And Consistent Strength, Ideal For Knitting And Weaving Across A Wide Range Of Fabric Applications"
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CommonModal>
    );
}
