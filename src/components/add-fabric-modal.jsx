"use client"

import * as React from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import { CommonModal } from "./CommonModal"
import { Button } from "@/components/ui/button"
import { FloatingTextarea } from "./ui/floating-textarea"
import { FormSelect } from "./ui/form-select"
import { API_LIST_AUTH } from "@/hooks/api-list"
import { useGet, usePost } from "@/hooks/useApi"
import { ImgAcceptType } from "@/lib/validation"
import AttachIcon from "@/assets/AttachIcon"
import { Input } from "./ui/input"
import { FileInput } from "./ui/file-input"
import { FormColorPicker } from "./ui/form-color-picker"
import { StateUpdate, toFormData } from "@/lib/helper"
import { toast } from "sonner"

const STEP_CONFIG = {
    Fabric: {
        create: API_LIST_AUTH.Fabric.create,
        update: API_LIST_AUTH.Fabric.update,
        delete: API_LIST_AUTH.Fabric.delete,
        idKey: "fabric_id",
        nameKey: "fabric_name",
        qualityKey: "fabric_quality",
        priceKey: "fabric_price",
        vendorKey: "fabric_vender",
        meterKey: "fabric_meter",
        colorKey: "fabric_color",
        imageKey: "fabric_image",
    },
    Yarn: {
        create: API_LIST_AUTH.Yarn.create,
        update: API_LIST_AUTH.Yarn.update,
        delete: API_LIST_AUTH.Yarn.delete,
        idKey: "yarn_id",
        nameKey: "yarn_name",
        qualityKey: "yarn_quality",
        priceKey: "yarn_price",
        vendorKey: "yarn_vender",
        meterKey: "yarn_meter",
        colorKey: "yarn_color",
        imageKey: "yarn_image",
    }
}

