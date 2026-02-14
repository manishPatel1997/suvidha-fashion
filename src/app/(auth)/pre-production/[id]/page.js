import { post } from '@/lib/server-api'
import { PreProductionClient } from './PreProductionClient'

const getInspirationData = async (id) => {
    try {
        const response = await post('/api/v1/design/inspiration/get', { design_id: id })
        return response?.data || null
    } catch (error) {
        // Next.js redirect throws a specific error that should not be caught here
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Error fetching inspirations server-side:', error)
        return null
    }
}

export default async function Page({ params }) {
    const { id } = await params
    const inspirationData = await getInspirationData(id)
    return (
        <PreProductionClient id={id} inspirationData={inspirationData} />
    )
}
