// // "use client"

// // import * as React from "react"
// // import Image from "next/image"
// // import { PlusIcon } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import LockBlur from "@/assets/LockBlur"
// // import clsx from "clsx"

// // export function WorkflowProgressCard({
// //     title = "1. Inspirations",
// //     progress = 50,
// //     currentCount = 5,
// //     totalCount = 20,
// //     images: initialImages = [],
// //     onSkip,
// //     onEditTarget,
// //     onCompleted,
// //     IsBlur = false,
// // }) {
// //     const [images, setImages] = React.useState(initialImages)
// //     const fileInputRef = React.useRef(null)

// //     const handleAddImage = (e) => {
// //         const file = e.target.files?.[0]
// //         if (!file) return

// //         // Optional: validate file type
// //         if (!file.type.startsWith("image/")) return

// //         const url = URL.createObjectURL(file)
// //         setImages((prev) => [...prev, url])

// //         // allow re-selecting same file
// //         e.target.value = ""
// //     }

// //     // cleanup blob URLs
// //     React.useEffect(() => {
// //         return () => {
// //             images.forEach((img) => {
// //                 if (img.startsWith("blob:")) {
// //                     URL.revokeObjectURL(img)
// //                 }
// //             })
// //         }
// //     }, [images])

// //     return (
// //         <div className="w-full border border-[#dcccbd] rounded-[15px] overflow-hidden bg-white shadow-sm">
// //             {/* Header */}
// //             <div className="px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd] flex items-center justify-between">
// //                 <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
// //                     {title}
// //                 </h3>
// //                 <div className="space-x-2">
// //                     {IsBlur && <Button
// //                         variant="outline"
// //                         size="xs"
// //                         onClick={onSkip}
// //                         className="h-7 px-4 py-0 border-[#dcccbd] bg-[#7DAA7B] text-[14px] font-medium text-white rounded-md hover:bg-[#5d8d5b]"
// //                     >
// //                         Start
// //                     </Button>}
// //                     <Button
// //                         variant="outline"
// //                         size="xs"
// //                         onClick={onSkip}
// //                         className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium text-primary-foreground rounded-md hover:bg-[#f1ede9]"
// //                     >
// //                         Skip
// //                     </Button>
// //                 </div>
// //             </div>

// //             {/* Content */}
// //             <div className={
// //                 clsx(IsBlur && "relative")
// //             }>
// //                 {IsBlur && <LockBlur className="absolute top-0 left-0 w-full h-full" />}
// //                 <div className={clsx("p-6 space-y-8", IsBlur && "blur-sm")}>
// //                     {/* Progress */}
// //                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
// //                         <div className="flex-1 space-y-2">
// //                             <div className="flex justify-between items-center font-semibold text-primary-foreground w-full lg:w-[80%]">
// //                                 <span>Workflow Progress</span>
// //                                 <span>{progress}%</span>
// //                             </div>
// //                             <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
// //                                 <div
// //                                     className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
// //                                     style={{
// //                                         width: `${progress}%`,
// //                                         background:
// //                                             "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
// //                                     }}
// //                                 />
// //                             </div>
// //                         </div>

// //                         <div className="flex items-center gap-4 min-w-fit">
// //                             <span className="font-sans font-medium">
// //                                 <span className="text-[#8DB88D]">
// //                                     {String(currentCount).padStart(2, "0")}
// //                                 </span>
// //                                 <span className="text-primary-foreground">/{totalCount}</span>
// //                             </span>
// //                             <Button
// //                                 variant="outline"
// //                                 onClick={onEditTarget}
// //                                 className="h-[36px] bg-[#F8F5F2] border-none text-primary-foreground rounded-md hover:bg-[#F0EDE9] text-[14px] font-medium px-4"
// //                             >
// //                                 Edit Target
// //                             </Button>
// //                         </div>
// //                     </div>

