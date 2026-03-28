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
import { useQuery } from "@tanstack/react-query"
import { post } from "@/lib/api"
import { ImgAcceptType, PasswordValidation } from "@/lib/validation"
import AttachIcon from "@/assets/AttachIcon"
import { Input } from "./ui/input"
import { FileInput } from "./ui/file-input"
import { FormColorPicker } from "./ui/form-color-picker"
import { StateUpdate, toFormData } from "@/lib/helper"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ChevronDown, Check, EyeOff, Eye } from "lucide-react"
import PasswordIcon from "@/assets/password-icon"
import { cn } from "@/lib/utils"

const module_access = [
    "pre_production",
    "production",
    "post_production",
    "fabric",
    "yarn",
    "sequence",
    "user",
    "vendor",
    "setting",
    "task",
    "ideas",
    "sketches"
]

const STEP_CONFIG = {
    Fabric: {
        create: API_LIST_AUTH.Fabric.create,
        update: API_LIST_AUTH.Fabric.update,
        delete: API_LIST_AUTH.Fabric.delete,
        idKey: "fabric_id",
        nameKey: "fabric_name",
        qualityKey: "fabric_quality",
        subQualityKey: "fabric_sub_quality",
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
        subQualityKey: "yarn_sub_quality",
        priceKey: "yarn_price",
        vendorKey: "yarn_vender",
        meterKey: "yarn_num_cons",
        colorKey: "yarn_color",
        imageKey: "yarn_image",
    },
    Sequences: {
        create: API_LIST_AUTH.Sequences.create,
        update: API_LIST_AUTH.Sequences.update,
        delete: API_LIST_AUTH.Sequences.delete,
        idKey: "sequence_id",
        nameKey: "sequence_name",
        qualityKey: "sequence_quality",
        priceKey: "sequence_price",
        vendorKey: "sequence_vender",
        // meterKey: "yarn_num_cons",
        colorKey: "sequence_color",
        imageKey: "sequence_image",
    },
    People: {
        create: API_LIST_AUTH.User.create,
        update: API_LIST_AUTH.User.update,
        delete: API_LIST_AUTH.User.delete,
        idKey: "user_id",
        nameKey: "name",
        emailKey: "email",
        passwordKey: "password",
        contactKey: "contact",
        moduleAccessKey: "module_access",
        roleKey: "role",
    },
    Vendor: {
        create: API_LIST_AUTH.Vendor.create,
        update: API_LIST_AUTH.Vendor.update,
        delete: API_LIST_AUTH.Vendor.delete,
        idKey: "id",
        nameKey: "name",
        categoryKey: "category",
        contactKey: "contact",
        addressKey: "address",
    },

}

const categoryOptions = [
    { value: "fabric", label: "Fabric" },
    { value: "yarn", label: "Yarn" },
    { value: "sequences", label: "Sequences" },
]

