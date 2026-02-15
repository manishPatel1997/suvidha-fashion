import { post } from '@/lib/server-api'
import { redirect } from 'next/navigation'
import { PreProductionClient } from './PreProductionClient'
import { API_LIST_AUTH } from '@/hooks/api-list'

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
        redirect('/dashboard')
    }
}
const getSketchesData = async (id) => {
    try {
        const response = await post(API_LIST_AUTH.Sketches.get, { design_id: id })
        return response?.data || null
    } catch (error) {
        // Next.js redirect throws a specific error that should not be caught here
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Error fetching inspirations server-side:', error)
        redirect('/dashboard')
    }
}
const getVisualDesignersData = async (id) => {
    try {
        const response = await post(API_LIST_AUTH.VisualDesigners.get, { design_id: id })
        return response?.data || null
    } catch (error) {
        // Next.js redirect throws a specific error that should not be caught here
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Error fetching inspirations server-side:', error)
        redirect('/dashboard')
    }
}

export default async function Page({ params }) {
    const { id } = await params
    const inspirationData = await getInspirationData(id)
    let sketchesData = null
    let visualDesignersData = null
    if (inspirationData?.status === "skipped" || inspirationData?.status === "completed") {
        sketchesData = await getSketchesData(id)
    }
    if (sketchesData?.status === "skipped" || sketchesData?.status === "completed") {
        visualDesignersData = await getVisualDesignersData(id)
    }

    return (
        <PreProductionClient id={id} inspirationData={inspirationData} sketchesData={sketchesData} visualDesignersData={visualDesignersData} />
    )
}
