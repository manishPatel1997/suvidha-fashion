"use client"

import * as React from "react"
import { Formik, FieldArray } from "formik"
import * as Yup from "yup"
import { CommonModal } from "./CommonModal"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { FileInput } from "./ui/file-input"
import { FormSelect } from "./ui/form-select"
import { FloatingTextarea } from "./ui/floating-textarea"
import { PlusIcon } from "lucide-react"
import AttachIcon from "@/assets/AttachIcon"
import CloseIcon from "@/assets/CloseIcon"
import { ImgAcceptType } from "@/lib/validation"
import { cn } from "@/lib/utils"

const validationSchema = Yup.object().shape({
    image: Yup.mixed().required("Image is required"),
    sample_id: Yup.string().required("Sample Id is required"),
    status: Yup.string().required("Status is required"),
    edits: Yup.array().of(Yup.string().required("Edit detail is required")),
    note: Yup.string().optional(),
})

export function AddProductionModal({
    open,
    onOpenChange,
    onAdd,
    isLoading = false,
    title = "Sample"
}) {
    const formikRef = React.useRef(null)

    const handleOpenChange = (isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen && formikRef.current) {
            formikRef.current.resetForm()
        }
    }

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "running", label: "Running" },
        { value: "completed", label: "Completed" },
    ]

    return (
        <CommonModal
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
            className="sm:max-w-[800px]"
            IsClose={true}
        >
            <Formik
                innerRef={formikRef}
                initialValues={{
                    image: "",
                    sample_id: "",
                    status: "",
                    edits: [""],
                    note: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    if (onAdd) onAdd(values)
                }}
            >
                {(runForm) => (
                    <form onSubmit={runForm.handleSubmit} className="flex flex-col flex-1">
                        <div className="flex flex-col overflow-y-auto max-h-[75vh]">
                            <div className="px-6 py-5 md:px-[60px] md:py-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
                                    {/* Attach Image */}
                                    <div className="space-y-1.5">
                                        <label className="text-[16px] font-medium text-primary-foreground block">
                                            Attach Image <span className="text-[#ff6b6b]">*</span>
                                        </label>
                                        <FileInput
                                            name="image"
                                            accept={ImgAcceptType}
                                            runForm={runForm}
                                            icon={<AttachIcon width={16} height={16} color="#858585" />}
                                        />
                                    </div>

                                    {/* Sample Id */}
                                    <div className="space-y-1.5">
                                        <label className="text-[16px] font-medium text-primary-foreground block">
                                            Sample Id <span className="text-[#ff6b6b]">*</span>
                                        </label>
                                        <Input
                                            name="sample_id"
                                            placeholder="Fabric Id"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="space-y-1.5">
                                    <label className="text-[16px] font-medium text-primary-foreground block">
                                        Status <span className="text-[#ff6b6b]">*</span>
                                    </label>
                                    <FormSelect
                                        name="status"
                                        runForm={runForm}
                                        options={statusOptions}
                                        placeholder="Select status"
                                        triggerClassName="h-[45px]!"
                                    />
                                </div>

                                {/* Edits Dynamic Fields */}
                                <FieldArray name="edits">
                                    {({ push, remove }) => (
                                        <div className="space-y-4">
                                            {runForm.values.edits.map((_, index) => (
                                                <div key={index} className="space-y-1.5">
                                                    <label className="text-[16px] font-medium text-primary-foreground block">
                                                        Edit-{index + 1}
                                                    </label>
                                                    <FloatingTextarea
                                                        name={`edits.${index}`}
                                                        placeholder={`Edit-{index + 1}`}
                                                        runForm={runForm}
                                                        isFloating={false}
                                                        className="min-h-[100px]"
                                                    />
                                                </div>
                                            ))}
                                            <div className="flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => push("")}
                                                    className="text-primary-foreground text-sm font-semibold flex items-center gap-1 hover:bg-transparent"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                    Add Edit
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </FieldArray>

                                {/* Note */}
                                <div className="space-y-1.5">
                                    <label className="text-[16px] font-medium text-primary-foreground block">
                                        Note
                                    </label>
                                    <FloatingTextarea
                                        name="note"
                                        placeholder="Note"
                                        runForm={runForm}
                                        isFloating={false}
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-11 px-12 rounded-[5px] font-semibold text-[16px]"
                                    >
                                        {isLoading ? "Adding..." : "Add"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </CommonModal>
    )
}
