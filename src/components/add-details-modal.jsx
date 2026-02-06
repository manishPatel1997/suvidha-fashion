"use client"

import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { CommonModal } from "./CommonModal"
import { Input } from "@/components/ui/input"
import { FormSelect } from "@/components/ui/form-select"
import { Button } from "@/components/ui/button"
import { FormColorPicker } from "@/components/ui/form-color-picker"

const validationSchema = Yup.object().shape({
    yarn: Yup.string().required("Yarn is required"),
    qualityCon: Yup.string().required("Quality con is required"),
    sequence: Yup.string().required("Sequence is required"),
    cdCon: Yup.string().required("CD con is required"),
    meter: Yup.string().required("Meter is required"),
    color: Yup.string().required("Color is required"),
    designNo: Yup.string().required("Design no is required"),
})

export function AddDetailsModal({ open, onOpenChange, onAdd }) {
    const formik = useFormik({
        initialValues: {
            yarn: "",
            qualityCon: "",
            sequence: "",
            cdCon: "",
            meter: "",
            color: "",
            designNo: "",
        },
        validationSchema,
        onSubmit: (values) => {
            if (onAdd) onAdd(values)
            handleOpenChange(false)
        },
    })

    const handleOpenChange = (isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) {
            formik.resetForm()
        }
    }

    const yarnOptions = [
        { value: "cotton", label: "Cotton" },
        { value: "silk", label: "Silk" },
    ]

    const sequenceOptions = [
        { value: "seq1", label: "Sequence 1" },
        { value: "seq2", label: "Sequence 2" },
    ]

    return (
        <CommonModal
            open={open}
            onOpenChange={handleOpenChange}
            title="Add Detail"
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1">
                <div className="px-6 py-5 md:px-[60px] md:py-8 space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12.5 gap-y-7">
                        {/* Yarn */}
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Yarn
                            </label>
                            <FormSelect
                                name="yarn"
                                options={yarnOptions}
                                placeholder="Select yarn"
                                runForm={formik}
                            />
                        </div>

                        {/* Quality Con */}
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Quality Con
                            </label>
                            <Input
                                name="qualityCon"
                                placeholder="Quality con"
                                className="h-11.25 border-muted-foreground rounded-md placeholder:text-muted-foreground placeholder:text-[14px] text-[14px]"
                                runForm={formik}
                            />
                        </div>

                        {/* Sequence */}
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Sequence
                            </label>
                            <FormSelect
                                name="sequence"
                                options={sequenceOptions}
                                placeholder="Select sequence"
                                runForm={formik}
                            />
                        </div>

                        {/* CD Con */}
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                CD Con
                            </label>
                            <Input
                                name="cdCon"
                                placeholder="CD con"
                                className="h-11.25 border-muted-foreground rounded-md placeholder:text-muted-foreground placeholder:text-[14px] text-[14px]"
                                runForm={formik}
                            />
                        </div>

                        {/* Meter */}
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Meter
                            </label>
                            <Input
                                name="meter"
                                placeholder="Meter"
                                className="h-11.25 border-muted-foreground rounded-md placeholder:text-muted-foreground placeholder:text-[14px] text-[14px]"
                                runForm={formik}
                            />
                        </div>

                        {/* Color */}
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Color
                            </label>
                            <FormColorPicker
                                name="color"
                                runForm={formik}
                                placeholder="Pick a color"
                            />
                        </div>

                        {/* Design No. */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Design No.
                            </label>
                            <Input
                                name="designNo"
                                placeholder="Design no"
                                className="h-11.25 border-muted-foreground rounded-md placeholder:text-muted-foreground placeholder:text-[14px] text-[14px]"
                                runForm={formik}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 md:px-[60px] md:pb-10 flex justify-end">
                    <Button
                        type="submit"
                        className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-10 px-12 rounded-md font-semibold text-[16px] min-w-[120px]"
                    >
                        Add
                    </Button>
                </div>
            </form>
        </CommonModal>
    )
}
