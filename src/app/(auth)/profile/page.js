"use client";

import * as React from "react";
import { User, LogOut, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Formik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { usePost } from "@/hooks/useApi";
import { User_DATA } from "@/hooks/api-list";
import { toast } from "sonner";

const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string(),
    contact: Yup.string(),
    id: Yup.string(),
});

export default function ProfilePage() {
    const [isEditing, setIsEditing] = React.useState(false);
    const [userData, setUserData] = React.useState({
        name: "",
        email: "",
        role: "",
        contact: "",
        id: "",
    });

    const { mutate: getProfile } = usePost(User_DATA.get, {
        onSuccess: (res) => {
            if (res.success && res.data?.[0]) {
                const d = res.data[0];
                setUserData({
                    name: d.name || "",
                    email: d.email || "",
                    role: d.role ? d.role.charAt(0).toUpperCase() + d.role.slice(1) : "",
                    contact: d.contact || "",
                    id: String(d.id || ""),
                });
            }
        },
    });

    const { mutate: updateProfile, isPending } = usePost(User_DATA.update, {
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                // getProfile({});
            }
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to update profile.");
        },
    });

    React.useEffect(() => {
        getProfile({});
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        window.location.href = "/login";
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex sm:items-center justify-between gap-4">
                <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
                    Profile
                </h1>
                <Button
                    onClick={handleLogout}
                    className="bg-[#C26B6E] hover:bg-[#C26B6E]/80 text-white border border-[#E5484D]/20 px-8 rounded-xl flex items-center gap-2 font-semibold shadow-none transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>

            {/* Profile Card */}
            <div className="bg-[#F8F5F2] rounded-[10px] border border-[#E8E2DA] overflow-hidden">

                {/* Avatar Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2DA]">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#DCCCBD] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <p className="text-[22px] font-bold text-[#1A1A1A] leading-tight">{userData.name}</p>
                            <p className="text-[18px] text-muted-foreground">{userData.email}</p>
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

                {/* Formik Form */}
                <Formik
                    initialValues={userData}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        updateProfile({
                            name: values.name,
                            contact: values.contact,
                        });
                    }}
                    enableReinitialize
                >
                    {(runForm) => (
                        <form onSubmit={runForm.handleSubmit} className="bg-[#FFFFFF]">
                            <div className="p-6 space-y-5">
                                {/* Row 1: Full Name | Id */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[16px] font-semibold text-[#1A1A1A]">Full Name</label>
                                        <FloatingInput
                                            name="name"
                                            placeholder="Your full name"
                                            isFloating={false}
                                            runForm={runForm}
                                            readOnly={!isEditing}
                                            hasEdit={isEditing}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[16px] font-semibold text-[#1A1A1A]">Id</label>
                                        <FloatingInput
                                            name="id"
                                            placeholder="Your id"
                                            isFloating={false}
                                            runForm={runForm}
                                            readOnly
                                            className="bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Role | Contact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[16px] font-semibold text-[#1A1A1A]">Role</label>
                                        <FloatingInput
                                            name="role"
                                            placeholder="Your role"
                                            isFloating={false}
                                            runForm={runForm}
                                            readOnly
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[16px] font-semibold text-[#1A1A1A]">Contact</label>
                                        <FloatingInput
                                            name="contact"
                                            placeholder="+91"
                                            isFloating={false}
                                            runForm={runForm}
                                            readOnly={!isEditing}
                                            hasEdit={isEditing}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Email (full width, read-only) */}
                                <div className="space-y-2">
                                    <label className="text-[16px] font-semibold text-[#1A1A1A]">Email</label>
                                    <FloatingInput
                                        name="email"
                                        type="email"
                                        placeholder="Your email"
                                        isFloating={false}
                                        runForm={runForm}
                                        readOnly
                                        className="bg-white"
                                    />
                                </div>

                                {/* Action Buttons (only when editing) */}
                                {isEditing && (
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => { setIsEditing(false); runForm.resetForm(); }}
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
                                            {isPending ? "Saving..." : "Save Change"}
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

