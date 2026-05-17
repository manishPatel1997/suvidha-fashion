"use client";

import * as React from "react";
import { X, Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommonModal } from "@/components/CommonModal";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { usePost } from "@/hooks/useApi";
import { API_NOT_ADMIN } from "@/hooks/api-list";
import { toFormData } from "@/lib/helper";
import { toast } from "sonner";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { BASE_URL } from "@/lib/api";
import { Loader2 } from "lucide-react";

const FilePreviewIcon = ({ file, onClick }) => {
    const isString = typeof file === 'string';
    const [previewUrl, setPreviewUrl] = React.useState(isString ? `${BASE_URL}${file}` : null);

    React.useEffect(() => {
        if (isString) {
            setPreviewUrl(`${BASE_URL}${file}`);
        } else if (file.type?.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file, isString]);

    if (previewUrl) {
        return (
            <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onClick(file)}
            />
        );
    }

    return <FileText className="w-5 h-5 text-[#A67F6F]" />;
};

export function SubmitTaskModal({ open, onOpenChange, task, onSuccess }) {
    const [files, setFiles] = React.useState(null);
    const [note, setNote] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [photoIndex, setPhotoIndex] = React.useState(0);
    const [imageUrls, setImageUrls] = React.useState([]);
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        if (files) {
            if (typeof files === 'string') {
                setImageUrls([`${BASE_URL}${files}`]);
            } else if (files.type?.startsWith('image/')) {
                const url = URL.createObjectURL(files);
                setImageUrls([url]);
                return () => URL.revokeObjectURL(url);
            } else {
                setImageUrls([]);
            }
        } else {
            setImageUrls([]);
        }
    }, [files]);


    React.useEffect(() => {
        if (open) {
            let initialFiles = [];
            if (task?.history && task.history.length > 0) {
                const lastHistory = task.history[0];
                if (lastHistory.visual_designer_image) {
                    initialFiles = [lastHistory.visual_designer_image];
                }
            }
            // setFiles(initialFiles);
            setNote("");
            setIsOpen(false);
            setPhotoIndex(0);
        } else {
            setFiles(null);
            // setFiles([]);
            setNote("");
        }
    }, [task, open]);

    const { mutate: submitTask, isPending } = usePost(API_NOT_ADMIN.update, {
        isFormData: true,
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Task submitted successfully!");
                if (onSuccess) onSuccess();
                setFiles(null);
                setNote("");
            }
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to submit task.");
        }
    });

    const handleFileChange = (e) => {
        // const newFiles = Array.from(e.target.files || []);
        // setFiles(prev => [...prev, ...newFiles]);
        const file = e.target.files[0];
        setFiles(file);
    };

    const removeFile = (index) => {
        setFiles(null);
        // setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!files) {
            toast.error("Please attach at least one file.");
            return;
        }
        const payload = {
            id: task.id,
            note: note,
            image: files,// toFormData handles arrays of files
            category: task.category,
            type: task.type
        };
        submitTask(toFormData(payload));
    };

    return (
        <>
            <CommonModal
                open={open}
                onOpenChange={(val) => {
                    // Prevent Radix's outside click from closing the modal if the lightbox is open
                    if (isOpen && !val) return;
                    onOpenChange(val);
                }}
                className="sm:max-w-[800px]"
                title="Submit Task"
            >
                <div className="bg-white rounded-[20px] overflow-hidden overflow-y-auto max-h-[75vh]">
                    {/* Header */}
                    {/* <div className="flex items-center justify-between px-8 py-6 border-b border-[#E8E2DA]">
                    <h2 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
                        Submit Task
                    </h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-[#1A1A1A] hover:opacity-70 transition-opacity"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div> */}

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Upload Zone */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-semibold text-[#1A1A1A] block text-start mb-2">Upload File</label>

                            {!files ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-[#DCCCBD] rounded-[15px] p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#FAF9F6] transition-colors"
                                >
                                    <div className="w-12 h-12 bg-[#DCCCBD]/20 rounded-lg flex items-center justify-center mb-2">
                                        <Upload className="w-6 h-6 text-[#A67F6F]" />
                                    </div>
                                    <p className="text-[#A67F6F] text-[14px]">
                                        Drag & Drop File Here, Or <span className="font-bold underline">Browse Here</span>
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 bg-[#FAF9F6] rounded-[15px] border-2 border-[#DCCCBD] shadow-sm">
                                    <div className="w-12 h-12 bg-[#DCCCBD]/30 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                        <FilePreviewIcon
                                            file={files}
                                            onClick={(clickedFile) => {
                                                const isValidImage = typeof clickedFile === 'string' || clickedFile?.type?.startsWith('image/');
                                                if (isValidImage) {
                                                    setPhotoIndex(0);
                                                    setIsOpen(true);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {typeof files === 'string' ? (
                                            <p className="text-[14px] font-medium text-[#1A1A1A] truncate">Designer Image (Existing)</p>
                                        ) : (
                                            <>
                                                <p className="text-[14px] font-medium text-[#1A1A1A] truncate">{files.name}</p>
                                                <p className="text-[12px] text-[#A67F6F]">{(files.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeFile(null)}
                                        className="text-[#A67F6F] hover:text-[#E5484D] transition-colors p-2 rounded-md hover:bg-[#E5484D]/10"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-semibold text-[#1A1A1A]">Notes</label>
                            <FloatingTextarea
                                placeholder="Add any note or message..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                isFloating={false}
                                className="min-h-[100px] rounded-[10px] border-[#DCCCBD]"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end">
                        <div className="p-6 bg-white  gap-4 space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 border-[#dcccbd] text-primary-foreground hover:bg-[#fcf8f4]"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-[#dcccbd] hover:bg-[#cbb6a5] text-primary-foreground font-semibold"
                                disabled={isPending}
                                onClick={handleSubmit}
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit"}
                            </Button>
                        </div>
                    </div>
                </div>
            </CommonModal>
            {isOpen && imageUrls.length > 0 && (
                <div style={{ pointerEvents: 'auto' }}>
                    <style>{`
                        .ril-outer, .ril__outer, .ReactModalPortal {
                            pointer-events: auto !important;
                        }
                    `}</style>
                    <Lightbox
                        mainSrc={imageUrls[photoIndex]}
                        nextSrc={imageUrls.length > 1 ? imageUrls[(photoIndex + 1) % imageUrls.length] : undefined}
                        prevSrc={imageUrls.length > 1 ? imageUrls[(photoIndex + imageUrls.length - 1) % imageUrls.length] : undefined}
                        onCloseRequest={() => setIsOpen(false)}
                        onMovePrevRequest={() =>
                            setPhotoIndex((photoIndex + imageUrls.length - 1) % imageUrls.length)
                        }
                        onMoveNextRequest={() =>
                            setPhotoIndex((photoIndex + 1) % imageUrls.length)
                        }
                        reactModalStyle={{ overlay: { zIndex: 99999 } }}
                    />
                </div>
            )}
        </>
    );
}
