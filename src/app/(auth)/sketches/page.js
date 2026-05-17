export const dynamic = 'force-dynamic'
import { API_SKETCHES_DESIGNS } from '@/hooks/api-list'
import { post } from '@/lib/server-api'
import SketchesHome from '@/components/sketches/SketchesHome'

async function page() {
    let sketchesData = []
    let paginationData = {}
    try {
        const response = await post(API_SKETCHES_DESIGNS.get, {})
        sketchesData = response?.data?.data || []
        paginationData = response?.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }
    } catch (error) {
        console.error("Error fetching sketches:", error)
    }
    return (
        <div className="space-y-8">
            <SketchesHome initialData={sketchesData} initialPagination={paginationData} />
        </div>
    )
}

export default page
