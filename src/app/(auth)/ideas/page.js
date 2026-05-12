export const dynamic = 'force-dynamic'
import { IDEAS } from '@/hooks/api-list'
import { post } from '@/lib/server-api'
import IdeasHome from '@/components/ideas/IdeasHome'


async function page() {
    let ideasData = []
    try {
        const response = await post(IDEAS.get, {})
        ideasData = response?.data || []
    } catch (error) {
        console.error("Error fetching ideas:", error)
    }
    return (
        <div className="space-y-8">
            <IdeasHome initialData={ideasData} />
        </div>
    )
}

export default page
