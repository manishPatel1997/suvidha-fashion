"use client";

import * as React from "react";
import Image from "next/image";
import { Formik } from "formik";
import * as Yup from "yup";
import { Loader2, Share2, Download, Pencil, Clock } from "lucide-react";
import { format } from "date-fns";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { FormColorPicker } from "@/components/ui/form-color-picker";

import { API_LIST_AUTH } from "@/hooks/api-list";
import { useGet, usePost } from "@/hooks/useApi";
import { downloadImage, StateUpdate, toFormData } from "@/lib/helper";
import { toast } from "sonner";
import { FormSelect } from "@/components/ui/form-select";

const STOCK_CONFIG = {
    Fabric: {
        title: "Fabric Details",
        apiEndpoint: API_LIST_AUTH.Fabric.update,
        idKey: "fabric_id",
        nameKey: "fabric_name",
        qualityKey: "fabric_quality",
        subQualityKey: "fabric_sub_quality",
        priceKey: "fabric_price",
        vendorKey: "fabric_vender",
        meterKey: "fabric_meter",
        colorKey: "fabric_color",
        imageKey: "fabric_image",
        categoryOptionsKey: "fabric_stock_categories",
        qualityOptionsKey: "fabric_stock_quality",
        subQualityOptionsKey: "fabric_stock_sub_quality",
        hasColor: true,
        hasNote: true,
    },
    Yarn: {
        title: "Yarn Details",
        apiEndpoint: API_LIST_AUTH.Yarn.update,
        idKey: "yarn_id",
        nameKey: "yarn_name",
        qualityKey: "yarn_quality",
        subQualityKey: "yarn_sub_quality",
        priceKey: "yarn_price",
        vendorKey: "yarn_vender",
        meterKey: "yarn_meter",
        colorKey: "yarn_color",
        imageKey: "yarn_image",
        categoryOptionsKey: "yarn_stock_categories",
        qualityOptionsKey: "yarn_stock_quality",
        subQualityOptionsKey: "yarn_stock_sub_quality",
        hasColor: true,
        hasNote: true,
    },
    Sequence: {
        title: "Sequence Details",
        apiEndpoint: API_LIST_AUTH.Sequences.update,
        idKey: "sequence_id",
        nameKey: "sequence_name",
        qualityKey: "sequence_quality",
        priceKey: "sequence_price",
        vendorKey: "sequence_vender",
        meterKey: "sequence_meter",
        colorKey: "sequence_color",
        imageKey: "sequence_image",
        categoryOptionsKey: "sequence_stock_categories",
        qualityOptionsKey: "sequence_stock_quality",
        hasColor: true,
        hasNote: true,
    },
};

