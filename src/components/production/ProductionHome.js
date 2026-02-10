import React from 'react'
import { Plus } from 'lucide-react'
import clsx from 'clsx'
import ProductionItemCard from './ProductionItemCard'

function ProductionHome({
    title = "Sample",
    progress = 50,
    items = [{}, {}, {}, {}, {}, {}] // Dummy items for demonstration
}) {
    return (
        <div className="border border-[#dcccbd] rounded-[10px] bg-white overflow-hidden">
            {/* Header */}
            <div className={clsx(
                "px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd]",
                "h-[50px] flex items-center"
            )}>
                <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
                    {title}
                </h3>
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
                    {items.map((item, idx) => (
                        <ProductionItemCard key={idx} {...item} />
                    ))}
                    <button className="flex items-center justify-center w-[124px] h-[95px] bg-[#F8F5F2] hover:bg-[#F0EDE9] rounded-[10px] transition-colors border border-transparent">
                        <Plus className="w-10 h-10 text-[#dcccbd]" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductionHome