"use client"

import * as React from "react"
import Image from "next/image"
import { Trash2, Share2, Download, Loader2 } from "lucide-react"
import { CommonModal } from "@/components/CommonModal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import CloseIcon from "@/assets/CloseIcon"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingInput } from "../../ui/floating-input"
import { clsx } from "clsx"
import { Formik } from "formik"
import * as Yup from "yup"
import { usePost } from "@/hooks/useApi"
import { API_LIST_AUTH } from "@/hooks/api-list"
import { FormSelect } from "@/components/ui/form-select"
import { UploadPdf } from "@/components/ui/upload-pdf"
import PdfIcon from "@/assets/PdfIcon"
import { downloadImage, toFormData } from "@/lib/helper"

const validationSchema = Yup.object({
    submitted_by: Yup.string().required("Submitted By is required"),
    status: Yup.string().required("Status is required"),
    note: Yup.string().optional(),
})

export function DesignViewModalImage({
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
    const { mutate: assignView, isPending } = usePost(API_LIST_AUTH.VisualDesigners.assignView, {
        onSuccess: (res) => {
            if (res.success) {
                setViewData(res.data)
                if (res.data?.visual_designer_image) {
                    setPreviewImage(process.env.NEXT_PUBLIC_BASE_URL + res.data.visual_designer_image)
                    setCurrentImgIndex(res.data.history.length - 1)
                }
                // visual_designer_pdf
            }
        },
        onError: (error) => {
            console.error("Error updating target:", error)
        }
    })


    React.useEffect(() => {
        if (selectedData?.id) {
            assignView({
                visual_designer_assign_id: selectedData?.id.toString()
            })
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

    const { mutate: updateDesign, isPending: IsDesign } = usePost(API_LIST_AUTH.VisualDesigners.assignUpadte, {
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
            visual_designer_assign_id: selectedData?.id.toString(),
            note: values.note || "",
            status: values.status || ""
        }
        if (previewImage !== '/design-thumb.png') {
            payload.visual_designer_image = selectedFile
        }
        if (values.visual_designer_pdf && values.visual_designer_pdf != "") {
            payload.visual_designer_pdf = values.visual_designer_pdf
        }
        updateDesign(toFormData(payload))
    }

    const { mutate: deleteInspiration, isPending: isDeletingImage } = usePost(API_LIST_AUTH.VisualDesigners.assignDelete, {
        onSuccess: (res, variables) => {
            if (res.success) {
                if (onDelete) onDelete(variables.visual_designer_assign_id)
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
                {/* {!isEditing && (
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
                )} */}

                {/* Extra padding when header is hidden */}
                {/* {isEditing && <div className="pt-10" />} */}
                {/* {isEditing &&
                    <div className="self-end px-4 md:px-10">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                            className="text-primary-foreground hover:opacity-70 transition-opacity"
                        >
                            <CloseIcon width={17} height={17} color="#1a1a1a" />
                        </Button>
                    </div>
                } */}
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
                    <div className="self-end px-4 md:px-10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                            className="text-primary-foreground hover:opacity-70 transition-opacity"
                        >
                            <CloseIcon width={17} height={17} color="#1a1a1a" />
                        </Button>
                    </div>
                }
                <Formik
                    initialValues={{
                        design_no: viewData?.design_no || "",
                        assigned_to: viewData?.assign_user_name || "",
                        submitted_by: viewData?.task_viewer_name || "",
                        status: viewData?.status || "",
                        note: viewData?.note || "",
                        visual_designer_pdf: viewData?.visual_designer_pdf || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(runForm) => (
                        <form onSubmit={runForm.handleSubmit}>
                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-10 gap-y-6 px-4 py-4 md:px-10 pb-6">
                                {/* Image Container */}
                                <div className="order-1">
                                    <div className="relative w-full h-[250px] md:w-[300px] md:h-[300px] rounded-[24px] overflow-hidden border border-[#DCCCBD]/30 group">
                                        {previewImage && <Image
                                            src={previewImage}
                                            alt="Design Preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 300px"
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
                                    </div>
                                </div>

                                {/* Details Column */}
                                <div className="order-3 lg:order-2 flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            name="design_no"
                                            label="Design No"
                                            runForm={runForm}
                                            readOnly={true}
                                        />
                                        {/* <FloatingInput
                                            label="Design No"
                                            value={assignedTo}
                                            readOnly={!isEditing}
                                        /> */}
                                        <FloatingInput
                                            name="assigned_to"
                                            label="Assigned To"
                                            runForm={runForm}
                                            readOnly={true}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            name="submitted_by"
                                            label="Submitted By"
                                            runForm={runForm}
                                            readOnly={true}
                                        />
                                        <FormSelect
                                            triggerClassName="h-[45px]!"
                                            name="status"
                                            label="Current Status"
                                            runForm={runForm}
                                            readOnly={!isEditing}
                                            floatingUi={true}
                                            options={[
                                                { label: "Pending", value: "pending" },
                                                { label: "In Progress", value: "running" },
                                                { label: "Completed", value: "completed" },
                                            ]}
                                        />
                                    </div>
                                    <FloatingTextarea
                                        name="note"
                                        label="Note"
                                        runForm={runForm}
                                        readOnly={!isEditing}
                                        className="min-h-[140px]"
                                    />
                                    <UploadPdf
                                        name="visual_designer_pdf"
                                        label="Upload Pdf"
                                        runForm={runForm}
                                        readOnly={!isEditing}
                                    />


                                    {isEditing && (
                                        <Button
                                            type="submit"
                                            className=" px-9 py-5 bg-[#DCCCBD] hover:bg-[#DCCCBD]/90 text-primary-foreground font-semibold  rounded-[8px] text-[16px] self-start"
                                        >
                                            {IsDesign ? <Loader2 className="size-6 animate-spin" /> : "Submit"}
                                        </Button>
                                    )}
                                    {!isEditing && viewData?.visual_designer_pdf && viewData?.visual_designer_pdf != "" && (
                                        <Button
                                            type="button"
                                            className="cursor-pointer px-9 py-5 bg-[#DCCCBD] hover:bg-[#DCCCBD]/90 text-primary-foreground font-semibold  rounded-[8px] text-[16px] self-end"
                                            onClick={() => downloadImage(process.env.NEXT_PUBLIC_BASE_URL + viewData?.visual_designer_pdf)}
                                        >
                                            <PdfIcon className="size-6" /> Download Pdf
                                        </Button>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {/* <div className="order-2 lg:order-3 lg:col-span-full">
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
                                </div> */}
                                <div className="order-2 lg:order-3 lg:col-span-full">
                                    <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 custom-scrollbar">
                                        {(viewData?.history)?.map((thumb, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "relative w-20 h-20 group cursor-pointer border-5 rounded-md overflow-hidden flex-shrink-0",
                                                    (currentImgIndex === idx ? "border-[#A67F6F]" : "border-transparent")
                                                )}
                                                onClick={() => { setCurrentImgIndex(idx); setPreviewImage(process.env.NEXT_PUBLIC_BASE_URL + thumb.visual_designer_image) }}
                                            >
                                                <div className={cn(
                                                    "w-full h-full rounded-[12px] overflow-hidden border-2 transition-all border-[#A67F6F]",
                                                )}>
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${thumb.visual_designer_image}` || 'design-thumb.png'}
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
                        </form>
                    )}
                </Formik>

            </div>
            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                onConfirm={() => {
                    const payload = {
                        visual_designer_assign_id: selectedData?.id.toString(),
                    }
                    deleteInspiration(payload)
                }}
            />
        </CommonModal>
    )
}