export function AddFabricModal({
    open,
    onOpenChange,
    onAdd,
    // title = "Add Fabric",
    initialData = null,
    isFabric = false,
    isSequences = false,
    isPeople = false,
    isVendor = false
}) {

    const formikRef = React.useRef(null)
    const [showPassword, setShowPassword] = React.useState(false)

    // const isYarn = title === "Add Yarn"
    const config = isPeople ? STEP_CONFIG.People : isVendor ? STEP_CONFIG.Vendor : isSequences ? STEP_CONFIG.Sequences : isFabric ? STEP_CONFIG.Fabric : STEP_CONFIG.Yarn
    const isEdit = !!initialData
    const typeLabel = isPeople ? "People" : isVendor ? "Vendor" : isFabric ? "Fabric" : isSequences ? "Sequences" : "Yarn"
    // const isEdit = !!initialData

    const [data, setData] = React.useState({
        fabric_stock_categories: [],
        yarn_stock_categories: [],

        fabric_stock_sub_categories: [],
        yarn_stock_sub_categories: [],

        sequence_stock_categories: [],
        sequence_stock_quality: []
    })

    const { data: settingData } = useGet("setting", API_LIST_AUTH.setting, {}, {
        enabled: open,
        staleTime: 0,
        gcTime: 0
    })

    const vendorType = isFabric ? "fabric" : isSequences ? "sequences" : "yarn"

    const { data: vendorData } = useQuery({
        queryKey: ["vendors", vendorType],
        queryFn: () => post(API_LIST_AUTH.Vendor.type, { type: vendorType }),
        enabled: open && !isVendor && !isPeople,
        staleTime: 0,
        gcTime: 0
    })

    const vendorOptions = React.useMemo(() => {
        if (vendorData?.success && Array.isArray(vendorData.data)) {
            return vendorData.data.map(item => ({
                label: item.name,
                value: item.name // or item.id if the backend expects ID
            }))
        }
        return []
    }, [vendorData])

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

    // const validationSchema = React.useMemo(() => {
    //     const type = isSequences ? "Sequence" : isFabric ? "Fabric" : "Yarn"

    //     const commonFields = {
    //         [config.idKey]: Yup.string()
    //             .required(`${type} Id is required`)
    //             .min(3, `${type} Id must be at least 3 characters`),
    //         category: Yup.string().required("Category is required"),
    //         yarn_quality: Yup.string().required("Sub Category is required"),
    //         [config.priceKey]: Yup.number()
    //             .transform((value, originalValue) =>
    //                 originalValue === "" ? undefined : value
    //             )
    //             .required(`${type} price is required`)
    //             .typeError(`${type} price must be a number`),
    //         [config.vendorKey]: Yup.string().trim().min(3, "Vendor must be at least 3 characters").required(`${type} vendor is required`),
    //         [config.colorKey]: Yup.string().required(`${type} color is required`),
    //         note: Yup.string().optional(),
    //         [config.imageKey]: Yup.mixed().required(`${type} image is required`),
    //         // [config.imageKey]: isEdit
    //         //     ? Yup.mixed().optional()
    //         //     : Yup.mixed().required(`${type} image is required`),
    //         [config.nameKey]: Yup.string().required(`${type} name is required`),
    //     }

    //     if (!isFabric && !isSequences) {
    //         return Yup.object().shape({
    //             ...commonFields,
    //             [config.meterKey]: Yup.string().required("Num cons is required"),
    //             [config.qualityKey]: Yup.string().required("Sub quality is required"),
    //         })
    //     }

    //     if (isSequences) {
    //         return Yup.object().shape({
    //             ...commonFields,
    //             sequence_cd: Yup.string().required("CD is required"),
    //         })
    //     }

    //     return Yup.object().shape({
    //         ...commonFields,
    //         [config.qualityKey]: Yup.string().trim().min(3, "Quality must be at least 3 characters").required("Quality is required"),
    //         [config.meterKey]: Yup.number()
    //             .transform((value, originalValue) =>
    //                 originalValue === "" ? undefined : value
    //             )
    //             .required(!isFabric ? "Num cons is required" : "Meter is required")
    //             .typeError(!isFabric ? "Num cons must be a number" : "Meter must be a number"),
    //     })
    // }, [isFabric,isSequences, config])
    const validationSchema = React.useMemo(() => {
        if (isPeople) {
            return Yup.object().shape({
                // [config.idKey]: Yup.string()
                //     .required(`Id is required`),
                [config.nameKey]: Yup.string()
                    .trim()
                    .min(3, "Minimum 3 characters required")
                    .required("Name is required"),
                [config.emailKey]: Yup.string().email("Invalid email").required("Email is required"),
                // [config.passwordKey]: PasswordValidation,
                [config.passwordKey]: isEdit
                    ? Yup.string().notRequired()
                    : PasswordValidation,
                [config.contactKey]: Yup.string()
                    .required("Contact is required")
                    .matches(/^[0-9]{10}$/, "Contact must be 10 digits"),
                [config.moduleAccessKey]: Yup.array().min(1, "Select at least one module access"),
                [config.roleKey]: Yup.string().required("Role is required"),
            })
        }

        if (isVendor) {
            return Yup.object().shape({
                [config.nameKey]: Yup.string()
                    .trim()
                    .min(3, "Minimum 3 characters required")
                    .required("Name is required"),
                [config.categoryKey]: Yup.string().required(`Category is required`),
                [config.contactKey]: Yup.string()
                    .required("Contact is required")
                    .matches(/^[0-9]{10}$/, "Contact must be 10 digits"),
                [config.addressKey]: Yup.string().required(`Address is required`),
            })
        }

        const type = isSequences ? "Sequence" : isFabric ? "Fabric" : "Yarn"

        const commonFields = {
            [config.idKey]: Yup.string()
                .required(`${type} Id is required`),

            category: Yup.string().required("Category is required"),

            ...(!isSequences && {
                [config.qualityKey]: Yup.string().required("Quality is required"),
            }),
            ...(!isSequences && {
                [config.subQualityKey]: Yup.string().required("Sub Quality is required"),
            }),

            [config.priceKey]: Yup.number()
                .transform((value, originalValue) =>
                    originalValue === "" ? undefined : value
                )
                .required(`${type} price is required`)
                .typeError(`${type} price must be a number`),

            // [config.vendorKey]: Yup.string()
            //     .trim()
            //     .required(`${type} vendor is required`),

            [config.colorKey]: Yup.string().required(`${type} color is required`),

            note: Yup.string().optional(),

            [config.imageKey]: Yup.mixed().required(`${type} image is required`),

            [config.nameKey]: Yup.string().required(`${type} name is required`),
        }

        if (!isFabric && !isSequences) {
            return Yup.object().shape({
                ...commonFields,
                [config.meterKey]: Yup.string().trim().min(3, "Minimum 3 characters required")
                    .required("Num cons is required"),
                [config.qualityKey]: Yup.string().required("Sub quality is required"),
            })
        }

        if (isSequences) {
            return Yup.object().shape({
                ...commonFields,
                sequence_cd: Yup.string()
                    .required("Sequence CD is required"),
                [config.qualityKey]: Yup.string().required("Quality is required"),
            })
        }

        return Yup.object().shape({
            ...commonFields,
            [config.qualityKey]: Yup.string()
                .trim()
                .required("Quality is required"),

            [config.meterKey]: Yup.number()
                .transform((value, originalValue) =>
                    originalValue === "" ? undefined : value
                )
                .required("Meter is required")
                .typeError("Meter must be a number"),
        })

    }, [isFabric, isSequences, isPeople, config, isEdit])
    // }, [isFabric, config, isEdit])

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
        if (isPeople || isVendor) {
            const data = { ...values }
            if (isPeople && isEdit) {
                delete data.user_id
                data.id = initialData?.id
            }
            addFabric(data)
        } else {
            addFabric(toFormData(values))
        }
    }

    return (
        <CommonModal
            open={open}
            onOpenChange={handleOpenChange}
            title={isEdit ? `Edit ${typeLabel}` : `Add ${typeLabel}`}
        >
            <Formik
                innerRef={formikRef}
                initialValues={React.useMemo(() => {
                    const getModuleAccess = (val) => {
                        if (Array.isArray(val)) return val;
                        if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
                        return [];
                    };
                    if (isPeople) {
                        const initialRole = initialData?.[config.roleKey] || "";
                        let initialModuleAccess = getModuleAccess(initialData?.[config.moduleAccessKey]);

                        // Enforce role-based module access rules on initialization
                        if (initialRole === 'admin') {
                            initialModuleAccess = initialModuleAccess.filter(i => i !== 'task');
                        } else if (initialRole) {
                            initialModuleAccess = ['task'];
                        }

                        return {
                            // id: initialData?.id || "",
                            [config.idKey]: initialData?.[config.idKey] || "",
                            [config.nameKey]: initialData?.[config.nameKey] || "",
                            [config.emailKey]: initialData?.[config.emailKey] || "",
                            // [config.passwordKey]: initialData?.[config.passwordKey] || "",
                            ...(!isEdit && { [config.passwordKey]: initialData?.[config.passwordKey] || "" }),
                            [config.contactKey]: initialData?.[config.contactKey] || "",
                            [config.moduleAccessKey]: initialModuleAccess,
                            [config.roleKey]: initialRole,
                        }
                    }

                    if (isVendor) {
                        return {
                            id: initialData?.id || "",
                            [config.nameKey]: initialData?.[config.nameKey] || "",
                            [config.categoryKey]: initialData?.[config.categoryKey] || "",
                            [config.contactKey]: initialData?.[config.contactKey] || "",
                            [config.addressKey]: initialData?.[config.addressKey] || "",
                        }
                    }

                    const common = {
                        id: initialData?.id || "",
                        [config.idKey]: initialData?.[config.idKey] || "",
                        category: initialData?.category || "",
                        [config.priceKey]: initialData?.[config.priceKey] || "",
                        [config.vendorKey]: initialData?.[config.vendorKey] || "",
                        [config.colorKey]: initialData?.[config.colorKey] || "",
                        note: initialData?.note || "",
                        [config.imageKey]: "",
                        [config.nameKey]: initialData?.[config.nameKey] || "",
                    }
                    if (!isSequences) {
                        common[config.qualityKey] = initialData?.[config.qualityKey] ?? ""
                        common[config.subQualityKey] = initialData?.[config.subQualityKey] ?? ""
                    }

                    if (!isFabric && !isSequences) {
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
                }, [isFabric, initialData, isSequences, isPeople, isVendor, config])}
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
                            {isPeople ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7.5 gap-y-5.25">
                                    {/* <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Id
                                        </label>
                                        <Input
                                            name={config.idKey}
                                            placeholder="Id"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div> */}
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Name
                                        </label>
                                        <Input
                                            name={config.nameKey}
                                            placeholder="Name"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Role
                                        </label>
                                        <FormSelect
                                            name="role"
                                            runForm={runForm}
                                            options={[
                                                { value: "admin", label: "Admin" },
                                                { value: "sketcher", label: "Sketcher" },
                                                { value: "designer", label: "Designer" }
                                            ]}
                                            placeholder="Select Role"
                                            onChange={(val) => {
                                                if (val === "admin") {
                                                    const current = runForm.values[config.moduleAccessKey] || [];
                                                    runForm.setFieldValue(config.moduleAccessKey, current.filter(i => i !== "task"));
                                                } else {
                                                    runForm.setFieldValue(config.moduleAccessKey, ["task"]);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Module Access
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild className='border-muted-foreground'>
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-[45px] justify-between font-normal hover:bg-white overflow-hidden"
                                                >
                                                    <span className="truncate text-left flex-1">
                                                        {Array.isArray(runForm.values[config.moduleAccessKey]) && runForm.values[config.moduleAccessKey].length > 0
                                                            ? runForm.values[config.moduleAccessKey]
                                                                .map(val => val.replace(/_/g, " "))
                                                                .join(", ")
                                                            : "Select Module Access"}
                                                    </span>
                                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-(--radix-popover-trigger-width) p-0 bg-white border-[#dcccbd] overflow-y-auto max-h-[300px]">
                                                <div className="flex flex-col p-1">
                                                    {(runForm.values.role === "admin"
                                                        ? module_access.filter(i => i !== "task")
                                                        : runForm.values.role
                                                            ? ["task"]
                                                            : []).map((option) => {
                                                                const isSelected = runForm.values[config.moduleAccessKey]?.includes(option);
                                                                return (
                                                                    <div
                                                                        key={option}
                                                                        onClick={() => {
                                                                            if (runForm.values.role !== "admin") return;
                                                                            const current = runForm.values[config.moduleAccessKey] || [];
                                                                            const next = isSelected
                                                                                ? current.filter((v) => v !== option)
                                                                                : [...current, option];
                                                                            runForm.setFieldValue(config.moduleAccessKey, next);
                                                                        }}
                                                                        className={cn(
                                                                            "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#dcccbd]/20 rounded-sm text-[14px]",
                                                                            runForm.values.role !== "admin" && "opacity-80 cursor-not-allowed"
                                                                        )}
                                                                    >
                                                                        <span className="capitalize">{option.replace("_", " ")}</span>
                                                                        {isSelected && <Check className="h-4 w-4" />}
                                                                    </div>
                                                                );
                                                            })}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        {runForm.touched[config.moduleAccessKey] && runForm.errors[config.moduleAccessKey] && (
                                            <p className="text-red-500 text-xs mt-1">{runForm.errors[config.moduleAccessKey]}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Contact
                                        </label>
                                        <Input
                                            name={config.contactKey}
                                            placeholder="Contact"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Email
                                        </label>
                                        <Input
                                            name={config.emailKey}
                                            placeholder="Email"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>

                                    {!isEdit && <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Password
                                        </label>
                                        {/* <Input
                                            type="password"
                                            name={config.passwordKey}
                                            placeholder="Password"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        /> */}

                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name={config.passwordKey}
                                                placeholder="Password"
                                                className={"pl-13 h-[45px]"}
                                                runForm={runForm}
                                                icon={<PasswordIcon />}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-foreground transition-colors"
                                            >
                                                {!showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                            </button>
                                        </div>
                                    </div>}
                                </div>
                            ) : isVendor ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7.5 gap-y-5.25">
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Name
                                        </label>
                                        <Input
                                            name={config.nameKey}
                                            placeholder="Name"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Category
                                        </label>
                                        <FormSelect
                                            name={config.categoryKey}
                                            runForm={runForm}
                                            options={categoryOptions}
                                            placeholder="Select category"
                                        />
                                        {/* <Input
                                            name={config.categoryKey}
                                            placeholder="Category"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        /> */}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Contact
                                        </label>
                                        <Input
                                            name={config.contactKey}
                                            placeholder="Contact"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5 lg:col-span-2">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Address
                                        </label>
                                        <FloatingTextarea
                                            name={config.addressKey}
                                            label="Address"
                                            runForm={runForm}
                                            isFloating={false}
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7.5 gap-y-5.25">
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            {isSequences ? "Sequences Name" : !isFabric ? "Yarn Name" : "Fabric Name"}
                                        </label>
                                        <Input
                                            name={config.nameKey}
                                            placeholder={isSequences ? "Sequences Name" : !isFabric ? "Yarn Name" : "Fabric Name"}
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>
                                    {isSequences && <div className="space-y-1.5">
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
                                    </div>}
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Id
                                        </label>
                                        <Input
                                            name={config.idKey}
                                            placeholder={isSequences ? "Sequences Id" : !isFabric ? "Yarn Id" : "Id"}
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
                                            options={!isFabric ? data.yarn_stock_categories : data.fabric_stock_categories}
                                            placeholder="Select category"
                                            isSearch
                                            triggerClassName="h-[45px]!"
                                        />
                                    </div>

                                    {!isSequences && <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Quality
                                        </label>
                                        <FormSelect
                                            name={config.qualityKey}
                                            runForm={runForm}
                                            options={!isFabric ? data.yarn_stock_quality : data.fabric_stock_quality}
                                            placeholder={"Quality"}
                                            isSearch
                                            triggerClassName="h-[45px]!"
                                        />
                                    </div>}
                                    {!isSequences && <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Sub Quality
                                        </label>
                                        <FormSelect
                                            name={config.subQualityKey}
                                            runForm={runForm}
                                            options={!isFabric ? data.yarn_stock_sub_quality : data.fabric_stock_sub_quality}
                                            placeholder={"Sub Quality"}
                                            isSearch
                                            triggerClassName="h-[45px]!"
                                        />
                                    </div>}
                                    {isSequences &&
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium text-primary-foreground block">
                                                CD
                                            </label>
                                            <Input
                                                type={"number"}
                                                name={'sequence_cd'}
                                                placeholder="CD"
                                                runForm={runForm}
                                                className="h-[45px]"
                                            />
                                        </div>
                                    }
                                    {isSequences &&
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium text-primary-foreground block">
                                                Quality
                                            </label>
                                            <FormSelect
                                                name={config.qualityKey}
                                                runForm={runForm}
                                                options={data.sequence_stock_quality}
                                                placeholder="Select quality"
                                                isSearch
                                                triggerClassName="h-[45px]!"
                                            />
                                        </div>
                                    }
                                    {!isSequences && <div className="space-y-1.5">
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
                                    </div>}
                                    {!isSequences && !isFabric &&
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium text-primary-foreground block">
                                                Num Cons
                                            </label>
                                            <Input
                                                type={"number"}
                                                name={config.meterKey}
                                                placeholder={"Num cons"}
                                                runForm={runForm}
                                                className="h-[45px]"
                                            />
                                        </div>
                                    }
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
                                        <FormSelect
                                            name={config.vendorKey}
                                            runForm={runForm}
                                            options={vendorOptions}
                                            placeholder="Select vendor"
                                            isSearch
                                            triggerClassName="h-[45px]!"
                                        />
                                    </div>

                                    {/* {!isSequences && <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            {!isFabric ? "Sub Quality" : "Meter"}
                                        </label>
                                        <Input
                                            type={!isFabric ? "text" : "number"}
                                            name={!isFabric ? config.qualityKey : config.meterKey}
                                            placeholder={!isFabric ? "Sub quality" : "Meter"}
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>} */}
                                    {isFabric && <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-primary-foreground block">
                                            Meter
                                        </label>
                                        <Input
                                            type="number"
                                            name={config.meterKey}
                                            placeholder="Meter"
                                            runForm={runForm}
                                            className="h-[45px]"
                                        />
                                    </div>}



                                    <div className="space-y-1.5">
                                        <label className="text-[16px] font-medium text-primary-foreground block">
                                            Color
                                        </label>
                                        <FormColorPicker
                                            name={config.colorKey}
                                            runForm={runForm}
                                            placeholder="Pick a color"
                                            isFloating={false}
                                        // className="h-[45px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {!isPeople && !isVendor && (
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
                            )}
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