export function StockDetailsSidebar({
    type, // 'fabric', 'yarn', or 'sequence'
    open,
    onOpenChange,
    selectedData,
    onUpdateSuccess,
}) {
    const config = STOCK_CONFIG[type] || STOCK_CONFIG.fabric;
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [localPreview, setLocalPreview] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const { data: settingData } = useGet("setting", API_LIST_AUTH.setting, {}, {
        enabled: open,
        staleTime: 0,
        gcTime: 0
    });

    const convertedOptions = React.useMemo(() => {
        if (!settingData?.success || !settingData?.data) return {};

        return Object.fromEntries(
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
    }, [settingData]);

    // Reset editing state when opened/closed or data changes
    React.useEffect(() => {
        setIsEditing(false);
        setSelectedFile(null);
        setLocalPreview(null);
    }, [open, selectedData]);

    const previewImage = localPreview || (selectedData?.[config.imageKey]
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${selectedData[config.imageKey]}`
        : "/design-thumb.png");

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLocalPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Mutation for updating details
    const { mutate: updateItem, isPending } = usePost(config.apiEndpoint, {
        isFormData: true,
        onSuccess: (res) => {
            if (res?.success) {
                toast.success(res?.message || `${config.title} updated successfully!`);
                if (onUpdateSuccess) onUpdateSuccess(res?.data || res);
                setIsEditing(false);
            }
        },
        onError: (error) => {
            toast.error(error?.data?.message || error?.message || "Something went wrong.");
        }
    });

    // const validationSchema = Yup.object({
    //     [config.nameKey]: Yup.string().required(`${config.nameKey.replace('_', ' ')} is required`),
    //     [config.meterKey]: Yup.number().typeError("Meter must be a number").required("Meter is required"),
    //     category: Yup.string().required("Category is required"),
    //     sub_category: Yup.string().required("Sub Category is required"),
    //     [config.qualityKey]: Yup.string().required("Quality is required"),
    //     [config.priceKey]: Yup.number().typeError("Price must be a number").required("Price is required"),
    //     [config.vendorKey]: Yup.string().required("Vendor is required"),
    //     ...(config.hasColor && { [config.colorKey]: Yup.string().required("Color is required") }),
    // });
    const validationSchema = Yup.object({
        [config.nameKey]: Yup.string().required(
            `${config.nameKey.replace("_", " ")} is required`
        ),

        ...(type !== "Yarn" && type !== "Sequence" && type !== "Fabric" && {
            [config.meterKey]: Yup.number()
                .typeError("Meter must be a number")
                .required("Meter is required"),

            [config.qualityKey]: Yup.string().required("Quality is required"),
        }),

        ...((type === "Yarn" || type === "Fabric") && {
            [config.qualityKey]: Yup.string().required("Quality is required"),
            [config.subQualityKey]: Yup.string().required("Sub Quality is required"),
        }),

        ...(type === "Sequence" && {
            [config.qualityKey]: Yup.string().required("Quality is required"),
        }),

        ...(type === "Fabric" && {
            [config.meterKey]: Yup.number()
                .typeError("Meter must be a number")
                .required("Meter is required"),
        }),

        ...(type === "Yarn" && {
            yarn_num_cons: Yup.string().trim().min(3, "Minimum 3 characters required").required("Yarn num cons is required"),
        }),

        category: Yup.string().required("Category is required"),

        ...(type === "Sequence" && {
            sequence_cd: Yup.string()
                .required("Sequence cd is required"),
        }),

        [config.priceKey]: Yup.number()
            .typeError("Price must be a number")
            .required("Price is required"),

        [config.vendorKey]: Yup.string().required("Vendor is required"),

        ...(config.hasColor && {
            [config.colorKey]: Yup.string().required("Color is required"),
        }),
    });

    // const handleSubmit = (values) => {
    //     const payload = {
    //         id: selectedData?.id?.toString(),
    //         [config.nameKey]: values[config.nameKey] || "",
    //         [config.qualityKey]: values[config.qualityKey] || "",
    //         [config.priceKey]: values[config.priceKey] || "",
    //         [config.vendorKey]: values[config.vendorKey] || "",
    //         [config.meterKey]: values[config.meterKey] || "",
    //         ...(config.hasColor && { [config.colorKey]: values[config.colorKey] || "" }),
    //         ...(config.hasNote && { note: values.note || "" }),
    //         sub_category: values.sub_category || "",
    //         category: values.category || "",
    //     };

    //     if (selectedFile) {
    //         payload[config.imageKey] = selectedFile;
    //     }
    //     updateItem(toFormData(payload));
    // };
    const handleSubmit = (values) => {
        const payload = {
            id: selectedData?.id?.toString(),
            [config.idKey]: values[config.idKey] || "",
            [config.nameKey]: values[config.nameKey] || "",
            [config.priceKey]: values[config.priceKey] || "",
            [config.vendorKey]: values[config.vendorKey] || "",
            category: values.category || "",

            ...(config.qualityKey && {
                [config.qualityKey]: values[config.qualityKey] || "",
            }),

            ...(config.subQualityKey && {
                [config.subQualityKey]: values[config.subQualityKey] || "",
            }),

            ...(config.meterKey && {
                [config.meterKey]: values[config.meterKey] || "",
            }),

            ...(config.hasColor && {
                [config.colorKey]: values[config.colorKey] || "",
            }),

            ...(config.hasNote && {
                note: values.note || "",
            }),

            ...(type === "Sequence" && {
                sequence_cd: values.sequence_cd || "",
            }),

            ...(type === "Yarn" && {
                yarn_num_cons: values.yarn_num_cons || "",
            }),
        };

        if (selectedFile) {
            payload[config.imageKey] = selectedFile;
        }

        updateItem(toFormData(payload));
    };

    const handleDownload = () => {
        if (selectedData?.[config.imageKey]) {
            downloadImage(
                `${process.env.NEXT_PUBLIC_BASE_URL}${selectedData[config.imageKey]}`,
                `${type}-${selectedData[config.idKey]}.jpg`
            );
        }
    };

    const formatLabel = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent showCloseButton={false} side="right" className="w-[90vw] sm:w-[450px] p-0 border-[#dcccbd] bg-[#F8F5F2] sm:max-w-md overflow-hidden flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 py-4 shrink-0 sticky top-0 z-10 flex flex-row items-center justify-between">
                    <SheetTitle className="text-3xl sm:text-4xl text-primary-foreground font-serif font-bold">{config.title}</SheetTitle>
                    {!isEditing && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-4 bg-[#DCCCBD] border-[#dcccbd] text-primary-foreground hover:bg-[#dcccbd]/50 rounded-md gap-2"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                        </Button>
                    )}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto w-full scrollbar-thin">
                    <Formik
                        initialValues={{
                            [config.idKey]: selectedData?.[config.idKey] ?? "",
                            [config.nameKey]: selectedData?.[config.nameKey] ?? "",
                            [config.qualityKey]: selectedData?.[config.qualityKey] ?? "",
                            ...(config.subQualityKey && {
                                [config.subQualityKey]: selectedData?.[config.subQualityKey] ?? "",
                            }),
                            [config.priceKey]: selectedData?.[config.priceKey] ? selectedData?.[config.priceKey].toString() : "",
                            [config.vendorKey]: selectedData?.[config.vendorKey] ?? "",
                            ...(config.meterKey && {
                                [config.meterKey]: selectedData?.[config.meterKey]
                                    ? selectedData?.[config.meterKey].toString()
                                    : "",
                            }),
                            ...(config.hasColor && { [config.colorKey]: selectedData?.[config.colorKey] ?? "#D1D3C8" }),
                            ...(config.hasNote && { note: selectedData?.note ?? "" }),
                            category: selectedData?.category ?? "",
                            ...(type === "Yarn" && {
                                yarn_num_cons: selectedData?.yarn_num_cons ?? "",
                            }),
                            ...(type === "Sequence" && {
                                sequence_cd: selectedData?.sequence_cd ?? "",
                            }),
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {(runForm) => (
                            <form onSubmit={runForm.handleSubmit} className="flex flex-col h-full">
                                {console.log('runForm.errors', runForm.errors)}
                                <div className="p-6 pt-0 space-y-8 flex-1">
                                    {/* Image Section */}
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#dcccbd]/50 shadow-sm group">
                                        <Image
                                            src={previewImage}
                                            alt={selectedData?.[config.nameKey] || `${type} Image`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 450px) 100vw, 400px"
                                        />

                                        {isEditing && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-20">
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

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end justify-end p-3 gap-2 z-10 pointer-events-none">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="secondary"
                                                className="w-9 h-9 flex items-center justify-center bg-[#A67F6F] hover:bg-[#8B6A5C] text-white rounded-full transition-colors shadow-lg pointer-events-auto"
                                                onClick={() => {
                                                    toast.info("Share functionality coming soon");
                                                }}
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="secondary"
                                                className="w-9 h-9 flex items-center justify-center bg-[#A67F6F] hover:bg-[#8B6A5C] text-white rounded-full transition-colors shadow-lg"
                                                onClick={handleDownload}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Form Fields Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                {formatLabel(config.idKey)}
                                            </label>
                                            <FloatingInput
                                                name={config.idKey}
                                                runForm={runForm}
                                                readOnly
                                                className="bg-[#fcf8f4]/50"
                                                isFloating={false}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                {formatLabel(config.nameKey)}
                                            </label>
                                            <FloatingInput
                                                name={config.nameKey}
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                hasEdit={isEditing}
                                                isFloating={false}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium text-primary-foreground block">
                                                Category
                                            </label>
                                            <FormSelect
                                                name="category"
                                                runForm={runForm}
                                                options={convertedOptions[config.categoryOptionsKey] || []}
                                                placeholder="Select category"
                                                isSearch
                                                triggerClassName="h-[45px]! bg-[#fcf8f4]/50"
                                                readOnly={!isEditing}
                                            />
                                        </div>

                                        {(type === "Yarn" || type === "Fabric") && (
                                            <>
                                                <div className="space-y-1.5">
                                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                                        Quality
                                                    </label>
                                                    <FormSelect
                                                        name={config.qualityKey}
                                                        runForm={runForm}
                                                        options={convertedOptions[config.qualityOptionsKey] || []}
                                                        placeholder="Select Quality"
                                                        isSearch
                                                        triggerClassName="h-[45px]! bg-[#fcf8f4]/50"
                                                        readOnly={!isEditing}
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[14px] font-medium text-primary-foreground block">
                                                        Sub Quality
                                                    </label>
                                                    <FormSelect
                                                        name={config.subQualityKey}
                                                        runForm={runForm}
                                                        options={convertedOptions[config.subQualityOptionsKey] || []}
                                                        placeholder="Select Sub Quality"
                                                        isSearch
                                                        triggerClassName="h-[45px]! bg-[#fcf8f4]/50"
                                                        readOnly={!isEditing}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {type === "Sequence" && <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium text-primary-foreground block">
                                                Quality
                                            </label>
                                            <FormSelect
                                                name={config.qualityKey}
                                                runForm={runForm}
                                                options={convertedOptions[config.qualityOptionsKey] || []}
                                                placeholder="Select Quality"
                                                isSearch
                                                triggerClassName="h-[45px]! bg-[#fcf8f4]/50"
                                                readOnly={!isEditing}
                                            />
                                        </div>}

                                        {type === "Yarn" && <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                Yarn num cons
                                            </label>
                                            <FloatingInput
                                                hasEdit
                                                name={"yarn_num_cons"}
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                className="bg-[#fcf8f4]/50"
                                                isFloating={false}
                                            />
                                        </div>}

                                        {type === "Sequence" && <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                Sequence cd
                                            </label>
                                            <FloatingInput
                                                hasEdit
                                                name={"sequence_cd"}
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                className="bg-[#fcf8f4]/50"
                                                isFloating={false}
                                            />
                                        </div>}

                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                {formatLabel(config.priceKey)}
                                            </label>
                                            <FloatingInput
                                                hasEdit
                                                name={config.priceKey}
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                className="bg-[#fcf8f4]/50"
                                                value={runForm.values[config.priceKey] ? `₹ ${runForm.values[config.priceKey]} Meter` : ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                                    runForm.setFieldValue(config.priceKey, val);
                                                }}
                                                isFloating={false}
                                            />
                                        </div>

                                        {type !== "Yarn" && <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                {formatLabel(config.vendorKey)}
                                            </label>
                                            <FloatingInput
                                                hasEdit
                                                name={config.vendorKey}
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                className="bg-[#fcf8f4]/50"
                                                isFloating={false}
                                            />
                                        </div>}

                                        {type !== "Yarn" && type !== "Sequence" && <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                {formatLabel(config.meterKey)}
                                            </label>
                                            <FloatingInput
                                                name={config.meterKey}
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                hasEdit={isEditing}
                                                value={runForm.values[config.meterKey] ? `${runForm.values[config.meterKey]} Meter` : ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                                    runForm.setFieldValue(config.meterKey, val);
                                                }}
                                                isFloating={false}
                                            />
                                        </div>}
                                        {type === "Yarn" &&
                                            <div className="col-span-1 sm:col-span-2">
                                                <div className="space-y-1.5">
                                                    <label className="text-[14px] font-medium block text-[#B0826A]">
                                                        {formatLabel(config.vendorKey)}
                                                    </label>
                                                    <FloatingInput
                                                        hasEdit
                                                        name={config.vendorKey}
                                                        runForm={runForm}
                                                        readOnly={!isEditing}
                                                        className="bg-[#fcf8f4]/50"
                                                        isFloating={false}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        {config.hasColor && (
                                            <div className="col-span-1 sm:col-span-2">
                                                <div className="space-y-1.5">
                                                    <label className="text-[14px] font-medium block text-[#B0826A]">
                                                        {formatLabel(config.colorKey)}
                                                    </label>
                                                    <FormColorPicker
                                                        name={config.colorKey}
                                                        runForm={runForm}
                                                        readOnly={!isEditing}
                                                        placeholder="Pick a color"
                                                        isFloating={false}
                                                    />
                                                </div>
                                            </div>
                                        )}


                                        {selectedData?.updated_at && (
                                            <div className="space-y-1.5 sm:col-span-2">
                                                <label className="text-[14px] font-medium flex items-center gap-1.5 text-[#B0826A]">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Last Edited
                                                </label>
                                                <div className="h-10 px-4 flex items-center bg-[#fcf8f4]/50 border border-[#dcccbd] rounded-md text-primary-foreground text-[14px]">
                                                    {format(new Date(selectedData.updated_at), "dd MMM yyyy, hh:mm a")}
                                                </div>
                                            </div>
                                        )}

                                        {config.hasNote && (
                                            <div className="col-span-1 sm:col-span-2">
                                                <div className="space-y-1.5">
                                                    <label className="text-[14px] font-medium block text-[#B0826A]">
                                                        Note
                                                    </label>
                                                    <FloatingTextarea
                                                        name="note"
                                                        runForm={runForm}
                                                        readOnly={!isEditing}
                                                        className="min-h-[120px] resize-none"
                                                        isFloating={false}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Save/Action Footer */}
                                {isEditing && (
                                    <div className="p-6 border-t border-[#dcccbd] bg-white mt-auto sticky bottom-0 z-10 flex gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 border-[#dcccbd] text-primary-foreground hover:bg-[#fcf8f4]"
                                            onClick={() => setIsEditing(false)}
                                            disabled={isPending}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-[#dcccbd] hover:bg-[#cbb6a5] text-primary-foreground font-semibold"
                                            disabled={isPending}
                                        >
                                            {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Changes"}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        )}
                    </Formik>
                </div>
            </SheetContent>
        </Sheet>
    );
}
