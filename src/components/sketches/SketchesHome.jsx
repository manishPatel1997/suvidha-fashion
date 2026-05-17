"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon, Search } from 'lucide-react'
import { usePost } from '@/hooks/useApi'
import { API_SKETCHES_DESIGNS } from '@/hooks/api-list'
import Image from 'next/image'
import { AddImageModal } from '@/components/add-image-modal'
import { CommonPagination } from '@/components/CommonPagination'
import { cn } from '@/lib/utils'
import { CommonModal } from '@/components/CommonModal'
import { FormSelect } from '@/components/ui/form-select'
import { FloatingTextarea } from '@/components/ui/floating-textarea'
import { Formik } from 'formik'

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-[#989898] text-white' // Pending - Greyish
        case 'running': return 'bg-[#DFAF20] text-white' // In Process - Yellow/Orange
        case 'completed': return 'bg-[#4CAF50] text-white' // Completed - Green
        case 'rejected': return 'bg-[#C44C4C] text-white' // Rejected - Red
        default: return 'bg-[#989898] text-white'
    }
}

const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'Pending'
        case 'running': return 'In Process'
        case 'completed': return 'Completed'
        default: return status || 'Pending'
    }
}

const StatusBadge = ({ status }) => {
    const colorClass = getStatusColor(status)
    const text = getStatusText(status)

    return (
        <div className={cn("absolute top-3 right-3 px-3 py-1 rounded-[6px] text-[12px] font-medium shadow-sm z-10", colorClass)}>
            {text}
        </div>
    )
}

const EditSketchModal = ({ open, onOpenChange, sketch, onUpdate, isLoading }) => {
    if (!sketch) return null

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} title={`Edit Sketch #${sketch.id}`} className="sm:max-w-[450px]">
            <Formik
                initialValues={{ status: sketch.status || 'pending', note: sketch.note || '' }}
                onSubmit={(values) => {
                    onUpdate({ ...values, id: sketch.id, type: sketch.type || 'sketche' })
                }}
            >
                {(runForm) => (
                    <form onSubmit={runForm.handleSubmit} className="flex flex-col gap-6 px-6 py-4">
                        <div className="space-y-1.5">
                            <label className="text-[15px] font-medium block">Status</label>
                            <FormSelect
                                name="status"
                                runForm={runForm}
                                options={[
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'running', label: 'In Process' },
                                    { value: 'completed', label: 'Completed' },
                                    { value: 'rejected', label: 'Rejected' },
                                ]}
                                placeholder="Select Status"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[15px] font-medium block">Note</label>
                            <FloatingTextarea
                                name="note"
                                label="Note"
                                runForm={runForm}
                                isFloating={false}
                                className="min-h-[120px]"
                            />
                        </div>
                        <div className="flex justify-center pt-4 pb-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground font-semibold px-12 h-10 rounded-[8px]"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </CommonModal>
    )
}

const SketchCard = ({ sketch, onClick }) => {
    const imageUrl = sketch.sketche_image ? `${process.env.NEXT_PUBLIC_API_URL}${sketch.sketche_image}` : "/no_img.webp"

    return (
        <div
            className="bg-[#FAF8F6] rounded-[15px] p-2.5 shadow-sm cursor-pointer hover:shadow-md transition-shadow group flex flex-col gap-3"
            onClick={() => onClick(sketch)}
        >
            <div className="relative w-full max-w-[200px] h-[170px] mx-auto rounded-[10px] overflow-hidden bg-[#e9e6e2]">
                {imageUrl !== "/no_img.webp" ? (
                    <Image
                        src={imageUrl}
                        alt="Sketch"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <Image
                        src={imageUrl}
                        alt="Sketch fallback"
                        fill
                        className="object-contain p-4 opacity-30 group-hover:scale-105 transition-transform duration-300"
                    />
                )}
                <StatusBadge status={sketch.status} />
            </div>
            <div className="px-1 pb-1 flex justify-between items-center text-[15px]">
                <span className="text-[#A67F6F] font-medium">Assign:</span>
                <span className="font-semibold text-primary-foreground">{sketch.assign_user_name || "Unassigned"}</span>
            </div>
        </div>
    )
}

export default function SketchesHome({ initialData = [], initialPagination = { page: 1, limit: 10, total: 0, totalPages: 1 } }) {
    const [sketches, setSketches] = useState(initialData)
    const [pagination, setPagination] = useState(initialPagination)
    const [currentPage, setCurrentPage] = useState(initialPagination.page || 1)
    const [limit, setLimit] = useState(initialPagination.limit || 10)
    const [searchQuery, setSearchQuery] = useState("")

    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editSketch, setEditSketch] = useState(null)

    const { mutate: getSketches } = usePost(API_SKETCHES_DESIGNS.get, {
        onSuccess: (res) => {
            if (res.success && res.data) {
                setSketches(res.data.data || [])
                setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 })
            }
        }
    })

    const { mutate: createSketch, isPending: isCreating } = usePost(API_SKETCHES_DESIGNS.create, {
        onSuccess: (res) => {
            if (res.success) {
                getSketches({ page: currentPage, limit, search: searchQuery })
                setIsAddingNew(false)
            }
        }
    })

    const { mutate: updateSketch, isPending: isUpdating } = usePost(API_SKETCHES_DESIGNS.update, {
        onSuccess: (res, variables) => {
            if (res.success) {
                setSketches(prev => prev.map(item =>
                    String(item.id) === String(variables.id)
                        ? { ...item, ...variables, ...(res.data?.id ? res.data : {}) }
                        : item
                ))
                setEditSketch(null)
            }
        }
    })

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getSketches({ page: currentPage, limit, search: searchQuery })
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [currentPage, limit, searchQuery])

    const handleCreate = (values) => {
        createSketch({
            user_id: values.user_id,
            note: values.note
        })
    }

    const handleUpdate = (values) => {
        updateSketch(values)
    }

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex sm:items-center justify-between gap-4">
                <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
                    Sketches
                </h1>
                <Button
                    onClick={() => setIsAddingNew(true)}
                    className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-10 px-5 rounded-[8px] gap-2 font-semibold w-auto"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Sketches</span>
                    <span className="sm:hidden">+ Add</span>
                </Button>
            </div>

            {/* Search Bar */}
            {/* <div className="w-full pt-2 pb-6">
                <Input
                    icon={<Search className="w-[18px] h-[18px]" />}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="bg-[#FAF8F6] border-[#dcccbd]/60 h-12 pl-11 rounded-[8px] text-[15px]"
                />
            </div> */}

            {/* Sketches Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sketches.map((sketch, index) => (
                    <SketchCard
                        key={`${sketch.id || 'sketch'}-${index}`}
                        sketch={sketch}
                        onClick={setEditSketch}
                    />
                ))}
            </div>

            {sketches.length === 0 && (
                <div className="text-center py-20 bg-[#FAF8F6] rounded-[20px] border border-dashed border-[#DCCCBD]">
                    <p className="text-[#A67F6F] font-sans">No sketches found.</p>
                </div>
            )}

            {/* Pagination */}
            {sketches.length > 0 && (
                <CommonPagination
                    pagination={pagination}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            )}

            {/* Add Modal */}
            <AddImageModal
                open={isAddingNew}
                onOpenChange={setIsAddingNew}
                onAdd={handleCreate}
                title="Sketches"
                isLoading={isCreating}
            />

            {/* Edit Modal */}
            <EditSketchModal
                open={!!editSketch}
                onOpenChange={(open) => !open && setEditSketch(null)}
                sketch={editSketch}
                onUpdate={handleUpdate}
                isLoading={isUpdating}
            />
        </div>
    )
}
