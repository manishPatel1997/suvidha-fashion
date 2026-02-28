"use client"

import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { CommonModal } from "./CommonModal"
import { Input } from "@/components/ui/input"
import { FormSelect } from "@/components/ui/form-select"
import { Button } from "@/components/ui/button"
import { FormColorPicker } from "@/components/ui/form-color-picker"
import { StateUpdate } from "@/lib/helper"
import { API_LIST_AUTH } from "@/hooks/api-list"
import { usePost } from "@/hooks/useApi"

const validationSchema = Yup.object().shape({
    mainQuantity: Yup.number().optional().nullable(),
    yarn_assign_id: Yup.string().nullable(),
    sequence_assign_id: Yup.string().nullable(),

    quality_con: Yup.string().required("Quality con is required"),
    sample_cd_con: Yup.string().required("CD con is required"),
    sample_meter: Yup.number()
        .typeError("Meter must be a number")
        .required("Meter is required")
        .max(
            Yup.ref("mainQuantity"),
            ({ max }) => `Meter cannot be greater than ${max ? max : 0}`
        ),
    sample_color: Yup.string().required("Color is required"),
    sample_design_no: Yup.string().required("Design no is required"),
}).test(
    "yarn-or-sequence-required",
    "Either Yarn or Sequence is required",
    function (values) {
        const { yarn_assign_id, sequence_assign_id } = values

        if (!yarn_assign_id && !sequence_assign_id) {
            return this.createError({
                path: "yarn_assign_id", // error will show on this field
                message: "Either Yarn or Sequence is required",
            })
        }

        return true
    }
)
export function AddDetailsModal({ open, onOpenChange, onAdd, selectData, PreData, assign }) {
    const [data, setData] = React.useState({
        yarnOption: [],
        sequenceOption: []
    })

    React.useEffect(() => {
        const formattedSequence = PreData?.sequencesData?.sequences?.map((item) => ({
            value: item.id.toString(),
            label: item.sequence_name || item.name || `Sequence ${item.id}`,
            rawData: item
        }))
        const formattedYarn = PreData?.yarnData?.yarns?.map((item) => ({
            value: item.id.toString(),
            label: item.yarn_name || item.name || `Yarn ${item.id}`,
            rawData: item
        }))
        StateUpdate({ yarnOption: formattedYarn, sequenceOption: formattedSequence }, setData)
    }, [PreData])


    const { mutate: addDetails, isPending } = usePost(API_LIST_AUTH.Sample.assign, {
        onSuccess: (res, variables) => {
            if (res.success) {
                onAdd(res.data)
            }
        },
        onError: (error) => {
            console.error("Error updating target:", error)
        }
    })
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            mainQuantity: (selectData?.fabric_meter - assign) || "",
            yarn_assign_id: "",
            sequence_assign_id: "",
            quality_con: "",
            sample_cd_con: "",
            sample_color: "",
            sample_meter: "",
            sample_design_no: "",
        },
        validationSchema,
        onSubmit: (values) => {

            const dataVal = { ...values }
            delete dataVal.mainQuantity
            if (dataVal?.yarn_assign_id == "") {
                delete dataVal.yarn_assign_id
            }
            if (dataVal?.sequence_assign_id == "") {
                delete dataVal.sequence_assign_id
            }
            dataVal.sample_id = PreData?.sampleData?.id?.toString()
            dataVal.fabric_assign_id = selectData?.id?.toString()
            addDetails(dataVal)
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
                                name="yarn_assign_id"
                                runForm={formik}
                                options={data.yarnOption}
                                placeholder="Select yarn"
                                isSearch
                                triggerClassName="h-[45px]!"
                            // onChange={(val) => {
                            //     const selected = data.yarnOption.find(opt => opt.value === val)
                            //     if (selected) {
                            //         StateUpdate({ selectedData: selected.rawData }, setData)
                            //     }
                            // }}
                            />
                        </div>

                        {/* Quality Con */}
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Quality Con
                            </label>
                            <Input
                                name="quality_con"
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
                                name="sequence_assign_id"
                                runForm={formik}
                                options={data.sequenceOption}
                                placeholder="Select sequence"
                                isSearch
                                triggerClassName="h-[45px]!"
                            // onChange={(val) => {
                            //     const selected = data.sequenceOption.find(opt => opt.value === val)
                            //     if (selected) {
                            //         StateUpdate({ selectedData: selected.rawData }, setData)
                            //     }
                            // }}
                            />
                        </div>

                        {/* CD Con */}
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                CD Con
                            </label>
                            <Input
                                name="sample_cd_con"
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
                                name="sample_meter"
                                placeholder="Meter"
                                className="h-11.25 border-muted-foreground rounded-md placeholder:text-muted-foreground placeholder:text-[14px] text-[14px]"
                                runForm={formik}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Color
                            </label>
                            <FormColorPicker
                                name="sample_color"
                                label="Color"
                                runForm={formik}
                                placeholder="Pick a color"
                                isFloating={false}
                            />
                        </div>

                        {/* Design No. */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[16px] font-medium text-primary-foreground block">
                                Design No.
                            </label>
                            <Input
                                name="sample_design_no"
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
