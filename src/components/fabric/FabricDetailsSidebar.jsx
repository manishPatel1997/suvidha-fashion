"use client";

import * as React from "react";
import Image from "next/image";
import { Formik } from "formik";
import * as Yup from "yup";
import { Loader2, Share2, Download, Pencil } from "lucide-react";

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
import { FormSelect } from "../ui/form-select";


export function FabricDetailsSidebar({
    type,
    open,
    onOpenChange,
    selectedData,
    onUpdateSuccess,
}) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [localPreview, setLocalPreview] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const [data, setData] = React.useState({
        fabric_stock_categories: [],
        fabric_stock_sub_categories: [],
    });

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

    // Reset editing state when opened/closed or data changes
    React.useEffect(() => {
        setIsEditing(false);
        setSelectedFile(null);
        setLocalPreview(null);
    }, [open, selectedData]);

    const previewImage = localPreview || (selectedData?.fabric_image
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${selectedData.fabric_image}`
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

    // Mutation for updating fabric details
    const { mutate: updateFabric, isPending } = usePost(API_LIST_AUTH.Fabric.update, {
        isFormData: true,
        onSuccess: (res) => {
            if (res?.success) {
                toast.success(res?.message || "Fabric details updated successfully!");
                if (onUpdateSuccess) onUpdateSuccess(res?.data || res);
                setIsEditing(false);
            }
        },
        onError: (error) => {
            toast.error(error?.message || "Something went wrong.");
        }
    });

    const validationSchema = Yup.object({
        fabric_name: Yup.string().required("Fabric name is required"),
        fabric_meter: Yup.number().typeError("Meter must be a number").required("Meter is required"),
        category: Yup.string().required("Category is required"),
        sub_category: Yup.string().required("Sub Category is required"),
        fabric_quality: Yup.string().required("Quality is required"),
        fabric_price: Yup.number().typeError("Price must be a number").required("Price is required"),
        fabric_vender: Yup.string().required("Vender is required"),
        fabric_color: Yup.string().required("Color is required"),
    });

    const handleSubmit = (values) => {
        const payload = {
            id: selectedData?.id?.toString(),
            fabric_name: values.fabric_name || "",
            fabric_quality: values.fabric_quality || "",
            fabric_price: values.fabric_price || "",
            fabric_vender: values.fabric_vender || "",
            fabric_meter: values.fabric_meter || "",
            fabric_color: values.fabric_color || "",
            note: values.note || "",
            sub_category: values.sub_category || "",
            category: values.category || "",
        };

        if (selectedFile) {
            payload.fabric_image = selectedFile;
        }
        updateFabric(toFormData(payload));
    };

    const handleDownload = () => {
        if (selectedData?.fabric_image) {
            downloadImage(`${process.env.NEXT_PUBLIC_BASE_URL}${selectedData.fabric_image}`, `Fabric-${selectedData.fabric_id}.jpg`);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent showCloseButton={false} side="right" className="w-[90vw] sm:w-[450px] p-0 border-[#dcccbd] bg-[#F8F5F2] sm:max-w-md overflow-hidden flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 py-4 shrink-0 sticky top-0 z-10 flex flex-row items-center justify-between">
                    <SheetTitle className="text-3xl sm:text-4xl text-primary-foreground font-serif font-bold">{type} Details</SheetTitle>
                    {!isEditing && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-4 bg-[#DCCCBD] border-[#dcccbd] text-primary-foreground hover:bg-[#dcccbd]/50 rounded-md  gap-2"
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
                            fabric_id: selectedData?.fabric_id ?? "",
                            fabric_name: selectedData?.fabric_name ?? "",
                            fabric_quality: selectedData?.fabric_quality ?? "",
                            fabric_price: selectedData?.fabric_price ? selectedData?.fabric_price.toString() : "" || "",
                            fabric_vender: selectedData?.fabric_vender ?? "",
                            fabric_meter: selectedData?.fabric_meter ? selectedData?.fabric_meter.toString() : "" || "",
                            fabric_color: selectedData?.fabric_color ?? "#D1D3C8",
                            note: selectedData?.note ?? "",
                            category: selectedData?.category ?? "",
                            sub_category: selectedData?.sub_category ?? "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {(runForm) => (
                            <form onSubmit={runForm.handleSubmit} className="flex flex-col h-full">
                                <div className="p-6 pt-0 space-y-8 flex-1">
                                    {/* Image Section */}
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#dcccbd]/50 shadow-sm group">
                                        <Image
                                            src={previewImage}
                                            alt={selectedData?.fabric_name || "Fabric Image"}
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
                                                    // Add share logic if needed
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
                                                Fabric Id
                                            </label>
                                            <FloatingInput
                                                name="fabric_id"
                                                runForm={runForm}
                                                readOnly
                                                className="bg-[#fcf8f4]/50"
                                                isFloating={false}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                Fabric Name
                                            </label>
                                            <FloatingInput
                                                name="fabric_name"
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
                                                options={data.fabric_stock_categories}
                                                placeholder="Select category"
                                                isSearch
                                                triggerClassName="h-[45px]! bg-[#fcf8f4]/50"
                                                readOnly={!isEditing}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium text-primary-foreground block">
                                                Sub Category
                                            </label>
                                            <FormSelect
                                                name={"sub_category"}
                                                runForm={runForm}
                                                options={data.fabric_stock_sub_categories}
                                                placeholder={"Select Sub Category"}
                                                isSearch
                                                triggerClassName="h-[45px]! bg-[#fcf8f4]/50"
                                                readOnly={!isEditing}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                Fabric Quality
                                            </label>
                                            <FloatingInput
                                                hasEdit
                                                name="fabric_quality"
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                className="bg-[#fcf8f4]/50"
                                                isFloating={false}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                Fabric Price
                                            </label>
                                            <FloatingInput
                                                hasEdit
                                                name="fabric_price"
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                className="bg-[#fcf8f4]/50"
                                                value={runForm.values.fabric_price ? `₹ ${runForm.values.fabric_price} Meter` : ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                                    runForm.setFieldValue("fabric_price", val);
                                                }}
                                                isFloating={false}
                                            />
                                        </div>


                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                Fabric Vendor
                                            </label>
                                            <FloatingInput
                                                hasEdit
                                                name="fabric_vender"
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                className="bg-[#fcf8f4]/50"
                                                isFloating={false}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-medium block text-[#B0826A]">
                                                Fabric Meter
                                            </label>
                                            <FloatingInput
                                                name="fabric_meter"
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                hasEdit={isEditing}
                                                value={runForm.values.fabric_meter ? `${runForm.values.fabric_meter} Meter` : ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                                    runForm.setFieldValue("fabric_meter", val);
                                                }}
                                                isFloating={false}
                                            />
                                        </div>


                                        <div className="col-span-1 sm:col-span-2">
                                            <div className="space-y-1.5">
                                                <label className="text-[14px] font-medium block text-[#B0826A]">
                                                    Fabric Color
                                                </label>
                                                <FormColorPicker
                                                    name="fabric_color"
                                                    runForm={runForm}
                                                    readOnly={!isEditing}
                                                    placeholder="Pick a color"
                                                    isFloating={false}
                                                />
                                            </div>
                                        </div>
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
