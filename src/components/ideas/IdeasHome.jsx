// "use client"

// import React, { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { usePost } from '@/hooks/useApi'
// import { IDEAS } from '@/hooks/api-list'
// import { PlusIcon } from 'lucide-react'

// const IdeaCard = ({ idea, index, onSave, onCancel, isNew = false }) => {
//     const [content, setContent] = useState(idea?.note || "")
//     const [isEditing, setIsEditing] = useState(isNew || false)

//     const handleSave = () => {
//         if (!content.trim()) return
//         onSave({ ...idea, idea: content }, isNew)
//         if (!isNew) setIsEditing(false)
//     }

//     const handleCancel = () => {
//         if (isNew) {
//             onCancel()
//         } else {
//             setContent(idea?.idea || "")
//             setIsEditing(false)
//         }
//     }

//     return (
//         <div className="bg-[#FAF8F6] border border-[#DCCCBD]/60 rounded-[15px] overflow-hidden shadow-sm">
//             {/* Header */}
//             <div className="px-6 py-3 flex items-center justify-between border-b border-[#DCCCBD]/40 bg-[#F5F1EE]">
//                 <span className="text-[16px] font-medium text-primary-foreground font-sans">
//                     Note: {idea?.id}
//                 </span>
//                 {/* <button className="flex items-center gap-1.5 text-[#D47A7A] hover:opacity-80 transition-opacity text-[13px] font-medium bg-[#F8F2F2] px-3 py-1 rounded-md">
//                     <Trash2 className="w-3.5 h-3.5" />
//                     Delete
//                 </button> */}
//             </div>

//             {/* Content */}
//             <div className="p-6 space-y-4 bg-white">
//                 <Textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     onFocus={() => !isEditing && setIsEditing(true)}
//                     placeholder="Add Note"
//                     className="min-h-[120px] bg-transparent border-none focus-visible:ring-0 text-[16px] p-0  resize-none font-sans"
//                 />

//                 {/* Footer Actions */}
//                 {isEditing && (
//                     <div className="flex justify-end gap-3 pt-2">
//                         <Button
//                             variant="outline"
//                             onClick={handleCancel}
//                             className="h-9 px-6 border-[#DCCCBD] text-primary-foreground hover:bg-[#F5F1EE] rounded-[8px] text-[14px] font-medium"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleSave}
//                             className="h-9 px-8 bg-[#DCCCBD] hover:bg-[#C4B4A3] text-primary-foreground rounded-[8px] text-[14px] font-medium shadow-none border-none"
//                         >
//                             Save
//                         </Button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default function IdeasHome({ initialData = [] }) {
//     const [ideas, setIdeas] = useState(initialData)
//     const [isAddingNew, setIsAddingNew] = useState(false)

//     const { mutate: createIdea } = usePost(IDEAS.create, {
//         onSuccess: (res) => {
//             if (res.success && res.data) {
//                 setIdeas(prev => [res.data, ...prev])
//                 setIsAddingNew(false)
//             }
//         }
//     })

//     const { mutate: updateIdea } = usePost(IDEAS.update, {
//         onSuccess: (res) => {
//             if (res.success && res.data) {
//                 setIdeas(prev => prev.map(item => item.id === res.data.id ? res.data : item))
//             }
//         }
//     })

//     const handleSaveIdea = (ideaData, isNew) => {
//         if (isNew) {
//             createIdea({ idea: ideaData.idea })
//         } else {
//             updateIdea({ id: String(ideaData.id), idea: ideaData.idea })
//         }
//     }

//     return (
//         <>
//             {/* Header */}
//             <div className="flex sm:items-center justify-between gap-4">
//                 <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
//                     Ideas
//                 </h1>
//                 <Button
//                     onClick={() => setIsAddingNew(true)}
//                     className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-9.5 px-4 rounded-lg gap-2 font-semibold w-auto"
//                 >
//                     <PlusIcon className="w-4 h-4" />
//                     <span className="hidden sm:inline">Add Idea</span>
//                     <span className="sm:hidden">Add Idea</span>
//                 </Button>
//             </div>
//             <div className="space-y-6">
//                 <div className="grid grid-cols-1 gap-6">
//                     {isAddingNew && (
//                         <IdeaCard
//                             idea={{ idea: "" }}
//                             index={ideas.length}
//                             onSave={handleSaveIdea}
//                             onCancel={() => setIsAddingNew(false)}
//                             isNew={true}
//                         />
//                     )}

//                     {ideas.map((idea, idx) => (
//                         <IdeaCard
//                             key={idea.id || idx}
//                             idea={idea}
//                             index={isAddingNew ? idx + 1 : idx}
//                             onSave={handleSaveIdea}
//                         />
//                     ))}