export function AddFabricModal({
    open,
    onOpenChange,
    onAdd,
    title = "Add Fabric",
    isLoading = false,
    initialData = null
}) {

    const formikRef = React.useRef(null)

    const isYarn = title === "Add Yarn"
    const config = isYarn ? STEP_CONFIG.Yarn : STEP_CONFIG.Fabric
    const isEdit = !!initialData

    const [data, setData] = React.useState({
        fabric_stock_categories: [],
        fabric_stock_sub_categories: [],
        yarn_stock_categories: [],
        yarn_stock_sub_categories: [],
        sequence_stock_categories: []
    })

    const { data: settingData } = useGet("setting", API_LIST_AUTH.setting, {}, {
        enabled: open,
        staleTime: 0,
        gcTime: 0
    })

    React.useEffect(() => {
        if (settingData?.success && settingData?.data) {
            const convertedData = Object.fromEntries(
                Object.entries(settingData.data).map(([key, value]) => [
                    key,
                    value
                        ? value.split(",").map(item => ({
                            label: item.trim(),
                            value: item.trim()
                        }))
                        : []
                ])
            );
            StateUpdate(convertedData, setData)
        }
    }, [settingData])

    const validationSchema = React.useMemo(() => {
        const type = isYarn ? "Yarn" : "Fabric"

        const commonFields = {
            [config.idKey]: Yup.string().required(`${type} Id is required`),
            category: Yup.string().required("Category is required"),
            sub_category: Yup.string().required("Sub Category is required"),
            [config.priceKey]: Yup.number()
                .transform((value, originalValue) =>
                    originalValue === "" ? undefined : value
                )
                .required(`${type} price is required`)
                .typeError(`${type} price must be a number`),
            [config.vendorKey]: Yup.string().trim().min(3, "Vendor must be at least 3 characters").required(`${type} vendor is required`),
            [config.colorKey]: Yup.string().required(`${type} color is required`),
            note: Yup.string().optional(),
            [config.imageKey]: isEdit
                ? Yup.mixed().optional()
                : Yup.mixed().required(`${type} image is required`),
            [config.nameKey]: Yup.string().required(`${type} name is required`),
        }

        if (isYarn) {
            return Yup.object().shape({
                ...commonFields,
                [config.meterKey]: Yup.string().required("Num cons is required"),
                [config.qualityKey]: Yup.string().required("Sub quality is required"),
            })
        }

        return Yup.object().shape({
            ...commonFields,
            [config.qualityKey]: Yup.string().trim().min(3, "Quality must be at least 3 characters").required("Quality is required"),
            [config.meterKey]: Yup.number()
                .transform((value, originalValue) =>
                    originalValue === "" ? undefined : value
                )
                .required("Meter is required")
                .typeError("Meter must be a number"),
        })
    }, [isYarn, config, isEdit])

    const handleOpenChange = (isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen && formikRef.current) {
            formikRef.current.resetForm()
        }
    }

    const { mutate: addFabric, isPending } = usePost(
        isEdit ? config.update : config.create,
        {
            onSuccess: (res) => {
                if (res.success) {
                    onAdd(res?.data)
                    onOpenChange(false)
                }
            },
            onError: (error) => {
                toast.error(error.message || "Something went wrong")
            }
        }
    )

    const HandleSubmit = (values) => {
        addFabric(toFormData(values))
    }

    return (
        <CommonModal
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
        >
            <Formik
                innerRef={formikRef}
                initialValues={React.useMemo(() => {
                    const common = {
                        [config.idKey]: initialData?.[config.idKey] || "",
                        category: initialData?.category || "",
                        sub_category: initialData?.sub_category || "",
                        [config.priceKey]: initialData?.[config.priceKey] || "",
                        [config.vendorKey]: initialData?.[config.vendorKey] || "",
                        [config.colorKey]: initialData?.[config.colorKey] || "",
                        note: initialData?.note || "",
                        [config.imageKey]: "",
                        [config.nameKey]: initialData?.[config.nameKey] || "",
                    }

                    if (isYarn) {
                        return {
                            ...common,
                            [config.meterKey]: initialData?.[config.meterKey] || "",
                            [config.qualityKey]: initialData?.[config.qualityKey] || ""
                        }
                    }

                    return {
                        ...common,
                        [config.qualityKey]: initialData?.[config.qualityKey] || "",
                        [config.meterKey]: initialData?.[config.meterKey] || ""
                    }
                }, [isYarn, initialData, config])}
                validationSchema={validationSchema}
                onSubmit={HandleSubmit}
                enableReinitialize
            >
                {(runForm) => (
                    <form
                        onSubmit={runForm.handleSubmit}
                        className="flex flex-col flex-1"
                    >
                        <div className="px-6 py-5 md:px-9 md:py-10 space-y-4 flex-1 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7.5 gap-y-5.25">
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        {isYarn ? "Yarn Name" : "Fabric Name"}
                                    </label>
                                    <Input
                                        name={config.nameKey}
                                        placeholder={isYarn ? "Yarn Name" : "Fabric Name"}
                                        runForm={runForm}
                                        className="h-[45px]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        Id
                                    </label>
                                    <Input
                                        name={config.idKey}
                                        placeholder={isYarn ? "Yarn Id" : "Id"}
                                        runForm={runForm}
                                        className="h-[45px]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        Category
                                    </label>
                                    <FormSelect
                                        name="category"
                                        runForm={runForm}
                                        options={data.fabric_stock_categories}
                                        placeholder="Select category"
                                        isSearch
                                        triggerClassName="h-[45px]!"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        {isYarn ? "Yarn" : "Sub Category"}
                                    </label>
                                    <FormSelect
                                        name={"sub_category"}
                                        runForm={runForm}
                                        options={data.fabric_stock_sub_categories}
                                        placeholder={isYarn ? "Select Sub Category" : "Select Sub Category"}
                                        isSearch
                                        triggerClassName="h-[45px]!"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        Attach Image
                                    </label>
                                    <FileInput
                                        name={config.imageKey}
                                        accept={ImgAcceptType}
                                        runForm={runForm}
                                        icon={<AttachIcon width={16} height={16} color="#858585" />}
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            if (file) {
                                                runForm.setFieldValue(config.imageKey, file)
                                            }
                                        }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        {isYarn ? "Num Cons" : "Quality"}
                                    </label>
                                    <Input
                                        name={isYarn ? config.meterKey : config.qualityKey}
                                        placeholder={isYarn ? "Num cons" : "Quality"}
                                        runForm={runForm}
                                        className="h-[45px]"
                                    />
                                </div>


                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        Price
                                    </label>
                                    <Input
                                        type="number"
                                        name={config.priceKey}
                                        placeholder="Price"
                                        runForm={runForm}
                                        className="h-[45px]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        Vendor
                                    </label>
                                    <Input
                                        name={config.vendorKey}
                                        placeholder="Vendor"
                                        runForm={runForm}
                                        className="h-[45px]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        {isYarn ? "Sub Quality" : "Meter"}
                                    </label>
                                    <Input
                                        type="number"
                                        name={isYarn ? config.qualityKey : config.meterKey}
                                        placeholder={isYarn ? "Sub quality" : "Meter"}
                                        runForm={runForm}
                                        className="h-[45px]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                        Color
                                    </label>
                                    <div className="relative">
                                        <FormColorPicker
                                            name={config.colorKey}
                                            runForm={runForm}
                                            placeholder="Pick a color"
                                        />
                                    </div>
                                </div>
                            </div>



                            <div className="space-y-1.5 mt-6">
                                <label className="text-[14px] font-medium text-primary-foreground block">
                                    Note
                                </label>
                                <FloatingTextarea
                                    name="note"
                                    label="Add note"
                                    runForm={runForm}
                                    isFloating={false}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-3 md:px-[36px] md:py-[20px] flex justify-end">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-11.25 px-8 rounded-md font-semibold text-[16px]"
                            >
                                {isPending ? "Saving..." : isEdit ? "Update" : "Add"}
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </CommonModal>
    )
}
