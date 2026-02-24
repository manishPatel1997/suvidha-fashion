"use client"

import * as React from "react"
import Image from "next/image"
import { Trash2, Share2, Download, Plus, Loader2 } from "lucide-react"
import { CommonModal } from "@/components/CommonModal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import CloseIcon from "@/assets/CloseIcon"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingInput } from "@/components/ui/floating-input"
import { Formik } from "formik"
import * as Yup from "yup"
import { API_LIST_AUTH } from "@/hooks/api-list"
import { usePost } from "@/hooks/useApi"
import { FormSelect } from "@/components/ui/form-select"
import { downloadImage, toFormData } from "@/lib/helper"
import clsx from "clsx"

const validationSchema = Yup.object({
    assigned_to: Yup.string().required("Assigned To is required"),
    submitted_by: Yup.string().required("Submitted By is required"),
    status: Yup.string().required("Status is required"),
    note: Yup.string().optional(),
})

export function FabricViewModalImage({
    isDone = false,
    selectedData,
    open,
    onOpenChange,
    onDelete,
    onUpdateSuccess
}) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [previewImage, setPreviewImage] = React.useState('/design-thumb.png')
    const [currentImgIndex, setCurrentImgIndex] = React.useState(-1)
    const [viewData, setViewData] = React.useState(null)
    const [selectedFile, setSelectedFile] = React.useState(null)

    const { mutate: assignView, isPending } = usePost(API_LIST_AUTH.Sketches.assignView, {
        onSuccess: (res) => {
            if (res.success) {
                setViewData(res.data)
                if (res.data?.sketche_image) {
                    setPreviewImage(process.env.NEXT_PUBLIC_BASE_URL + res.data.sketche_image)
                    setCurrentImgIndex(res.data.history.length - 1)
                }
            }
        },
        onError: (error) => {
            console.error("Error updating target:", error)
        }
    })

    // React.useEffect(() => {
    //     if (selectedData?.sketche_id) {
    //         assignView({
    //             sketche_assign_id: selectedData?.id.toString()
    //         })
    //     }
    // }, [selectedData])


    React.useEffect(() => {
        console.log('selectedData', selectedData)
        if (selectedData) {
            setPreviewImage(selectedData?.fabric_image ? process.env.NEXT_PUBLIC_BASE_URL + selectedData.fabric_image : '/design-thumb.png')
            setViewData(selectedData)
        }
    }, [selectedData])

    const fileInputRef = React.useRef(null)

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

    const { mutate: updateSketches, isPending: IsSketches } = usePost(API_LIST_AUTH.Sketches.assignUpdate, {
        isFormData: true,
        onSuccess: (res) => {
            if (res.success) {
                if (onUpdateSuccess) onUpdateSuccess(res.data)
                setIsEditing(false)
            }
        },
        onError: (error) => {
            console.error("Error updating inspiration:", error)
        }
    })

    const handleSubmit = (values) => {
        const payload = {
            sketche_assign_id: selectedData?.id.toString(),
            note: values.note || "",
            status: values.status || "",
            fabric_name: values.fabric_name || "",
            fabric_meter: values.fabric_meter || ""
        }
        if (previewImage !== '/design-thumb.png') {
            payload.sketche_image = selectedFile
        }
        updateSketches(toFormData(payload))
    }

    const { mutate: deleteInspiration, isPending: isDeletingImage } = usePost(API_LIST_AUTH.Sketches.assignDelete, {
        onSuccess: (res, variables) => {
            if (res.success) {
                if (onDelete) onDelete(variables.sketche_assign_id)
                onOpenChange(false)
            }
        },
        onError: (error) => {
            console.error("Error deleting inspiration:", error)
        }
    })

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
                        {!isDone && <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsEditing(true)}
                            className="h-9 px-6 bg-[#F3F0EC] hover:bg-[#E8E2DA] text-primary-foreground rounded-md text-[14px] font-semibold"
                        >
                            Edit
                        </Button>}
                        <div className={clsx(
                            "flex items-center gap-2",
                            isDone && "ml-auto"
                        )}>
                            {!isDone && <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="h-9 px-4 bg-[#FDF2F2] hover:bg-[#FBE4E4] text-[#E5484D] rounded-md text-[14px] font-semibold flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>}
                            <Button
                                type="button"
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
                {isEditing &&
                    <div className="self-end px-4 md:px-10 mt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-primary-foreground hover:opacity-70 transition-opacity"
                        >
                            <CloseIcon width={17} height={17} color="#1a1a1a" />
                        </Button>
                    </div>
                }

                <Formik
                    initialValues={{
                        fabric_id: viewData?.fabric_id || "",
                        fabric_name: viewData?.fabric_name || "",
                        fabric_quality: viewData?.fabric_quality || "",
                        fabric_price: viewData?.fabric_price || "",
                        fabric_vender: viewData?.fabric_vender || "",
                        fabric_meter: viewData?.fabric_meter || "",
                        fabric_color: viewData?.fabric_color || "#D1D3C8",
                        note: viewData?.note || "",
                    }}
                    validationSchema={Yup.object({
                        fabric_name: Yup.string().required("Fabric name is required"),
                        fabric_meter: Yup.number().required("Meter is required"),
                        note: Yup.string().optional(),
                    })}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(runForm) => (
                        <form onSubmit={runForm.handleSubmit}>
                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-10 gap-y-6 px-4 py-4 md:px-10 pb-6">
                                {/* Image Container */}
                                <div className="order-1">
                                    <div className="relative w-full h-[250px] md:w-[420px] md:h-[420px] rounded-[12px] overflow-hidden border border-[#DCCCBD]/30 group">
                                        {previewImage && <Image
                                            src={previewImage}
                                            alt="Design Preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 420px"
                                            className={cn("object-cover", isEditing && "opacity-80")}
                                        />}

                                        {!isEditing && previewImage !== "/design-thumb.png" && (
                                            <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button type="button" className="w-9 h-9 flex items-center justify-center bg-[#A67F6F] hover:bg-[#8B6A5C] text-white rounded-full transition-colors shadow-lg">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                                <button type="button" className="w-9 h-9 flex items-center justify-center bg-[#A67F6F] hover:bg-[#8B6A5C] text-white rounded-full transition-colors shadow-lg" onClick={() => downloadImage(previewImage)}>
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                                <Button
                                                    type="button"
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
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="bg-white/90 text-primary-foreground px-4 py-2 rounded-md font-medium">Upload New Image</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Column */}
                                <div className="order-2 flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            name="fabric_id"
                                            label="Fabric Id"
                                            runForm={runForm}
                                            readOnly={true}
                                        />
                                        <FloatingInput
                                            name="fabric_name"
                                            label="Fabric"
                                            runForm={runForm}
                                            readOnly={!isEditing}
                                            hasEdit={isEditing}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            name="fabric_quality"
                                            label="Fabric Quality"
                                            runForm={runForm}
                                            readOnly={true}
                                        />
                                        <FloatingInput
                                            name="fabric_price"
                                            label="Fabric Price"
                                            runForm={runForm}
                                            readOnly={true}
                                            value={runForm.values.fabric_price ? `₹ ${runForm.values.fabric_price} Meter` : ""}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            name="fabric_vender"
                                            label="Fabric Vendor"
                                            runForm={runForm}
                                            readOnly={true}
                                        />
                                        <FloatingInput
                                            name="fabric_meter"
                                            label="Fabric Meter"
                                            runForm={runForm}
                                            readOnly={!isEditing}
                                            hasEdit={isEditing}
                                            value={runForm.values.fabric_meter ? `${runForm.values.fabric_meter} Meter` : ""}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9.]/g, '')
                                                runForm.setFieldValue('fabric_meter', val)
                                            }}
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center gap-2 border border-[#DCCCBD]/60 rounded-md px-3 h-[45px] bg-[#FDFDFD]">
                                            <div
                                                className="w-5 h-5 rounded-sm border border-gray-200"
                                                style={{ backgroundColor: runForm.values.fabric_color }}
                                            />
                                            <span className="text-[14px] font-medium text-primary-foreground uppercase">
                                                {runForm.values.fabric_color}
                                            </span>
                                        </div>
                                        <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] font-medium text-[#A67F6F] z-10">
                                            Fabric Color
                                        </label>
                                    </div>

                                    <FloatingTextarea
                                        name="note"
                                        label="Note"
                                        runForm={runForm}
                                        readOnly={!isEditing}
                                        className="min-h-[100px]"
                                    />

                                    {isEditing && (
                                        <div className="flex gap-4">
                                            <Button
                                                type="submit"
                                                className="bg-[#DCCCBD] hover:bg-[#DCCCBD]/90 text-primary-foreground font-semibold h-11 px-8 rounded-md text-[16px]"
                                            >
                                                {IsSketches ? <Loader2 className="size-6 animate-spin" /> : "Submit"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setIsEditing(false)}
                                                className="h-11 px-6 bg-[#F3F0EC] hover:bg-[#E8E2DA] text-primary-foreground rounded-md text-[14px] font-semibold"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>

                {/* Thumbnail Gallery */}
                <div className="px-10 pb-10">
                    <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 custom-scrollbar">
                        {(viewData?.history)?.map((thumb, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "relative w-20 h-20 group cursor-pointer border-2 rounded-md overflow-hidden flex-shrink-0",
                                    (currentImgIndex === idx ? "border-[#A67F6F]" : "border-transparent")
                                )}
                                onClick={() => {
                                    setCurrentImgIndex(idx)
                                    setPreviewImage(process.env.NEXT_PUBLIC_BASE_URL + thumb.sketeche_image)
                                }}
                            >
                                <div className="w-full h-full rounded-[12px] overflow-hidden">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${thumb.sketeche_image}` || '/design-thumb.png'}
                                        alt={`Version ${idx + 1}`}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                </div>
                                <span className="absolute bottom-1 right-1 text-[10px] font-bold bg-white px-1 rounded">
                                    V{idx + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                onConfirm={() => {
                    const payload = {
                        sketche_assign_id: selectedData?.id.toString(),
                    }
                    deleteInspiration(payload)
                }}
            />
        </CommonModal>
    )
}