// //                     {/* Gallery */}
// //                     <div className="flex flex-wrap items-center gap-4">
// //                         {images.map((img, idx) => (
// //                             <div
// //                                 key={idx}
// //                                 className="relative w-25 h-25 rounded-[10px] overflow-hidden border border-[#dcccbd]"
// //                             >
// //                                 <Image
// //                                     src={img}
// //                                     alt={`Work ${idx}`}
// //                                     fill
// //                                     className="object-cover"
// //                                     sizes="100px"
// //                                 />
// //                             </div>
// //                         ))}

// //                         {/* Add Image */}
// //                         {!IsBlur && <>
// //                             <button
// //                                 onClick={() => fileInputRef.current?.click()}
// //                                 className="w-[85px] h-[85px] rounded-[10px] border-none bg-[#F8F5F2] flex items-center justify-center hover:bg-[#F0EDE9] transition-colors"
// //                             >
// //                                 <PlusIcon className="w-8 h-8 text-[#dcccbd]" strokeWidth={1.5} />
// //                             </button>

// //                             <input
// //                                 ref={fileInputRef}
// //                                 type="file"
// //                                 accept="image/*"
// //                                 hidden
// //                                 onChange={handleAddImage}
// //                             />
// //                         </>}

// //                         {!IsBlur && <div className="flex justify-end self-end  flex-auto">
// //                             <Button
// //                                 onClick={onCompleted}
// //                                 className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-[36px] px-8 rounded-[8px] font-semibold text-[16px]"
// //                             // className="h-[36px] bg-[#F8F5F2] border-none text-primary-foreground rounded-md hover:bg-[#F0EDE9] text-[14px] font-medium px-4"

// //                             >
// //                                 Completed
// //                             </Button>
// //                         </div>}
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }

// "use client"

// import * as React from "react"
// import Image from "next/image"
// import { PlusIcon, ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import LockBlur from "@/assets/LockBlur"
// import clsx from "clsx"

// export function WorkflowProgressCard({
//     title = "1. Inspirations",
//     progress = 50,
//     currentCount = 5,
//     totalCount = 20,
//     images: initialImages = [],
//     onSkip,
//     onEditTarget,
//     onCompleted,
//     IsBlur = false,
// }) {
//     const [images, setImages] = React.useState(initialImages)
//     const [isExpanded, setIsExpanded] = React.useState(false)
//     const fileInputRef = React.useRef(null)

//     const handleAddImage = (e) => {
//         const file = e.target.files?.[0]
//         if (!file) return
//         if (!file.type.startsWith("image/")) return

//         const url = URL.createObjectURL(file)
//         setImages((prev) => [...prev, url])
//         e.target.value = ""
//     }

//     React.useEffect(() => {
//         return () => {
//             images.forEach((img) => {
//                 if (img.startsWith("blob:")) {
//                     URL.revokeObjectURL(img)
//                 }
//             })
//         }
//     }, [images])

//     return (
//         <div
//             className={clsx(
//                 "w-full border border-[#dcccbd] rounded-[15px] bg-white shadow-sm transition-all duration-300 overflow-hidden",
//                 !isExpanded ? "h-[73.74px]" : "h-auto"
//             )}
//         >
//             {/* Header */}
//             <div
//                 className="px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd] flex items-center justify-between cursor-pointer"
//                 onClick={() => setIsExpanded((prev) => !prev)}
//             >
//                 <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
//                     {title}
//                 </h3>

//                 <div className="flex items-center gap-3">
//                     <span className="text-sm font-medium text-primary-foreground">
//                         {progress}%
//                     </span>

//                     <ChevronDown
//                         className={clsx(
//                             "w-5 h-5 text-primary-foreground transition-transform duration-300",
//                             isExpanded && "rotate-180"
//                         )}
//                     />
//                 </div>
//             </div>

//             {/* Content */}
//             {isExpanded && (
//                 <div className={clsx(IsBlur && "relative")}>
//                     {IsBlur && (
//                         <LockBlur className="absolute top-0 left-0 w-full h-full z-10" />
//                     )}

