"use client"

import * as React from "react"
import Image from "next/image"
import { Trash2, Share2, Download } from "lucide-react"
import { CommonModal } from "./CommonModal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"

export function ImageDetailModal({
    open,
    onOpenChange,
    imageSrc = "/design-thumb.png",
    note: initialNote = "This Is The Initial Set Of Inspiration Visuals For Color Palette, Pattern, And Style Direction",
    onEdit,
    onDelete,
    onSave
}) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [note, setNote] = React.useState(initialNote)
    const [previewImage, setPreviewImage] = React.useState(imageSrc)
    const fileInputRef = React.useRef(null)

    // Reset state when modal opens/closes or when imageSrc changes
    React.useEffect(() => {
        if (!open) {
            setIsEditing(false)
            setIsDeleteModalOpen(false)
        }
        setNote(initialNote)
        setPreviewImage(imageSrc)
    }, [open, initialNote, imageSrc])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = () => {
        if (onSave) {
            onSave({ image: previewImage, note })
        }
        setIsEditing(false)
    }

    return (
        <CommonModal
            open={open}
            onOpenChange={onOpenChange}
            className="sm:max-w-[700px]"
            contentClassName="max-w-[600px] border-none shadow-none bg-transparent"
            containerClassName="py-10 lg:px-10 lg:py-15"
        >
            <div className="bg-white rounded-[20px] overflow-hidden flex flex-col">
                {/* Header Actions - Hidden in Edit Mode */}
                {!isEditing && (
                    <div className="px-6 py-4 flex items-center justify-between bg-white">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditing(true)}
                            className="h-9 px-6 bg-[#F3F0EC] hover:bg-[#E8E2DA] text-primary-foreground rounded-md text-[14px] font-semibold"
                        >
                            Edit
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="h-9 px-4 bg-[#FDF2F2] hover:bg-[#FBE4E4] text-[#E5484D] rounded-md text-[14px] font-semibold flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                )}

                {/* Extra padding when header is hidden */}
                {isEditing && <div className="pt-10" />}

                {/* Image Preview Container */}
                <div className="px-10 pb-6 flex flex-col items-center">
                    <div className="relative w-full aspect-square max-w-[450px] rounded-[20px] overflow-hidden group">
                        {previewImage && (
                            <Image
                                src={previewImage}
                                alt="Design Preview"
                                fill
                                className={cn("object-cover", isEditing && "opacity-80")}
                            />
                        )}

                        {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white hover:bg-white/90 text-primary-foreground font-semibold px-6 py-2 rounded-md shadow-md"
                                >
                                    Upload New Image
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </div>
                        )}

                        {!isEditing && (
                            <>
                                {/* Floating Action Buttons */}
                                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                                    <button className="w-8 h-8 flex items-center justify-center bg-[#DCCCBD]/80 hover:bg-[#DCCCBD] text-white rounded-full transition-colors shadow-sm">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center bg-[#DCCCBD]/80 hover:bg-[#DCCCBD] text-white rounded-full transition-colors shadow-sm">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Note Section */}
                    <div className="mt-8 w-full">
                        <div className="relative border border-[#dcccbd] rounded-[10px] p-4 pt-6">
                            <span className="absolute -top-3 left-6 bg-white px-2 text-[14px] font-medium text-[#B0826A]">
                                Note
                            </span>
                            {isEditing ? (
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full min-h-[60px] text-[14px] text-primary-foreground leading-relaxed outline-none resize-none bg-transparent"
                                    placeholder="Add a note..."
                                />
                            ) : (
                                <p className="text-[14px] text-primary-foreground leading-relaxed">
                                    {note}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button in Edit Mode */}
                {isEditing && (
                    <div className="px-10 pb-10 flex justify-center">
                        <Button
                            onClick={handleSubmit}
                            className="bg-[#DCCCBD] hover:bg-[#DCCCBD]/90 text-primary-foreground font-semibold h-10 px-12 rounded-lg"
                        >
                            Submit
                        </Button>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                onConfirm={() => {
                    if (onDelete) onDelete()
                    onOpenChange(false)
                }}
            />
        </CommonModal>
    )
}
