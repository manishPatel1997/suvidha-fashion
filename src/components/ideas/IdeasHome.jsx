"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'
import { usePost } from '@/hooks/useApi'
import { IDEAS } from '@/hooks/api-list'
import { PlusIcon } from 'lucide-react'

const IdeaCard = ({ idea, index, onSave, onCancel, isNew = false }) => {
    const [content, setContent] = useState(idea?.note || "")
    const [isEditing, setIsEditing] = useState(isNew || false)

    const handleSave = () => {
        if (!content.trim()) return
        onSave({ ...idea, idea: content }, isNew)
        if (!isNew) setIsEditing(false)
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
        <div className="bg-[#FAF8F6] border border-[#DCCCBD]/60 rounded-[15px] overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-6 py-3 flex items-center justify-between border-b border-[#DCCCBD]/40 bg-[#F5F1EE]">
                <span className="text-[16px] font-medium text-primary-foreground font-sans">
                    Note: {idea?.id}
                </span>
                {/* <button className="flex items-center gap-1.5 text-[#D47A7A] hover:opacity-80 transition-opacity text-[13px] font-medium bg-[#F8F2F2] px-3 py-1 rounded-md">
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                </button> */}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 bg-white">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => !isEditing && setIsEditing(true)}
                    placeholder="Add Note"
                    className="min-h-[120px] bg-transparent border-none focus-visible:ring-0 text-[16px] p-0  resize-none font-sans"
                />

                {/* Footer Actions */}
                {isEditing && (
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="h-9 px-6 border-[#DCCCBD] text-primary-foreground hover:bg-[#F5F1EE] rounded-[8px] text-[14px] font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="h-9 px-8 bg-[#DCCCBD] hover:bg-[#C4B4A3] text-primary-foreground rounded-[8px] text-[14px] font-medium shadow-none border-none"
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
                setIdeas(prev => [res.data, ...prev])
                setIsAddingNew(false)
            }
        }
    })

    const { mutate: updateIdea } = usePost(IDEAS.update, {
        onSuccess: (res) => {
            if (res.success && res.data) {
                setIdeas(prev => prev.map(item => item.id === res.data.id ? res.data : item))
            }
        }
    })

    const handleSaveIdea = (ideaData, isNew) => {
        if (isNew) {
            createIdea({ idea: ideaData.idea })
        } else {
            updateIdea({ id: String(ideaData.id), idea: ideaData.idea })
        }
    }

    return (
        <>
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
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
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

                    {!isAddingNew && ideas.length === 0 && (
                        <div className="text-center py-20 bg-[#FAF8F6] rounded-[20px] border border-dashed border-[#DCCCBD]">
                            <p className="text-[#A67F6F] font-sans">No ideas yet. Click "+ Add Note" to start.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