//                     <div className={clsx("p-6 space-y-8", IsBlur && "blur-sm")}>
//                         {/* Progress */}
//                         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//                             <div className="flex-1 space-y-2">
//                                 <div className="flex justify-between items-center font-semibold text-primary-foreground w-full lg:w-[80%]">
//                                     <span>Workflow Progress</span>
//                                     <span>{progress}%</span>
//                                 </div>

//                                 <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
//                                     <div
//                                         className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
//                                         style={{
//                                             width: `${progress}%`,
//                                             background:
//                                                 "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
//                                         }}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-4 min-w-fit">
//                                 <span className="font-sans font-medium">
//                                     <span className="text-[#8DB88D]">
//                                         {String(currentCount).padStart(2, "0")}
//                                     </span>
//                                     <span className="text-primary-foreground">
//                                         /{totalCount}
//                                     </span>
//                                 </span>

//                                 <Button
//                                     variant="outline"
//                                     onClick={onEditTarget}
//                                     className="h-[36px] bg-[#F8F5F2] border-none text-primary-foreground rounded-md hover:bg-[#F0EDE9] text-[14px] font-medium px-4"
//                                 >
//                                     Edit Target
//                                 </Button>
//                             </div>
//                         </div>

//                         {/* Gallery */}
//                         <div className="flex flex-wrap items-center gap-4">
//                             {images.map((img, idx) => (
//                                 <div
//                                     key={idx}
//                                     className="relative w-[85px] h-[85px] rounded-[10px] overflow-hidden border border-[#dcccbd]"
//                                 >
//                                     <Image
//                                         src={img}
//                                         alt={`Work ${idx}`}
//                                         fill
//                                         className="object-cover"
//                                         sizes="100px"
//                                     />
//                                 </div>
//                             ))}

//                             {!IsBlur && (
//                                 <>
//                                     <button
//                                         onClick={() =>
//                                             fileInputRef.current?.click()
//                                         }
//                                         className="w-[85px] h-[85px] rounded-[10px] border-none bg-[#F8F5F2] flex items-center justify-center hover:bg-[#F0EDE9] transition-colors"
//                                     >
//                                         <PlusIcon
//                                             className="w-8 h-8 text-[#dcccbd]"
//                                             strokeWidth={1.5}
//                                         />
//                                     </button>

//                                     <input
//                                         ref={fileInputRef}
//                                         type="file"
//                                         accept="image/*"
//                                         hidden
//                                         onChange={handleAddImage}
//                                     />
//                                 </>
//                             )}

//                             {!IsBlur && (
//                                 <div className="flex justify-end self-end flex-auto">
//                                     <Button
//                                         onClick={onCompleted}
//                                         className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-[36px] px-8 rounded-[8px] font-semibold text-[16px]"
//                                     >
//                                         Completed
//                                     </Button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }
"use client"

