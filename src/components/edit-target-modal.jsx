"use client"

import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { CommonModal } from "./CommonModal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const validationSchema = Yup.object().shape({
    target: Yup.string().required("Target is required"),
})

export function EditTargetModal({ open, onOpenChange, onSave, initialValue = "", title = "Inspirations Target" }) {
    const formik = useFormik({
        initialValues: {
            target: initialValue,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            if (onSave) onSave(values.target)
            handleOpenChange(false)
        },
    })

    const handleOpenChange = (isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) {
            formik.resetForm()
        }
    }

    return (
        <CommonModal
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
            className="sm:max-w-[550px]"
            contentClassName="max-w-[450px]"
            containerClassName="py-10 lg:px-10 lg:py-15"
        >
            <form onSubmit={formik.handleSubmit} className="p-6 md:p-10  space-y-6 flex flex-col">
                <div className="space-y-1.5">
                    <label className="text-[16px] font-medium text-primary-foreground block">
                        {title}
                    </label>
                    <Input
                        name="target"
                        placeholder="Add target"
                        className="h-11.25 border-muted-foreground rounded-md placeholder:text-muted-foreground placeholder:text-[14px] text-[14px]"
                        runForm={formik}
                    />
                </div>

                <div className="flex justify-center pt-2">
                    <Button
                        type="submit"
                        className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-10 px-10 rounded-md font-semibold text-[16px] min-w-[120px]"
                    >
                        Add
                    </Button>
                </div>
            </form>
        </CommonModal>
    )
}
