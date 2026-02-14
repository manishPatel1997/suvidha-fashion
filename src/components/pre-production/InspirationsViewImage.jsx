"use client"

import * as React from "react"
import Image from "next/image"
import { Trash2, Share2, Download } from "lucide-react"
import { CommonModal } from "../CommonModal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DeleteConfirmationModal } from "../delete-confirmation-modal"
import CloseIcon from "@/assets/CloseIcon"
import { FloatingTextarea } from "../ui/floating-textarea"

export function InspirationsViewImage({
    open,
    onOpenChange,
    selectedData,
    onDelete,
    onEdit,
    isLoading
}) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [note, setNote] = React.useState('')
    const [previewImage, setPreviewImage] = React.useState(selectedData?.image_url ? `${process.env.NEXT_PUBLIC_API_URL}${selectedData?.image_url}` : null)
    const [selectedFile, setSelectedFile] = React.useState(null)
    const fileInputRef = React.useRef(null)
    // Reset state when modal opens/closes or when imageSrc changes
    React.useEffect(() => {
        if (!open) {
            setIsEditing(false)
            setIsDeleteModalOpen(false)
            setSelectedFile(null)
        }
        setNote(selectedData?.note)
        setPreviewImage(selectedData?.image_url ? `${process.env.NEXT_PUBLIC_API_URL}${selectedData?.image_url}` : null)
    }, [open, selectedData])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = () => {
        if (onEdit) {
            onEdit({ image: selectedFile, note })
        }
    }

    return (
        <CommonModal
            open={open}
            onOpenChange={onOpenChange}
            className="sm:max-w-[600px]"
            contentClassName="max-w-[600px] border-none shadow-none bg-transparent"
            containerClassName="px-4 py-4 sm:px-0 sm:py-4 lg:px-0 lg:py-4"
            IsClose={false}
        >
            <div className="bg-white rounded-[20px] overflow-hidden flex flex-col">
                {/* Header Actions - Hidden in Edit Mode */}
                {!isEditing && (
                    <div className="px-4 py-4 md:px-10 flex items-center justify-between bg-white">
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
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="text-primary-foreground hover:opacity-70 transition-opacity"
                            >
                                <CloseIcon width={17} height={17} color="#1a1a1a" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Extra padding when header is hidden */}
                {/* {isEditing && <div className="pt-10" />} */}
                {isEditing &&
                    <div className="self-end px-4 md:px-10">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                            className="text-primary-foreground hover:opacity-70 transition-opacity"
                        >
                            <CloseIcon width={17} height={17} color="#1a1a1a" />
                        </Button>
                    </div>
                }

                {/* Image Preview Container */}
                <div className="px-4 py-4 md:px-10 pb-6 flex flex-col items-center">
                    <div className="relative w-full aspect-square max-w-[450px] rounded-[20px] overflow-hidden group">
                        {previewImage && (
                            <Image
                                src={previewImage}
                                alt="Design Preview"
                                fill
                                className={cn("object-cover", isEditing && "opacity-80")}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
                            // sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 150px"
                            // loading="lazy"
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

                        {/* {!isEditing && (
                            <>
                                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                                    <button className="w-8 h-8 flex items-center justify-center bg-[#DCCCBD]/80 hover:bg-[#DCCCBD] text-white rounded-full transition-colors shadow-sm">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center bg-[#DCCCBD]/80 hover:bg-[#DCCCBD] text-white rounded-full transition-colors shadow-sm">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )} */}
                    </div>

                    {/* Note Section */}
                    <div className="mt-8 w-full">
                        <FloatingTextarea
                            label={isEditing ? "Add a note" : "Note"}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            readOnly={!isEditing}
                            className="min-h-[80px]"
                        />
                    </div>
                    {/* <div className="mt-8 w-full">
                        <div className="relative border border-[#dcccbd] rounded-[10px] p-4 pt-6">
                            <span className="absolute -top-3 left-6 bg-white px-2 text-[14px] font-medium text-[#B0826A]">
                                Note
                            </span>
                            {isEditing ? (
                                <>
                                    <FloatingTextarea
                                        label="Add a note"
                                        defaultValue={note}
                                        className="min-h-[80px]"
                                    />
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full min-h-[60px] text-[14px] text-primary-foreground leading-relaxed outline-none resize-none bg-transparent"
                                        placeholder="Add a note..."
                                    />
                                </>
                            ) : (
                                <p className="text-[14px] text-primary-foreground leading-relaxed">
                                    {note}
                                </p>
                            )}
                        </div>
                    </div> */}
                </div>

                {/* Submit Button in Edit Mode */}
                {isEditing && (
                    <div className="px-10 flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-[#DCCCBD] hover:bg-[#DCCCBD]/90 text-primary-foreground font-semibold h-10 px-12 rounded-lg"
                        >
                            {isLoading ? "Updating..." : "Submit"}
                        </Button>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isLoading={isLoading}
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                onConfirm={() => {
                    if (onDelete) onDelete(selectedData?.id)
                    onOpenChange(false)
                }}
            />
        </CommonModal>
    )
}
