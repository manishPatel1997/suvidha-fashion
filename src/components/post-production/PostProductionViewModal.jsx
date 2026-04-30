"use client"

import * as React from "react"
import Image from "next/image"
import { Share2, Download, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CloseIcon from "@/assets/CloseIcon"
import { usePost } from "@/hooks/useApi"
import { downloadImage, toFormData } from "@/lib/helper"
import { API_PRODUCTION, API_POST_PRODUCTION, API_LIST_AUTH } from "@/hooks/api-list"
import { CommonModal } from "@/components/CommonModal"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingInput } from "@/components/ui/floating-input"
import { Input } from "@/components/ui/input"
import { FormSelect } from "@/components/ui/form-select"

export function PostProductionViewModal({
    open,
    onOpenChange,
    selectedData,
    titleName,
    onUpdateSuccess,
}) {
    console.log('selectedData?.sample_details', selectedData?.sample_details)
    const [isEditing, setIsEditing] = React.useState(false)
    const [formData, setFormData] = React.useState({})
    const [vendorOptions, setVendorOptions] = React.useState([])
    const [previewImage, setPreviewImage] = React.useState(null)
    const [sampleDetails, setSampleDetails] = React.useState(null)
    const [selectedFile, setSelectedFile] = React.useState(null)
    const fileInputRef = React.useRef(null)

    const { mutate: getSampleDetails } = usePost(API_PRODUCTION.sample_get, {
        onSuccess: (res) => {
            if (res.success && res.data) {
                setSampleDetails(res.data)
            }
        },
        onError: (error) => {
            console.error("Error fetching sample details:", error);
        }
    })

    const updateApi = React.useMemo(() => {
        switch (titleName) {
            case "Deko": return API_POST_PRODUCTION.deko_update;
            case "Mill": return API_POST_PRODUCTION.mill_update;
            case "Photography": return API_POST_PRODUCTION.photography_update;
            case "Folder": return API_POST_PRODUCTION.folder_update;
            default: return API_POST_PRODUCTION.deko_update;
        }
    }, [titleName])

    const { mutate: updatePostProduction, isPending: isUpdating } = usePost(updateApi, {
        isFormData: true,
        onSuccess: (res) => {
            if (res.success) {
                if (onUpdateSuccess) onUpdateSuccess(res.data)
                setIsEditing(false)
            }
        },
        onError: (error) => {
            console.error("Error updating post production:", error)
        }
    })

    const { mutate: getVendors } = usePost(API_LIST_AUTH.Vendor.type, {
        onSuccess: (res) => {
            if (res.success && res.data) {
                const options = res.data.map(item => ({
                    value: String(item.id),
                    label: item.name
                }))
                setVendorOptions(options)
            }
        },
        onError: (error) => {
            console.error("Error fetching vendors:", error)
        }
    })

    React.useEffect(() => {
        if (!open) {
            setIsEditing(false)
            setSelectedFile(null)
        }
        if (open && selectedData) {
            getVendors({ type: "mill" })
            setFormData({
                id: selectedData.id || "",
                status: selectedData.status ? (selectedData.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')) : "In Process",
                assign_user_name: selectedData.assign_user_name || "",
                assign_user_id: selectedData.assign_id || "",
                sample_id: selectedData.sample_id || "",
                design_id: selectedData.design_id || "",
                edit_note: selectedData.edit_note || "",
                note: selectedData.note || "",
            })
            setPreviewImage(selectedData?.image_url ? `${process.env.NEXT_PUBLIC_BASE_URL}${selectedData?.image_url}` : "/design-thumb.png")

            // Fetch sample details if we have a sample_id
            if (selectedData.sample_id) {
                getSampleDetails({ production_items_id: String(selectedData.id) })
            }
        }
    }, [open, selectedData, getSampleDetails, getVendors])

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
        const idKey = `${titleName.toLowerCase()}_assign_id`
        const payload = {
            image_url: selectedFile,
            [idKey]: String(selectedData.id),
            status: formData.status?.toLowerCase().replace(" ", "_"),
            assign_id: String(formData.assign_user_id || ""),
            // edit_note: formData.edit_note,
            // note: formData.note,
        }
        updatePostProduction(toFormData(payload))
    }

    const statusOptions = [
        { value: "Pending", label: "Pending" },
        { value: "Completed", label: "Completed" },
    ]

    return (
        <CommonModal
            open={open}
            onOpenChange={onOpenChange}
            className="sm:max-w-[1050px]"
            contentClassName="max-w-[1050px] border-none shadow-none bg-transparent"
            containerClassName="px-4 py-4 sm:px-0 sm:py-4 lg:px-0 lg:py-4"
            IsClose={false}
        >
            <div className="bg-white rounded-[20px] overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header Actions */}
                <div className="px-6 py-4 md:px-10 flex items-center justify-between bg-white">
                    <Button
                        variant="ghost"
                        onClick={() => setIsEditing(!isEditing)}
                        className={cn(
                            "h-9 px-4 flex items-center gap-2 rounded-md text-[14px] font-semibold transition-colors",
                            isEditing
                                ? "bg-[#DCCCBD] text-primary-foreground hover:bg-[#DCCCBD]/90"
                                : "bg-[#F3F0EC] hover:bg-[#E8E2DA] text-primary-foreground"
                        )}
                    >
                        {!isEditing && <Edit2 className="w-4 h-4" />}
                        {isEditing ? "Cancel" : "Edit"}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-primary-foreground hover:opacity-70 transition-opacity"
                    >
                        <CloseIcon width={17} height={17} color="#1a1a1a" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="px-6 pb-6 md:px-10 space-y-8">
                        {/* Top Section: Title Specific Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-1.5 bg-[#DCCCBD] text-primary-foreground font-bold text-[14px] rounded-md">
                                    {titleName} Details:
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-12 gap-y-8 items-start">
                                {/* Image Preview */}
                                <div className="relative w-full aspect-19/10 lg:w-[380px] lg:h-[200px] rounded-[12px] overflow-hidden bg-[#F8F5F2] group border /40">
                                    {previewImage && (
                                        <Image
                                            src={previewImage}
                                            alt="Post Production Preview"
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

                                {/* Basic Fields */}
                                <div className="space-y-6 flex-1">
                                    <FormSelect
                                        label="Status"
                                        floatingUi={true}
                                        options={statusOptions}
                                        value={formData.status}
                                        readOnly={!isEditing}
                                        onValueChange={(val) => handleFieldChange("status", val)}
                                        triggerClassName={cn(
                                            "h-12! rounded-[10px]!",
                                            !isEditing && "bg-white!"
                                        )}
                                    />

                                    <FormSelect
                                        label="Assign"
                                        floatingUi={true}
                                        options={vendorOptions}
                                        value={String(formData.assign_user_id || "")}
                                        readOnly={!isEditing}
                                        onValueChange={(val) => {
                                            const selectedVendor = vendorOptions.find(opt => opt.value === val)
                                            setFormData(prev => ({
                                                ...prev,
                                                assign_user_id: val,
                                                assign_user_name: selectedVendor?.label || ""
                                            }))
                                        }}
                                        triggerClassName={cn(
                                            "h-12! rounded-[10px]!",
                                            !isEditing && "bg-white!"
                                        )}
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
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-12 gap-y-8 items-start">
                                {/* Sample Image */}
                                <div className="relative w-full aspect-19/10 lg:w-[380px] lg:h-[330px] rounded-[12px] overflow-hidden bg-[#F8F5F2] border /40">
                                    <Image
                                        src={sampleDetails?.image ? `${process.env.NEXT_PUBLIC_API_URL}${sampleDetails.image}` : (selectedData?.src || "/design-thumb.png")}
                                        alt="Sample Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Sample Fields */}
                                <div className="space-y-6 flex-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            label="Sample Id"
                                            value={selectedData?.sample_details?.sample_id}
                                            readOnly={true}
                                            className="h-12 rounded-[10px]  bg-white!"
                                        />
                                        <FloatingInput
                                            label="Design Id"
                                            value={selectedData?.sample_details?.design_no || ""}
                                            readOnly={true}
                                            className="h-12 rounded-[10px]  bg-white!"
                                        />
                                    </div>

                                    <FloatingInput
                                        label="Status"
                                        value={selectedData?.sample_details?.status}
                                        readOnly={true}
                                        className="h-12 rounded-[10px]  bg-white!"
                                    />

                                    <FloatingTextarea
                                        label="Edit"
                                        value={selectedData?.sample_details?.edit_note}
                                        readOnly={!isEditing}
                                        onChange={(e) => handleFieldChange("edit_note", e.target.value)}
                                        isFloating={true}
                                        className="min-h-[80px] rounded-[10px] "
                                    />

                                    <FloatingTextarea
                                        label="Note"
                                        value={selectedData?.sample_details?.note}
                                        readOnly={!isEditing}
                                        onChange={(e) => handleFieldChange("note", e.target.value)}
                                        isFloating={true}
                                        className="min-h-[80px] rounded-[10px] "
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Submit Button */}
                {isEditing && (
                    <div className="px-6 py-6 md:px-10 flex justify-end bg-white border-t /30">
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
        </CommonModal>
    )
}
