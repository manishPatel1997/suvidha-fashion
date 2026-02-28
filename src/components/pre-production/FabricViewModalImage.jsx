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
import { FloatingInput } from "@/components/ui/floating-input"
import { Formik } from "formik"
import * as Yup from "yup"
import { API_LIST_AUTH } from "@/hooks/api-list"
import { usePost } from "@/hooks/useApi"
import { downloadImage, toFormData } from "@/lib/helper"
import clsx from "clsx"
import { FormColorPicker } from "../ui/form-color-picker"

export function FabricViewModalImage({
    isDone = false,
    selectedData,
    open,
    onOpenChange,
    onDelete,
    onUpdateSuccess,
    title = "fabric"
}) {
    // 🔥 Dynamic prefix
    const prefix = title?.toLowerCase() === "yarn" ? "yarn" : title?.toLowerCase() === "fabric" ? "fabric" : title?.toLowerCase() === "sequences" ? "sequence" : "fabric"
    const field = (name) => {
        if (prefix === "yarn") {
            if (name === "quality") return "yarn_num_cons"
            if (name === "meter") return "yarn_num_cons"
        }
        if (prefix === "sequence") {
            if (name === "quality") return "sequence_cd"
            if (name === "meter") return "sequence_cd"
        }
        return `${prefix}_${name}`
    }

    const [isEditing, setIsEditing] = React.useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [previewImage, setPreviewImage] = React.useState('/design-thumb.png')
    const [viewData, setViewData] = React.useState(null)
    const [selectedFile, setSelectedFile] = React.useState(null)
    const { mutate: fabricassignView } = usePost(API_LIST_AUTH.Fabric.assignView, {
        onSuccess: (res) => {
            if (res.success) {
                setViewData(res.data)
                if (res.data?.fabric_image) {
                    setPreviewImage(process.env.NEXT_PUBLIC_BASE_URL + res.data.fabric_image)
                    //     setCurrentImgIndex(res.data.history.length - 1)
                }
            }
        },
        onError: (error) => {
            console.error("Error updating target:", error)
        }
    })
    const { mutate: yarnassignView } = usePost(API_LIST_AUTH.Yarn.assignView, {
        onSuccess: (res) => {
            if (res.success) {
                setViewData(res.data)
                if (res.data?.yarn_image) {
                    setPreviewImage(process.env.NEXT_PUBLIC_BASE_URL + res.data.yarn_image)
                    //     setCurrentImgIndex(res.data.history.length - 1)
                }
            }
        },
        onError: (error) => {
            console.error("Error updating target:", error)
        }
    })
    const { mutate: sequencesassignView } = usePost(API_LIST_AUTH.Sequences.assignView, {
        onSuccess: (res) => {
            if (res.success) {
                setViewData(res.data)
                if (res.data?.sequence_image) {
                    setPreviewImage(process.env.NEXT_PUBLIC_BASE_URL + res.data.sequence_image)
                    //     setCurrentImgIndex(res.data.history.length - 1)
                }
            }
        },
        onError: (error) => {
            console.error("Error updating target:", error)
        }
    })
    React.useEffect(() => {
        if (selectedData?.id) {
            if (prefix === "fabric") {
                fabricassignView({
                    fabric_assign_id: selectedData?.id.toString()
                })
            } else if (prefix === "yarn") {
                yarnassignView({
                    yarn_assign_id: selectedData?.id.toString()
                })
            } else if (prefix === "sequence") {
                sequencesassignView({
                    sequence_assign_id: selectedData?.id.toString()
                })
            }
        }
    }, [selectedData])


    // React.useEffect(() => {
    //     if (selectedData) {
    //         const imageKey = field("image")
    //         setPreviewImage(
    //             selectedData?.[imageKey]
    //                 ? process.env.NEXT_PUBLIC_BASE_URL + selectedData[imageKey]
    //                 : "/design-thumb.png"
    //         )
    //         setViewData(selectedData)
    //     }
    // }, [selectedData])

    const fileInputRef = React.useRef(null)

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setPreviewImage(reader.result)
            reader.readAsDataURL(file)
        }
    }

    // const { mutate: updateItem, isPending } = usePost(
    //     prefix === "fabric"
    //         ? API_LIST_AUTH.Fabric.assignUpdate
    //         : API_LIST_AUTH.Yarn.assignUpdate,
    //     {
    //         isFormData: true,
    //         onSuccess: (res) => {
    //             if (res.success) {
    //                 if (onUpdateSuccess) onUpdateSuccess(res.data)
    //                 setIsEditing(false)
    //             }
    //         },
    //     }
    // )
    const { mutate: updateItem, isPending } = usePost(
        prefix === "fabric"
            ? API_LIST_AUTH.Fabric.assignUpdate
            : prefix === "sequence"
                ? API_LIST_AUTH.Sequences.assignUpdate
                : API_LIST_AUTH.Yarn.assignUpdate,
        {
            isFormData: !["fabric", "yarn", "sequence"].includes(prefix),
            onSuccess: (res) => {
                if (res.success) {
                    if (onUpdateSuccess) onUpdateSuccess(res.data)
                    setIsEditing(false)
                }
            },
        }
    )
    const { mutate: deleteItem } = usePost(
        prefix === "fabric"
            ? API_LIST_AUTH.Fabric.assignDelete
            : prefix === "sequence"
                ? API_LIST_AUTH.Sequences.assignDelete
                : API_LIST_AUTH.Yarn.assignDelete,
        {
            onSuccess: (res, variables) => {
                if (res.success) {
                    if (onDelete) onDelete(variables.id)
                    onOpenChange(false)
                }
            },
        }
    )

    const validationSchema = Yup.object(
        prefix === "fabric"
            ? {
                [field("name")]: Yup.string().required("Fabric name is required"),
                [field("meter")]: Yup.number().required("Meter is required"),
            }
            : prefix === "sequence"
                ? {
                    [field("name")]: Yup.string().required("Sequences name is required"),
                    sequence_cd: Yup.number().required("Sequence CD is required"),
                }
                : {
                    [field("name")]: Yup.string().required("Yarn name is required"),
                    yarn_num_cons: Yup.number().required("Yarn Num Cons is required"),
                }
    );
    const handleSubmit = (values) => {
        const payload = {
            id: selectedData?.id?.toString(),
            [field("name")]: values[field("name")] || "",
            [field("meter")]: values[field("meter")] || "",
            note: values.note || "",
        }

        if (selectedFile) {
            payload[field("image")] = selectedFile
        }
        if (prefix === "fabric") {
            payload.fabric_stock_id = selectedData?.fabric_stock_id?.toString()
        }
        if (prefix === 'yarn') {
            payload.yarn_stock_id = selectedData?.yarn_stock_id?.toString()
            payload.yarn_num_cons = payload.yarn_num_cons.toString()
        }
        if (prefix === "sequence") {
            payload.sequence_cd = values.sequence_cd ? values.sequence_cd.toString() : ""
            payload.sequence_stock_id = selectedData?.sequence_stock_id?.toString()
        }

        if (["fabric", "yarn", "sequence"].includes(prefix)) {
            updateItem(payload)
        } else {
            updateItem(toFormData(payload))
        }
    }
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
                        [field("id")]: viewData?.[field("id")] ?? "",
                        [field("name")]: viewData?.[field("name")] ?? "",
                        [field("quality")]: viewData?.[field("quality")] ?? "",
                        [field("price")]: viewData?.[field("price")] ?? "",
                        [field("vender")]: viewData?.[field("vender")] ?? "",
                        [field("meter")]: viewData?.[field("meter")] ?? "",
                        [field("color")]: viewData?.[field("color")] ?? "#D1D3C8",
                        sequence_cd: viewData?.sequence_cd ?? "",
                        note: viewData?.note ?? "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(runForm) => (
                        <form onSubmit={runForm.handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-10 gap-y-6 px-4 py-4 md:px-10 pb-6">

                                {/* Image */}
                                <div>
                                    <div className="relative w-full h-[250px] md:w-[420px] md:h-[420px] rounded-[12px] overflow-hidden border group">
                                        {previewImage && (
                                            <Image
                                                src={previewImage}
                                                alt="Preview"
                                                fill
                                                className={cn("object-cover", isEditing && "opacity-80")}
                                            />
                                        )}

                                        {isEditing && !["fabric", "yarn", "sequence"].includes(prefix) && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                                <Button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="bg-white"
                                                >
                                                    Upload New Image
                                                </Button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    hidden
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col gap-6">

                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            name={field("id")}
                                            label={`${title} Id`}
                                            runForm={runForm}
                                            readOnly
                                        />
                                        <FloatingInput
                                            name={field("name")}
                                            label={title}
                                            runForm={runForm}
                                            readOnly={["fabric", "yarn", "sequence"].includes(prefix) ? true : !isEditing}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {prefix === "sequence" && (
                                            <FloatingInput
                                                type="number"
                                                name="sequence_cd"
                                                label="Sequence CD"
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                hasEdit={isEditing}
                                            />
                                        )}
                                        {prefix === "fabric" && <FloatingInput
                                            name={field("quality")}
                                            label={`${title} Quality`}
                                            runForm={runForm}
                                            readOnly
                                        />}
                                        {prefix === "yarn" && (
                                            <FloatingInput
                                                type="number"
                                                name="yarn_num_cons"
                                                label="Yarn Num Cons"
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                hasEdit
                                            />
                                        )}
                                        <FloatingInput
                                            name={field("price")}
                                            label={`${title} Price`}
                                            runForm={runForm}
                                            readOnly
                                            value={
                                                runForm.values[field("price")]
                                                    ? `₹ ${runForm.values[field("price")]} Meter`
                                                    : ""
                                            }
                                        />
                                    </div>



                                    {prefix === "fabric" ? <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            name={field("vender")}
                                            label={`${title} Vendor`}
                                            runForm={runForm}
                                            readOnly
                                        />
                                        <FloatingInput
                                            hasEdit={isEditing}
                                            name={field("meter")}
                                            label={`${title} Meter`}
                                            runForm={runForm}
                                            readOnly={!isEditing}
                                            value={
                                                runForm.values[field("meter")]
                                                    ? `${runForm.values[field("meter")]} Meter`
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9.]/g, '')
                                                runForm.setFieldValue(field("meter"), val)
                                            }}
                                        />
                                    </div> :
                                        <FloatingInput
                                            name={field("vender")}
                                            label={`${title} Vendor`}
                                            runForm={runForm}
                                            readOnly
                                        />
                                    }

                                    {/* <div className="relative">
                                        <div className="flex items-center gap-2 border rounded-md px-3 h-[45px] bg-[#FDFDFD]">
                                            <div
                                                className="w-5 h-5 rounded-sm border"
                                                style={{ backgroundColor: runForm.values[field("color")] }}
                                            />
                                            <span className="text-[14px] font-medium uppercase">
                                                {runForm.values[field("color")]}
                                            </span>
                                        </div>
                                        <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] font-medium">
                                            {title} Color
                                        </label>
                                    </div> */}
                                    <FormColorPicker
                                        name={field("color")}
                                        label={`${title} Color`}
                                        runForm={runForm}
                                        readOnly={["fabric", "yarn", "sequence"].includes(prefix) ? true : !isEditing}
                                        placeholder="Pick a color"
                                    />

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
                                                className="bg-[#DCCCBD]"
                                            >
                                                {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>

                <DeleteConfirmationModal
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    onConfirm={() =>
                        deleteItem({ id: selectedData?.id?.toString() })
                    }
                />
            </div>
        </CommonModal>
    )
}