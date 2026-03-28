"use client"

import * as React from "react"
import Image from "next/image"
import { Trash2, Share2, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CloseIcon from "@/assets/CloseIcon"
import { usePost } from "@/hooks/useApi"
import { downloadImage, toFormData, StateUpdate } from "@/lib/helper"
import { API_LIST_AUTH, API_PRODUCTION } from "@/hooks/api-list"
import { CommonModal } from "@/components/CommonModal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Input } from "@/components/ui/input"
import { FormSelect } from "@/components/ui/form-select"
import { FormColorPicker } from "@/components/ui/form-color-picker"
import clsx from "clsx"

export function ProductionViewModal({
    open,
    onOpenChange,
    selectedData,
    onDeleteSuccess,
    onUpdateSuccess,
}) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({})
    const [previewImage, setPreviewImage] = React.useState(null)
    const [selectedFile, setSelectedFile] = React.useState(null)
    const fileInputRef = React.useRef(null)

    const { mutate: deleteSample, isPending: isDeleting } = usePost(API_PRODUCTION.delete, {
        onSuccess: (res, variables) => {
            if (res.success) {
                if (onDeleteSuccess) onDeleteSuccess(variables.production_items_id)
                onOpenChange(false)
            }
        },
        onError: (error) => {
            console.error("Error deleting sample:", error)
        }
    })

    const { mutate: getSampleDetails, isPending: isLoadingDetails } = usePost(API_PRODUCTION.sample_get, {
        onSuccess: (res) => {
            if (res.success && res.data) {
                const data = res.data;
                const details = data.details || {};
                setFormData(prev => ({
                    ...prev,
                    sample_id: data.sample_id ? String(data.sample_id) : prev.sample_id,
                    design_id: details.sample_design_no || prev.design_id,
                    status: data.status ? (data.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')) : prev.status,
                    edit_note: data.edit_note ?? prev.edit_note ?? "",
                    note: data.note ?? prev.note ?? "",
                    yarn: details.yarn_name || prev.yarn,
                    quality_con: details.quality_con || prev.quality_con,
                    sequence: details.sequence_name || prev.sequence,
                    cd_con: details.sample_cd_con || prev.cd_con,
                    meter: details.sample_meter || prev.meter,
                    sample_design_no: details.sample_design_no || prev.sample_design_no,
                    yarn_color: details.yarn_color || prev.yarn_color,
                }));
                if (data.image) {
                    setPreviewImage(`${process.env.NEXT_PUBLIC_API_URL}${data.image}`);
                }
            }
        },
        onError: (error) => {
            console.error("Error fetching sample details:", error);
        }
    })
 
    const { mutate: updateProduction, isPending: isUpdating } = usePost(API_PRODUCTION.update, {
        isFormData: true,
        onSuccess: (res) => {
            if (res.success) {
                if (onUpdateSuccess) onUpdateSuccess()
                setIsEditing(false)
            }
        },
        onError: (error) => {
            console.error("Error updating production:", error)
        }
    })

    // Reset state when modal opens/closes or when selectedData changes
    React.useEffect(() => {
        if (!open) {
            setIsEditing(false)
            setIsDeleteModalOpen(false)
            setSelectedFile(null)
        }
        if (open && selectedData?.id) {
            // Initial load from selectedData as fallback/placeholder
            setFormData({
                sample_id: selectedData.id || "",
                design_id: selectedData.design_id || "",
                status: selectedData.status || "In Process",
                edit_note: selectedData.edit_note || selectedData.edit || "",
                note: selectedData.note || "",
                yarn: selectedData.yarn || "",
                quality_con: selectedData.quality_con || "",
                sequence: selectedData.sequence || "",
                cd_con: selectedData.cd_con || "",
                meter: selectedData.meter || "",
                sample_design_no: selectedData.sample_design_no || "",
                yarn_color: selectedData.yarn_color || "",
            })
            setPreviewImage(selectedData.image_url ? `${process.env.NEXT_PUBLIC_API_URL}${selectedData.image_url}` : "/design-thumb.png")
            console.log('selectedData', selectedData)
            // Fetch latest data from API
            getSampleDetails({ production_items_id: String(selectedData.sample_id) })
        }
    }, [open, selectedData, getSampleDetails])

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

    const handleFieldChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        const payload = {
            ...formData,
            production_items_id: String(selectedData.sample_id),
            image: selectedFile,
        }
        updateProduction(toFormData(payload))
    }

    const statusOptions = [
        { value: "Pending", label: "Pending" },
        { value: "In Process", label: "In Process" },
        { value: "Completed", label: "Completed" },
    ]

    return (
        <CommonModal
            open={open}
            onOpenChange={onOpenChange}
            className="sm:max-w-[950px]"
            contentClassName="max-w-[950px] border-none shadow-none bg-transparent"
            containerClassName="px-4 py-4 sm:px-0 sm:py-4 lg:px-0 lg:py-4"
            IsClose={false}
        >
            <div className="bg-white rounded-[20px] overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header Actions */}
                <div className="px-6 py-4 md:px-10 flex items-center justify-between bg-white border-b border-[#dcccbd]/30">
                    <Button
                        variant="ghost"
                        onClick={() => setIsEditing(!isEditing)}
                        className={cn(
                            "h-9 px-6 rounded-md text-[14px] font-semibold transition-colors",
                            isEditing
                                ? "bg-[#DCCCBD] text-primary-foreground hover:bg-[#DCCCBD]/90"
                                : "bg-[#F3F0EC] hover:bg-[#E8E2DA] text-primary-foreground"
                        )}
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </Button>

                    <div className="flex items-center gap-4">
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

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="px-6 py-6 md:px-10 space-y-8">
                        {/* Top Section: Image and Basic Fields */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* Left: Image Preview */}
                            <div className="relative w-full aspect-4/3 rounded-[20px] overflow-hidden bg-[#F8F5F2] group">
                                {previewImage && (
                                    <Image
                                        src={previewImage}
                                        alt="Production Preview"
                                        fill
                                        className={cn("object-cover", isEditing && "opacity-80")}
                                        sizes="(max-width: 1024px) 100vw, 450px"
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

                                {!isEditing && previewImage && (
                                    <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-9 h-9 flex items-center justify-center bg-[#A67F6F] hover:bg-[#8B6A5C] text-white rounded-full shadow-lg">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="w-9 h-9 flex items-center justify-center bg-[#A67F6F] hover:bg-[#8B6A5C] text-white rounded-full shadow-lg"
                                            onClick={() => downloadImage(previewImage)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Right: Basic Fields */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[12px] font-medium text-[#B0826A] ml-2">Sample Id</label>
                                        <Input
                                            value={formData.sample_id}
                                            readOnly={true}
                                            onChange={(e) => handleFieldChange("sample_id", e.target.value)}
                                            className="h-11 rounded-[10px] border-[#dcccbd] bg-gray-50!"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[12px] font-medium text-[#B0826A] ml-2">Design Id</label>
                                        <Input
                                            value={formData.design_id}
                                            readOnly={true}
                                            onChange={(e) => handleFieldChange("design_id", e.target.value)}
                                            className="h-11 rounded-[10px] border-[#dcccbd] bg-gray-50!"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Status</label>
                                    <FormSelect
                                        options={statusOptions}
                                        value={formData.status}
                                        readOnly={true}
                                        onValueChange={(val) => handleFieldChange("status", val)}
                                        triggerClassName="h-11 rounded-[10px] border-[#dcccbd]! bg-gray-50!"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Edit</label>
                                    <FloatingTextarea
                                        value={formData.edit_note}
                                        readOnly={!isEditing}
                                        onChange={(e) => handleFieldChange("edit_note", e.target.value)}
                                        isFloating={false}
                                        className="min-h-[80px] rounded-[10px] border-[#dcccbd]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Note</label>
                                    <FloatingTextarea
                                        value={formData.note}
                                        readOnly={!isEditing}
                                        onChange={(e) => handleFieldChange("note", e.target.value)}
                                        isFloating={false}
                                        className="min-h-[80px] rounded-[10px] border-[#dcccbd]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Sample Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-1.5 bg-[#DCCCBD] text-primary-foreground font-bold text-[14px] rounded-md">
                                    Sample Details:
                                </div>
                                <div className="h-px flex-1 bg-[#dcccbd]/30" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Yarn</label>
                                    <Input
                                        value={formData.yarn}
                                        readOnly={true}
                                        onChange={(e) => handleFieldChange("yarn", e.target.value)}
                                        className="h-11 rounded-[10px] border-[#dcccbd] bg-gray-50!"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Quality Con</label>
                                    <Input
                                        value={formData.quality_con}
                                        readOnly={true}
                                        onChange={(e) => handleFieldChange("quality_con", e.target.value)}
                                        className="h-11 rounded-[10px] border-[#dcccbd] bg-gray-50!"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Sequence</label>
                                    <Input
                                        value={formData.sequence}
                                        readOnly={true}
                                        onChange={(e) => handleFieldChange("sequence", e.target.value)}
                                        className="h-11 rounded-[10px] border-[#dcccbd] bg-gray-50!"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">CD Con</label>
                                    <Input
                                        value={formData.cd_con}
                                        readOnly={true}
                                        onChange={(e) => handleFieldChange("cd_con", e.target.value)}
                                        className="h-11 rounded-[10px] border-[#dcccbd] bg-gray-50!"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Meter</label>
                                    <Input
                                        value={formData.meter}
                                        readOnly={true}
                                        onChange={(e) => handleFieldChange("meter", e.target.value)}
                                        className="h-11 rounded-[10px] border-[#dcccbd] bg-gray-50!"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Design No</label>
                                    <Input
                                        value={formData.sample_design_no}
                                        readOnly={true}
                                        onChange={(e) => handleFieldChange("sample_design_no", e.target.value)}
                                        className="h-11 rounded-[10px] border-[#dcccbd] bg-gray-50!"
                                    />
                                </div>
                                <div className="space-y-1 select-none">
                                    <label className="text-[12px] font-medium text-[#B0826A] ml-2">Yarn Colors</label>
                                    <FormColorPicker
                                        value={formData.yarn_color}
                                        readOnly={true}
                                        onChange={(val) => handleFieldChange("yarn_color", val)}
                                        isFloating={false}
                                        className="h-11 rounded-[10px] border-[#dcccbd]! bg-gray-50!"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Submit Button */}
                {isEditing && (
                    <div className="px-6 py-6 md:px-10 flex justify-end bg-white border-t border-[#dcccbd]/30">
                        <Button
                            onClick={handleSubmit}
                            disabled={isUpdating}
                            className="bg-[#DCCCBD] hover:bg-[#DCCCBD]/90 text-primary-foreground font-semibold h-11 px-16 rounded-lg transition-all"
                        >
                            {isUpdating ? "Submitting..." : "Submit Changes"}
                        </Button>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isLoading={isDeleting}
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                onConfirm={() => {
                    deleteSample({ production_items_id: String(selectedData?.sample_id) })
                }}
            />
        </CommonModal>
    )
}
