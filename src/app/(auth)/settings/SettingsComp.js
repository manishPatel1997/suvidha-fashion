"use client";

import * as React from "react";
import { Settings, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import { TagInput } from "@/components/ui/tag-input";
import { usePost, useApiQueryClient } from "@/hooks/useApi";
import { API_LIST_AUTH } from "@/hooks/api-list";
import { toast } from "sonner";
import {
    DEFAULT_SETTINGS,
    SETTINGS_LABELS,
    normalizeSettings,
} from "./settings-config";

export default function SettingsComp({ initialSettings = DEFAULT_SETTINGS }) {
    const queryClient = useApiQueryClient();
    const [isEditing, setIsEditing] = React.useState(false);
    const [settingsData, setSettingsData] = React.useState(
        normalizeSettings(initialSettings)
    );

    React.useEffect(() => {
        setSettingsData(normalizeSettings(initialSettings));
    }, [initialSettings]);

    const { mutate: updateSettings, isPending } = usePost(
        API_LIST_AUTH.setting_update,
        {
            onSuccess: (res) => {
                if (res.success) {
                    toast.success("Settings updated successfully!");
                    setIsEditing(false);
                    if (res.data) {
                        setSettingsData(normalizeSettings(res.data));
                    }
                    // Refresh only settings cache (used in modals/sidebars), not the whole app router
                    queryClient.invalidateQueries({ queryKey: ["setting"] });
                    queryClient.invalidateQueries({ queryKey: ["settingsData"] });
                } else {
                    toast.error(res.message || "Failed to update settings.");
                }
            },
            onError: (err) => {
                toast.error(err?.message || "Failed to update settings.");
            },
        }
    );

    return (
        <div className="space-y-8">
            <div className="flex sm:items-center justify-between gap-4">
                <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
                    Settings
                </h1>
            </div>

            <div className="bg-[#F8F5F2] rounded-[10px] border border-[#E8E2DA] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2DA]">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#DCCCBD] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                            <Settings className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <p className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
                                System Configuration
                            </p>
                            <p className="text-[18px] text-muted-foreground">
                                Manage global dropdown categories and values
                            </p>
                        </div>
                    </div>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            className="h-9 px-5 border-[#DCCCBD] text-[#1A1A1A] bg-white hover:bg-[#FAF9F6] rounded-md flex items-center gap-2 text-[14px] font-medium"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                        </Button>
                    )}
                </div>

                <Formik
                    initialValues={settingsData}
                    onSubmit={(values) => updateSettings(values)}
                    enableReinitialize
                >
                    {(runForm) => (
                        <form
                            onSubmit={runForm.handleSubmit}
                            className="bg-[#FFFFFF]"
                        >
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-7">
                                    {Object.keys(DEFAULT_SETTINGS).map((key) => (
                                        <div key={key} className="space-y-2">
                                            <TagInput
                                                name={key}
                                                label={SETTINGS_LABELS[key]}
                                                runForm={runForm}
                                                readOnly={!isEditing}
                                                className="bg-white"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end gap-3 pt-6 border-t border-[#E8E2DA] mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditing(false);
                                                runForm.resetForm();
                                            }}
                                            className="h-10 px-6 border-[#DCCCBD] text-[#1A1A1A] bg-white hover:bg-[#FAF9F6] rounded-md text-[14px] font-medium"
                                            disabled={isPending}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="h-10 px-6 bg-[#DCCCBD] hover:bg-[#BFA995] text-[#1A1A1A] rounded-md text-[14px] font-semibold"
                                            disabled={isPending}
                                        >
                                            {isPending
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
