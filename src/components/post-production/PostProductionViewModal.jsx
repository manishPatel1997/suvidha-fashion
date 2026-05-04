"use client"

import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
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
    const [isEditing, setIsEditing] = React.useState(false)
    const [vendorOptions, setVendorOptions] = React.useState([])
    const [userOptions, setUserOptions] = React.useState([])
    const [previewImage, setPreviewImage] = React.useState(null)
    const [uploadPreview, setUploadPreview] = React.useState(null)
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
                setSelectedFile(null)
                setUploadPreview(null)
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
    const { mutate: GetUser, isPending: GetUserPending } = usePost(
        API_LIST_AUTH.users_get,
        {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    const formattedUsers = res.data.map((user) => ({
                        value: user.id.toString(),
                        label: user.name,
                        email: user.email
                    }))

                    setUserOptions(formattedUsers)
                }
            }
        }
    )

    const runForm = useFormik({
        initialValues: {
            status: "In Process",
            assign_user_id: "",
            vendor_id: "",
        },
        validationSchema: Yup.object({
            assign_user_id: Yup.string().required("Assign is required"),
            vendor_id: titleName === "Mill"
                ? Yup.string().required("Vendor is required")
                : Yup.string()
        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            const idKey = `${titleName.toLowerCase()}_assign_id`
            const payload = {
                image_url: selectedFile,
                [idKey]: String(selectedData.id),
                status: values.status?.toLowerCase().replace(" ", "_"),
                assign_id: String(values.assign_user_id || ""),
            }

            if (titleName === "Mill") {
                payload.vendor = String(values.vendor_id || "")
            }

            updatePostProduction(toFormData(payload))
        }
    })

    const lastInitializedId = React.useRef(null)

    React.useEffect(() => {
        if (!open) {
            setIsEditing(false)
            setSelectedFile(null)
            setUploadPreview(null)
            runForm.resetForm()
            lastInitializedId.current = null
            return
        }
        if (open && selectedData && lastInitializedId.current !== selectedData.id) {
            lastInitializedId.current = selectedData.id

            if (titleName === "Mill") {
                getVendors({ type: "mill" })
            }
            GetUser({ role: "" })

            runForm.setValues({
                status: selectedData.status ? (selectedData.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')) : "In Process",
                assign_user_id: String(selectedData?.assign_id || ""),
                vendor_id: String(selectedData?.vendor || selectedData?.vendeor || selectedData?.vender || selectedData?.vendor_id || ""),
            })
            const firstImg = selectedData?.images?.[0];
            const firstImgSrc = typeof firstImg === 'string' ? firstImg : (firstImg?.image_url || firstImg?.image || firstImg?.url);

            setPreviewImage(firstImgSrc
                ? `${process.env.NEXT_PUBLIC_BASE_URL}${firstImgSrc}`
                : (selectedData?.image_url ? `${process.env.NEXT_PUBLIC_BASE_URL}${selectedData?.image_url}` : "/design-thumb.png"))

            // Fetch sample details if we have a sample_id
            if (selectedData.sample_id) {
                getSampleDetails({ production_items_id: String(selectedData.id) })
            }
        }
    }, [open, selectedData, getSampleDetails, getVendors, titleName, GetUser])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result)
                setUploadPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
        e.target.value = ""
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

                            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-8 gap-y-8 items-start">
                                {/* Image Preview */}
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className={cn(
                                        "relative w-full aspect-19/10 rounded-[12px] overflow-hidden bg-[#E6D9CB] group border border-[#dcccbd]/40",
                                        titleName === "Mill" ? "lg:w-[360px] lg:h-[428px]" : "lg:w-[380px] lg:h-[200px]"
                                    )}>
                                        {previewImage && (
                                            <Image
                                                src={previewImage}
                                                alt="Post Production Preview"
                                                fill
                                                className={cn("object-cover", isEditing && "opacity-80")}
                                            />
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
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

                                    {titleName === "Mill" && (
                                        <div className="flex lg:flex-col gap-3 h-auto lg:h-[428px] w-full lg:w-auto">
                                            <div className="flex-1 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:pr-2 custom-scrollbar flex flex-row lg:flex-col gap-3">
                                                {selectedData?.images?.map((img, idx) => {
                                                    const imgSrc = typeof img === 'string' ? img : (img?.image_url || img?.image || img?.url);
                                                    if (!imgSrc) return null;
                                                    const fullImgSrc = `${process.env.NEXT_PUBLIC_BASE_URL}${imgSrc}`;
                                                    return (
                                                        <div 
                                                            key={idx} 
                                                            className="relative shrink-0 w-[76px] h-[76px] rounded-[8px] bg-[#E6D9CB] border border-[#B0826A]/40 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={() => setPreviewImage(fullImgSrc)}
                                                        >
                                                            <Image src={fullImgSrc} alt={`Mill Image ${idx}`} fill className="object-cover" />
                                                        </div>
                                                    );
                                                })}
                                                {selectedFile && uploadPreview && (
                                                    <div 
                                                        className="relative shrink-0 w-[76px] h-[76px] rounded-[8px] bg-[#E6D9CB] border border-[#B0826A]/40 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                                        onClick={() => setPreviewImage(uploadPreview)}
                                                    >
                                                        <Image src={uploadPreview} alt="Uploaded image" fill className="object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className="shrink-0 w-[76px] h-[76px] rounded-[8px] bg-white border border-[#dcccbd] flex items-center justify-center text-[#B0826A] hover:bg-gray-50 transition-colors"
                                                onClick={() => isEditing && fileInputRef.current?.click()}
                                                disabled={!isEditing}
                                                style={{ cursor: isEditing ? 'pointer' : 'default' }}
                                            >
                                                <span className="text-3xl font-light leading-none mb-1">+</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Basic Fields */}
                                <div className="space-y-6 flex-1">
                                    <FormSelect
                                        name="status"
                                        runForm={runForm}
                                        label="Status"
                                        floatingUi={true}
                                        hasEdit
                                        options={statusOptions}
                                        readOnly={!isEditing}
                                        triggerClassName={cn(
                                            "h-12! rounded-[10px]!",
                                            !isEditing && "bg-white!"
                                        )}
                                    />

                                    <FormSelect
                                        name="assign_user_id"
                                        runForm={runForm}
                                        label="Assign"
                                        floatingUi={true}
                                        hasEdit
                                        options={userOptions}
                                        readOnly={!isEditing}
                                        triggerClassName={cn(
                                            "h-12! rounded-[10px]!",
                                            !isEditing && "bg-white!"
                                        )}
                                    />
                                    {titleName === "Mill" && (
                                        <FormSelect
                                            name="vendor_id"
                                            runForm={runForm}
                                            label="Vendor"
                                            floatingUi={true}
                                            hasEdit
                                            options={vendorOptions}
                                            readOnly={!isEditing}
                                            triggerClassName={cn(
                                                "h-12! rounded-[10px]!",
                                                !isEditing && "bg-white!"
                                            )}
                                        />
                                    )}
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
                                            value={selectedData?.sample_details?.sample_id || ""}
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
                                        value={selectedData?.sample_details?.status || ""}
                                        readOnly={true}
                                        className="h-12 rounded-[10px]  bg-white!"
                                    />

                                    <FloatingTextarea
                                        label="Edit"
                                        value={selectedData?.sample_details?.edit_note || ""}
                                        readOnly={true}
                                        onChange={(e) => handleFieldChange("edit_note", e.target.value)}
                                        isFloating={true}
                                        className="min-h-[80px] rounded-[10px] "
                                    />

                                    <FloatingTextarea
                                        label="Note"
                                        value={selectedData?.sample_details?.note || ""}
                                        readOnly={true}
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
                            onClick={runForm.handleSubmit}
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
