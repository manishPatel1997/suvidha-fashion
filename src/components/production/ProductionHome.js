"use client"
import React from 'react'
import { PlusIcon } from 'lucide-react'
import clsx from 'clsx'
import ProductionItemCard from './ProductionItemCard'
import { AddProductionModal } from '../add-production-modal'
import { ProductionViewModal } from './ProductionViewModal'
import { StateUpdate, statusColors } from '@/lib/helper'

import { Button } from '../ui/button'
import { usePost } from '@/hooks/useApi'
import { API_PRODUCTION } from '@/hooks/api-list'

function ProductionHome({
    productionData = null,
    title = "Sample",
    progress = 50,
    id
}) {

    const [PreProductionData, setPreProductionData] = React.useState({})
    React.useEffect(() => {
        if (productionData) {
            setPreProductionData(productionData)
        }
    }, [productionData])

    const [openModal, setOpenModal] = React.useState({
        isAddModalOpen: false,
        isViewModalOpen: false,
        selectedItem: null
    })

    const { mutate: updateStatus, isPending: isUpdatingStatus } = usePost(API_PRODUCTION.status_update, {
        onSuccess: (res, variables) => {
            if (res.success) {
                setPreProductionData(prev => ({ ...prev, status: res.data?.status || variables?.status || prev.status }))
            }
        }
    })

    const handleStatusUpdate = (status) => {
        updateStatus({ design_id: id.toString(), status })
    }

    const handleAddProduction = (values) => {
        StateUpdate({ isAddModalOpen: false }, setOpenModal)
    }

    const handleViewItem = (item) => {
        StateUpdate({ isViewModalOpen: true, selectedItem: item }, setOpenModal)
    }

    const currentStatus = PreProductionData?.status || ""

    return (
        <div className="border border-[#dcccbd] rounded-md bg-white overflow-hidden">
            {/* Header */}
            <div className={clsx(
                "px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd]",
                "h-[50px] flex items-center justify-between"
            )}>
                <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
                    {title}
                </h3>
                {currentStatus === "completed" || currentStatus === "skipped" ? (
                    <div className="flex items-center gap-2">
                        <div className={clsx(
                            "px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wider",
                            statusColors[currentStatus] || "bg-muted-foreground text-white"
                        )}>
                            {currentStatus}
                        </div>
                        <Button
                            variant="outline"
                            size="xs"
                            disabled={isUpdatingStatus}
                            onClick={() => handleStatusUpdate("reopen")}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium text-primary-foreground rounded-md hover:bg-[#f1ede9]"
                        >
                            Reopen
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="xs"
                            disabled={isUpdatingStatus}
                            onClick={() => handleStatusUpdate("skipped")}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium  rounded-md hover:bg-[#f1ede9]"
                        >
                            Skip
                        </Button>
                        <Button
                            variant="outline"
                            size="xs"
                            disabled={isUpdatingStatus}
                            onClick={() => handleStatusUpdate("completed")}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#7DAA7B] text-[14px] font-medium text-white rounded-md hover:bg-[#5d8d5b]"
                        >
                            Complete
                        </Button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-6">
                {/* Progress Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center font-semibold text-primary-foreground w-full">
                            <span>Workflow Progress</span>
                            <span>{progress}%</span>
                        </div>

                        <div className="relative w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${progress}%`,
                                    background: "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-b border-[#dcccbd]"></div>

                {/* Grid of Items */}
                <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]'>
                    {PreProductionData?.samples?.map((item, idx) => (
                        <ProductionItemCard
                            key={item?.sample_id || idx}
                            {...item}
                            onClick={() => handleViewItem(item)}
                        />
                    ))}

                    {/* <button
                        onClick={() =>
                            StateUpdate({ isAddModalOpen: true }, setOpenModal)
                        }
                        className="rounded-[10px] bg-[#F8F5F2] flex items-center justify-center hover:bg-[#F0EDE9] w-[124px] h-[95px] transition-colors"
                    >
                        <PlusIcon className="text-[#dcccbd] w-10 h-10" />
                    </button> */}
                </div>
            </div>

            <AddProductionModal
                open={openModal.isAddModalOpen}
                onOpenChange={(isOpen) => StateUpdate({ isAddModalOpen: isOpen }, setOpenModal)}
                onAdd={handleAddProduction}
                title={title}
            />

            <ProductionViewModal
                open={openModal.isViewModalOpen}
                onOpenChange={(isOpen) => StateUpdate({ isViewModalOpen: isOpen, selectedItem: isOpen ? openModal.selectedItem : null }, setOpenModal)}
                selectedData={openModal.selectedItem}
                onUpdateSuccess={(updated) => {
                    setPreProductionData(prev => ({
                        ...prev,
                        samples: prev?.samples?.map((item) => {
                            if (String(item.id) === String(updated.id)) {
                                return updated
                            }
                            return item
                        })
                    }))
                    StateUpdate({ isViewModalOpen: false, selectedItem: null }, setOpenModal)
                }}
                onDeleteSuccess={(id) => {
                    setPreProductionData(prev => ({
                        ...prev,
                        samples: prev?.samples?.filter((item) => String(item.id) !== String(id))
                    }))
                }}
            />
        </div>
    )
}

export default ProductionHome