import * as React from "react"
import Image from "next/image"
import { PlusIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import LockBlur from "@/assets/LockBlur"
import clsx from "clsx"
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion"
import { EditTargetModal } from "./edit-target-modal"
import { ImageDetailModal } from "./image-detail-modal"

export function WorkflowProgressCard({
    title = "1. Inspirations",
    progress = 50,
    currentCount = 5,
    totalCount = 20,
    images: initialImages = [],
    onSkip,
    onEditTarget,
    onCompleted,
    IsBlur = false,
}) {
    const [images, setImages] = React.useState(initialImages)
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [selectedImage, setSelectedImage] = React.useState(null)
    const fileInputRef = React.useRef(null)

    // Extract title name without number prefix (e.g., "1. Inspirations" -> "Inspirations")
    const titleName = title.split('.').pop()?.trim() || title
    const modalTitle = `${titleName} Target`

    const handleAddImage = (e) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith("image/")) return

        const url = URL.createObjectURL(file)
        setImages((prev) => [...prev, url])
        e.target.value = ""
    }

    React.useEffect(() => {
        return () => {
            images.forEach((img) => {
                if (img.startsWith("blob:")) URL.revokeObjectURL(img)
            })
        }
    }, [images])

    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
        >
            <AccordionItem
                value="workflow"
                className="border border-[#dcccbd] rounded-md bg-white shadow-sm overflow-hidden group"
            >
                {/* HEADER */}
                <div className="relative">
                    <AccordionTrigger
                        className={clsx(
                            "px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd] ",
                            "flex items-start justify-between",
                            "hover:no-underline",
                            "data-[state=closed]:h-[73.74px]"
                        )}
                    >

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full ">
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center font-semibold text-primary-foreground w-full">
                                    <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
                                        {title}
                                    </h3>
                                    <span className=" group-data-[state=open]:hidden">{progress}%</span>
                                </div>

                                <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden  group-data-[state=open]:hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${progress}%`,
                                            background:
                                                "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                    </AccordionTrigger>
                    <div className="absolute right-14 top-[50%] -translate-y-1/2 flex items-center space-x-2 z-10 group-data-[state=closed]:hidden">
                        {IsBlur && <Button
                            variant="outline"
                            size="xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSkip();
                            }}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#7DAA7B] text-[14px] font-medium text-white rounded-md hover:bg-[#5d8d5b]"
                        >
                            Start
                        </Button>}
                        <Button
                            variant="outline"
                            size="xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSkip();
                            }}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium text-primary-foreground rounded-md hover:bg-[#f1ede9]"
                        >
                            Skip
                        </Button>
                    </div>
                </div>

                {/* CONTENT */}
                <AccordionContent className="p-0">
                    <div className={clsx(IsBlur && "relative")}>
                        {IsBlur && (
                            <LockBlur className="absolute inset-0 z-50 w-full" />
                        )}

                        <div
                            className={clsx(
                                "p-6 space-y-8",
                                IsBlur && "blur-sm"
                            )}
                        >
                            {/* Progress */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center font-semibold text-primary-foreground w-full lg:w-[80%]">
                                        <span>Workflow Progress</span>
                                        <span>{progress}%</span>
                                    </div>

                                    <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${progress}%`,
                                                background:
                                                    "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 min-w-fit">
                                    <span className="font-medium">
                                        <span className="text-[#8DB88D]">
                                            {String(currentCount).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>
                                        <span className="text-primary-foreground">
                                            /{totalCount}
                                        </span>
                                    </span>

                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="h-[36px] bg-[#F8F5F2] border-none hover:bg-[#F0EDE9]"
                                    >
                                        Edit Target
                                    </Button>
                                </div>
                            </div>

                            {/* Gallery */}
                            <div className="flex flex-wrap items-center gap-4">
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className="relative w-[85px] h-[85px] rounded-[10px] overflow-hidden border border-[#dcccbd] cursor-pointer hover:opacity-90 transition-opacity"
                                    >
                                        <Image
                                            src={img}
                                            alt={`Work ${idx}`}
                                            fill
                                            className="object-cover"
                                            sizes="100px"
                                        />
                                    </div>
                                ))}

                                {!IsBlur && (
                                    <>
                                        <button
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="w-[85px] h-[85px] rounded-[10px] bg-[#F8F5F2] flex items-center justify-center hover:bg-[#F0EDE9]"
                                        >
                                            <PlusIcon className="w-8 h-8 text-[#dcccbd]" />
                                        </button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleAddImage}
                                        />
                                    </>
                                )}

                                {!IsBlur && (
                                    <div className="flex justify-end flex-auto">
                                        <Button
                                            onClick={onCompleted}
                                            className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 h-[36px] px-8 rounded-[8px]"
                                        >
                                            Completed
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <EditTargetModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                title={modalTitle}
                initialValue={totalCount.toString()}
                onSave={(val) => {
                    if (onEditTarget) onEditTarget(val)
                }}
            />

            <ImageDetailModal
                open={!!selectedImage}
                onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}
                imageSrc={selectedImage}
                onDelete={() => {
                    console.log("Delete image:", selectedImage)
                    setSelectedImage(null)
                }}
                onEdit={() => {
                    console.log("Edit image:", selectedImage)
                }}
            />
        </Accordion>
    )
}
