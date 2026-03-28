import ProductionHome from '@/components/production/ProductionHome'
import { API_PRODUCTION } from '@/hooks/api-list'
import { fetchStepData } from '@/lib/helperServer'

async function page({ params }) {
    const ProductionParams = await params
    const productionData = await fetchStepData(API_PRODUCTION.get, ProductionParams.id)
    return (
        <div className="space-y-8">
            <div className="flex flex-row sm:items-center justify-between gap-4">
                <h1 className="text-[26px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground flex items-center gap-1 sm:gap-3">
                    <span className='text-nowrap sm:text-normal '>Production</span>
                </h1>
            </div>

            <ProductionHome productionData={productionData} />

        </div>
    )
}

export default page
