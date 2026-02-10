'use client'
import ProductionHome from '@/components/production/ProductionHome'
import ProductionHomeCard from '@/components/production/ProductionHome'

function page() {
    return (
        <div className="space-y-8">
            <div className="flex flex-row sm:items-center justify-between gap-4">
                <h1 className="text-[26px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground flex items-center gap-1 sm:gap-3">
                    <span className='text-nowrap sm:text-normal '>Production</span>
                </h1>
            </div>

            <ProductionHome />

        </div>
    )
}

export default page
