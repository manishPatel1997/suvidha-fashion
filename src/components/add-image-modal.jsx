"use client"

import * as React from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import { CommonModal } from "./CommonModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FloatingTextarea } from "./ui/floating-textarea"
import { FileInput } from "@/components/ui/file-input"
import AttachIcon from "@/assets/AttachIcon"
import { FormSelect } from "./ui/form-select"

const ASSIGNED_OPTIONS = [
    { value: "1", label: "Devon Lane" },
    { value: "2", label: "Jenny Wilson" },
    { value: "3", label: "Robert Fox" },
    { value: "4", label: "Cody Fisher" },
    { value: "5", label: "Bessie Cooper" },
]

export function AddImageModal({ open, onOpenChange, onAdd, title = "Sketches" }) {
    const formikRef = React.useRef(null)
    const isInspirations = title === "Inspirations"
    const isSketches = title === "Sketches"
    const isDesign = title === "Design"

    const validationSchema = React.useMemo(() => {
        if (isInspirations) {
            return Yup.object().shape({
                attachImage: Yup.mixed().required("Image is required"),
                note: Yup.string().optional(),
            })
        }
        if (isDesign) {
            return Yup.object().shape({
                designNo: Yup.string().required("Design number is required"),
                assignedTo: Yup.string().required("Please select who to assign to"),
                note: Yup.string().optional(),
            })
        }
        return Yup.object().shape({
            assignedTo: Yup.string().required("Please select who to assign to"),
            note: Yup.string().optional(),
        })
    }, [title, isInspirations, isDesign])

    const handleOpenChange = (isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen && formikRef.current) {
            formikRef.current.resetForm()
        }
    }

    return (
        <CommonModal
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
            className="sm:max-w-[550px]"
            containerClassName="px-4 py-10 sm:px-6 sm:py-10"
        >
            <Formik
                innerRef={formikRef}
                initialValues={{
                    attachImage: "",
                    designNo: "",
                    assignedTo: "",
                    note: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const finalValues = { ...values }
                    if (isSketches && !finalValues.attachImage) {
                        finalValues.attachImage = "/design-thumb.png"
                    }
                    if (onAdd) onAdd(finalValues)
                    handleOpenChange(false)
                }}
            >
                {(runForm) => (
                    <form onSubmit={runForm.handleSubmit} className="flex flex-col flex-1">
                        <div className="px-6 py-5 md:px-10 md:py-8 space-y-6">
                            {/* Attach Image - Only for Inspirations (or by default) */}
                            {isInspirations && (
                                <div className="space-y-1.5">
                                    <label className="text-[16px] font-medium text-primary-foreground block">
                                        Attach Image <span className="text-[#ff6b6b]">*</span>
                                    </label>
                                    <FileInput
                                        name="attachImage"
                                        runForm={runForm}
                                        icon={<AttachIcon width={16} height={16} color="#858585" />}
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            if (file) {
                                                runForm.setFieldValue("attachImage", file)
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Design No - Only for Design */}
                            {isDesign && (
                                <div className="space-y-1.5">
                                    <label className="text-[16px] font-medium text-primary-foreground block">
                                        Design No <span className="text-[#ff6b6b]">*</span>
                                    </label>
                                    <Input
                                        name="designNo"
                                        placeholder="Enter design number"
                                        runForm={runForm}
                                        className="h-[45px]"
                                    />
                                </div>
                            )}

                            {/* Assigned To - For Sketches or Design */}
                            {(isSketches || isDesign) && (
                                <div className="space-y-1.5">
                                    <label className="text-[16px] font-medium text-primary-foreground block">
                                        Assigned To <span className="text-[#ff6b6b]">*</span>
                                    </label>
                                    <FormSelect
                                        name="assignedTo"
                                        runForm={runForm}
                                        options={ASSIGNED_OPTIONS}
                                        placeholder="Assigned to"
                                        isSearch={true}
                                        triggerClassName="h-[45px]!"
                                    />
                                </div>
                            )}

                            {/* Note - Always shown for both */}
                            <div className="space-y-1.5">
                                <label className="text-[16px] font-medium text-primary-foreground block">
                                    Note
                                </label>
                                <FloatingTextarea
                                    name="note"
                                    label="Add Note"
                                    runForm={runForm}
                                    isFloating={false}
                                    className="min-h-[120px]"
                                />
                            </div>
                        </div>

                        <div className="px-6 md:px-[60px] md:pb-5 flex justify-center">
                            <Button
                                type="submit"
                                className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-9 px-12 rounded-[5px] font-semibold text-[16px] min-w-[124px]"
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </CommonModal>
    )
}

