"use client"

import * as React from "react"
import Image from "next/image"
import { Trash2, Share2, Download, Plus } from "lucide-react"
import { CommonModal } from "../CommonModal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DeleteConfirmationModal } from "../delete-confirmation-modal"
import CloseIcon from "@/assets/CloseIcon"
import { FloatingTextarea } from "../ui/floating-textarea"
import { FloatingInput } from "../ui/floating-input"

export function DesignViewModalImage({
    open,
    onOpenChange,
    images = [],
    currentImg,
    note: initialNote = "Initial Sketches Capturing Shape, Style, Design Direction, And Key Construction Ideas, Serving The Visual Blueprint For The Final Garment",
    assignedTo = "Name",
    submittedBy = "Name",
    status = "Pending",
    onDelete,
    onSave
}) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [note, setNote] = React.useState(initialNote)
    const [previewImage, setPreviewImage] = React.useState(null)
    const [currentImgIndex, setCurrentImgIndex] = React.useState(currentImg)
    const fileInputRef = React.useRef(null)
    React.useEffect(() => {
        if (open) {
            if (images.length > 0) {
                setPreviewImage(images[currentImg]?.src)
                setCurrentImgIndex(currentImg)
            }
            setNote(initialNote)
        }
    }, [open, images, initialNote])

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
            className="sm:max-w-[1000px]"
            contentClassName="max-w-[1000px] border-none shadow-none bg-transparent"
            containerClassName="px-4 py-4 sm:px-0 sm:py-4 lg:px-0 lg:py-4"
            IsClose={false}
        >
            <div className="bg-white rounded-[20px] overflow-hidden flex flex-col relative overflow-y-auto max-h-[80vh]">
                {/* Header Actions - Hidden in Edit Mode */}
                {!isEditing && (
                    <div className="px-4 py-4 flex items-center justify-between bg-white">
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


                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-10 gap-y-6 px-4 py-4 md:px-10 pb-6">
                    {/* Image Container */}
                    <div className="order-1">
                        <div className="relative w-full h-[250px] md:w-[300px] md:h-[300px] rounded-[24px] overflow-hidden border border-[#DCCCBD]/30 group">
                            {previewImage && <Image
                                src={previewImage}
                                alt="Design Preview"
                                fill
                                className={cn("object-cover", isEditing && "opacity-80")}
                            />}

                            {!isEditing && (
                                <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-9 h-9 flex items-center justify-center bg-[#A67F6F] hover:bg-[#8B6A5C] text-white rounded-full transition-colors shadow-lg">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button className="w-9 h-9 flex items-center justify-center bg-[#A67F6F] hover:bg-[#8B6A5C] text-white rounded-full transition-colors shadow-lg">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
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
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="order-3 lg:order-2 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FloatingInput
                                label="Design No"
                                value={assignedTo}
                                readOnly={!isEditing}
                            />
                            <FloatingInput
                                label="Assigned To"
                                value={assignedTo}
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FloatingInput
                                label="Submitted By"
                                value={submittedBy}
                                readOnly={!isEditing}
                            />
                            <FloatingInput
                                label="Current Status"
                                value={status}
                                readOnly={!isEditing}
                            />
                        </div>

                        <FloatingTextarea
                            label="Note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            readOnly={!isEditing}
                            className="min-h-[140px]"
                        />

                        {isEditing && (
                            <Button
                                onClick={handleSubmit}
                                className="mt-4 bg-[#DCCCBD] hover:bg-[#DCCCBD]/90 text-primary-foreground font-semibold h-12 rounded-xl text-[16px]"
                            >
                                Save Changes
                            </Button>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="order-2 lg:order-3 lg:col-span-full">
                        <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 custom-scrollbar">
                            {images?.map((thumb, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "relative w-20 h-20 group cursor-pointer border-5 rounded-md overflow-hidden flex-shrink-0",
                                        (currentImgIndex === idx ? "border-[#A67F6F]" : "border-transparent")
                                    )}
                                    onClick={() => { setCurrentImgIndex(idx); setPreviewImage(thumb.src) }}
                                >
                                    <div className={cn(
                                        "w-full h-full rounded-[12px] overflow-hidden border-2 transition-all border-[#A67F6F]",
                                    )}>
                                        <Image
                                            src={thumb.src}
                                            alt={`Version ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="absolute bottom-1 right-1 text-[10px] font-bold bg-white px-1 rounded">
                                        V{idx + 1}
                                    </span>
                                </div>
                            ))}
                            <button className="w-20 h-20 rounded-[12px] bg-[#F8F5F2] border border-[#DCCCBD]/30 flex items-center justify-center text-[#DCCCBD] hover:bg-[#F3F0EC] transition-colors flex-shrink-0">
                                <Plus className="w-8 h-8" />
                            </button>
                        </div>
                    </div>
                </div>
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

