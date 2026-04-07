"use client";
import { CommonModal } from "@/components/CommonModal";
import { SubmitTaskModal } from "@/components/submit-task-modal";
import { Button } from "@/components/ui/button";
import { API_NOT_ADMIN } from "@/hooks/api-list";
import { usePost } from "@/hooks/useApi";
import { Check, Clock, CheckCircle2, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";

function TaskCard({ task, onSubmitClick, onEditClick, submitRequestPending }) {
    const isCompleted = task?.status === "completed" || task?.status === "review_request";
    const rawImagePath = task?.sketche_image;
    const imageUrl = rawImagePath ? `${process.env.NEXT_PUBLIC_API_URL}${rawImagePath}` : "/design-thumb.png";
    const isPdf = rawImagePath?.toLowerCase().endsWith('.pdf');
    return (
        <div className="bg-[#F8F5F2] rounded-[10px] p-6 flex flex-col md:flex-row gap-6 border border-[#E8E2DA] shadow-sm hover:shadow-md transition-shadow" >
            <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        {task?.status === "completed" ? (
                            <div className="flex items-center gap-1.5 text-[#4CAF50] font-semibold text-[18px]">
                                <CheckCircle2 className="w-4.5 h-4.5" />
                                <span>Completed</span>
                            </div>
                        ) : task?.status === "pending" ? (
                            <div className="flex items-center gap-1.5 text-[#B0826A] font-semibold text-[18px]">
                                <Clock className="w-4.5 h-4.5" />
                                <span>Pending</span>
                            </div>
                        ) : task?.status === "review_request" ? (
                            <div className="flex items-center gap-1.5 text-[#D4A017] font-semibold text-[18px]">
                                <span>Review Request</span>
                            </div>
                        )
                            :

                            (
                                <div className="flex items-center gap-1.5 text-[#D4A017] font-semibold text-[18px]">
                                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                    <span>In Progress</span>
                                </div>
                            )

                        }
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-y-2">
                        <span className="text-[#A67F6F] font-medium">Category:</span>
                        <span className="text-[#1A1A1A]">{task?.category || "General"}</span>

                        {task?.file_url && (
                            <>
                                <span className="text-[#A67F6F] font-medium">Download:</span>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL}${task.file_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#A67F6F] hover:underline flex items-center gap-1"
                                >
                                    {task?.file_name || "Download File"}
                                </a>
                            </>
                        )}

                        <span className="text-[#A67F6F] font-medium">Note:</span>
                        <p className="text-[#1A1A1A] leading-relaxed">
                            {task?.note || "No notes provided."}
                        </p>
                    </div>


                </div>
                {!isCompleted && (
                    <div className="flex items-center gap-3 mt-4">
                        <Button
                            disabled={submitRequestPending}
                            onClick={() => onSubmitClick(task)}
                            className="bg-[#DCCCBD] hover:bg-[#BFA995] text-black font-semibold px-6 py-2 rounded-md transition-colors h-9"
                        >
                            {submitRequestPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Task"}
                        </Button>
                        <Button
                            onClick={() => onEditClick(task)}
                            variant="outline"
                            className="border-[#DCCCBD] text-[#A67F6F] hover:bg-[#F8F5F2] hover:text-[#7A5C50] font-semibold px-6 py-2 rounded-md transition-colors h-9"
                        >
                            Update Task
                        </Button>
                    </div>
                )}
            </div>

            <div className="w-full md:w-[300px] h-[215px] relative rounded-[15px] overflow-hidden bg-[#E8E2DA] flex items-center justify-center">
                {isPdf ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-[#A67F6F]">
                        <div className="w-16 h-16 bg-[#DCCCBD]/40 rounded-xl flex items-center justify-center">
                            <FileText className="w-9 h-9 text-[#A67F6F]" />
                        </div>
                        <span className="text-[13px] font-medium tracking-wide uppercase opacity-70">PDF File</span>
                    </div>
                ) : (
                    <Image
                        src={imageUrl}
                        alt="Task Preview"
                        fill
                        className="object-cover rounded-sm group-hover:scale-105 transition-transform duration-300"
                    />
                )}
            </div>
        </div>
    );
}

function TasksPage() {
    const [tasks, setTasks] = React.useState([]);
    const [selectedTask, setSelectedTask] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isSucessModal, setIsSucessModal] = React.useState(false);

    const { mutate: getTasks, isPending } = usePost(API_NOT_ADMIN.get, {
        onSuccess: (res) => {
            if (res.success && res.data) {
                setTasks(res.data);
            }
        },
        onError: (err) => {
            console.error("Error fetching tasks:", err);
        }
    });
    const { mutate: submitRequest, isPending: submitRequestPending } = usePost(API_NOT_ADMIN.submit_request, {
        onSuccess: (res) => {
            if (res.success) {
                setIsSucessModal(true)
                getTasks({});
            }
            // if (res.success && res.data) {
            //     setTasks(res.data);
            // }
        },
        onError: (err) => {
            console.error("Error submit request:", err);
        }
    });

    React.useEffect(() => {
        getTasks({});
    }, [getTasks]);

    const handleSubmitClick = (task) => {

        const reviewData = {
            id: task?.id.toString(),
            category: task?.category
        }
        submitRequest(reviewData)
    };

    const HandleEditClick = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    }

    const handleTaskSubmitted = () => {
        getTasks({}); // Refresh list
        setIsModalOpen(false);
    };

    const pendingCount = tasks.filter(t => t.status !== "completed").length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex  sm:items-center justify-between gap-4">
                <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
                    Tasks
                </h1>
            </div>
            {/* Stats Card */}
            <div className="bg-[#F8F5F2] rounded-[10px] p-4 border border-[#E8E2DA]">
                <div className="flex items-center gap-2 text-[#A67F6F] mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold text-[16px]">Pending Tasks</span>
                </div>
                <div className="text-[35px] font-bold text-[#1A1A1A] ps-4">
                    {isPending ? "..." : pendingCount}
                </div>
            </div>
            {/* Task List */}
            <div className="space-y-6 pb-20 @container w-full">
                {isPending ? (
                    <div className="flex justify-center py-20 text-[#A67F6F]">Loading tasks...</div>
                ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onSubmitClick={handleSubmitClick}
                            onEditClick={HandleEditClick}
                            submitRequestPending={submitRequestPending}
                        />
                    ))
                ) : (
                    <div className="flex justify-center py-20 text-[#A67F6F] bg-[#FAF9F6] rounded-[20px] border border-dashed border-[#dcccbd]">
                        No tasks assigned to you.
                    </div>
                )}
            </div>
            {selectedTask && (
                <SubmitTaskModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    task={selectedTask}
                    onSuccess={handleTaskSubmitted}
                />
            )}

            {isSucessModal
                &&
                <>
                    <CommonModal
                        contentClassName="border-none shadow-none rounded-[24px] "
                        containerClassName="py-3! px-0!"
                        open={isSucessModal}
                        onOpenChange={setIsSucessModal}
                        className="sm:max-w-[600px]"
                    >
                        <div className="flex flex-col items-center justify-center pt-8 pb-10 px-6 text-center">
                            {/* Icon Container with double halo effect */}
                            <div className="relative w-[110px] h-[110px] flex items-center justify-center mb-6">
                                <div className="absolute inset-0 bg-[#34A853]/15 rounded-full"></div>
                                <div className="relative w-[75px] h-[75px] bg-[#34A853] rounded-full flex items-center justify-center shadow-md z-10">
                                    <Check className="w-10 h-10 text-white stroke-[3.5]" />
                                </div>
                            </div>

                            {/* Heading */}
                            <h2 className="text-[26px] sm:text-[30px] font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                                Submission Successfull!
                            </h2>

                            {/* Description */}
                            <p className="text-[16px] text-[#858585] md:text-[#8D8D8D] leading-[1.6] max-w-[340px]">
                                Your work has been uploaded successfully.<br />
                                You can now check its status in your task list.
                            </p>
                        </div>
                    </CommonModal>
                </>
            }
        </div>
    );
}

export default function Home() {
    return (
        <React.Suspense fallback={
            <div className="flex justify-center items-center py-10">
                <p className="text-lg text-primary-foreground font-serif">Loading Dashboard...</p>
            </div>
        }>
            <TasksPage />
        </React.Suspense>
    );
}