//                     {!isAddingNew && ideas.length === 0 && (
//                         <div className="text-center py-20 bg-[#FAF8F6] rounded-[20px] border border-dashed border-[#DCCCBD]">
//                             <p className="text-[#A67F6F] font-sans">No ideas yet. Click "+ Add Note" to start.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//         </>
//     )
// }
"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { usePost } from '@/hooks/useApi'
import { IDEAS } from '@/hooks/api-list'
import { PlusIcon } from 'lucide-react'

const IdeaCard = ({ idea, index, onSave, onCancel, isNew = false }) => {
    const [content, setContent] = useState(idea?.note || "")
    const [isEditing, setIsEditing] = useState(isNew || false)

    const handleSave = () => {
        if (!content.trim()) return

        onSave({ ...idea, idea: content }, isNew)

        if (!isNew) {
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        if (isNew) {
            onCancel()
        } else {
            setContent(idea?.idea || "")
            setIsEditing(false)
        }
    }

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-[#E8DED6] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

            {/* Top Gradient */}
            <div className="h-2 w-full bg-gradient-to-r from-[#DCCCBD] via-[#E9DDD3] to-[#CDB8A5]" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <div>
                    <p className="text-xs uppercase tracking-[3px] text-[#B69E8B] font-semibold">
                        Note
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-primary-foreground">
                        #{idea?.id || index + 1}
                    </h3>
                </div>

                <div className="rounded-full bg-[#F6F1EC] px-3 py-1 text-xs font-medium text-[#A38470]">
                    Idea
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => !isEditing && setIsEditing(true)}
                    placeholder="Write your idea here..."
                    className="
                        min-h-[180px]
                        resize-none
                        border-0
                        bg-transparent
                        p-0
                        text-[15px]
                        leading-7
                        text-primary-foreground
                        shadow-none
                        focus-visible:ring-0
                        placeholder:text-[#B8A89B]
                    "
                />

                {/* Footer */}
                {isEditing && (
                    <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#F1E7DE] pt-5">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="
                                h-10
                                rounded-xl
                                border-[#E2D3C7]
                                px-6
                                text-sm
                                font-medium
                                text-primary-foreground
                                hover:bg-[#F8F4F1]
                            "
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSave}
                            className="
                                h-10
                                rounded-xl
                                bg-[#DCCCBD]
                                px-7
                                text-sm
                                font-semibold
                                text-primary-foreground
                                shadow-none
                                transition-all
                                hover:bg-[#CDB8A5]
                            "
                        >
                            Save
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function IdeasHome({ initialData = [] }) {
    const [ideas, setIdeas] = useState(initialData)
    const [isAddingNew, setIsAddingNew] = useState(false)

    const { mutate: createIdea } = usePost(IDEAS.create, {
        onSuccess: (res) => {
            if (res.success && res.data) {
                setIdeas(prev => [...prev, res.data])
                setIsAddingNew(false)
            }
        }
    })

    const { mutate: updateIdea } = usePost(IDEAS.update, {
        onSuccess: (res) => {
            if (res.success && res.data) {
                setIdeas(prev =>
                    prev.map(item =>
                        item.id === res.data.id ? res.data : item
                    )
                )
            }
        }
    })

    const handleSaveIdea = (ideaData, isNew) => {
        if (isNew) {
            createIdea({
                idea: ideaData.idea
            })
        } else {
            updateIdea({
                id: String(ideaData.id),
                idea: ideaData.idea
            })
        }
    }

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex sm:items-center justify-between gap-4">
                <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
                    Ideas
                </h1>
                <Button
                    onClick={() => setIsAddingNew(true)}
                    className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-9.5 px-4 rounded-lg gap-2 font-semibold w-auto"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Idea</span>
                    <span className="sm:hidden">Add Idea</span>
                </Button>
            </div>

            {/* Empty State */}
            {!isAddingNew && ideas.length === 0 && (
                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[#DCCCBD] bg-[#FAF8F6] text-center">

                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#EFE4DA]">
                        <PlusIcon className="h-8 w-8 text-[#A98B75]" />
                    </div>

                    <h3 className="text-xl font-semibold">
                        No Ideas Yet
                    </h3>

                    <p className="mt-2 max-w-[320px] text-sm leading-6 text-[#9E8B7A]">
                        Start capturing your thoughts, inspirations, and plans by creating your first idea note.
                    </p>

                    <Button
                        onClick={() => setIsAddingNew(true)}
                        className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-9.5 px-4 rounded-lg gap-2 font-semibold w-auto mt-6"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Idea</span>
                        <span className="sm:hidden">Add Idea</span>
                    </Button>
                </div>
            )}

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                {isAddingNew && (
                    <IdeaCard
                        idea={{ idea: "" }}
                        index={ideas.length}
                        onSave={handleSaveIdea}
                        onCancel={() => setIsAddingNew(false)}
                        isNew={true}
                    />
                )}

                {ideas.map((idea, idx) => (
                    <IdeaCard
                        key={idea.id || idx}
                        idea={idea}
                        index={isAddingNew ? idx + 1 : idx}
                        onSave={handleSaveIdea}
                    />
                ))}
            </div>
        </div>
    )
}