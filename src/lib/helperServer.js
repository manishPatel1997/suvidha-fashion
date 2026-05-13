import { post, get } from "./server-api"
import { redirect } from "next/navigation"

export const fetchStepData = async (url, id) => {
    try {
        const response = await post(url, { design_id: id })
        return response?.data || null
    } catch (error) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }

        // Handle "Record not found" errors gracefully by returning null instead of redirecting
        if (error.status === 404 || error.data?.message?.toLowerCase().includes("not found")) {
            return null
        }

        console.error(`Error fetching ${url}:`, error)
        redirect('/dashboard')
    }
}

export const fetchGetData = async (url, id, options = { cache: 'no-store' }) => {
    try {
        const response = await get(`${url}/${id}`, {}, options)
        return response?.data || null
    } catch (error) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }

        // Handle "Record not found" errors gracefully by returning null instead of redirecting
        if (error.status === 404 || error.data?.message?.toLowerCase().includes("not found")) {
            return null
        }

        console.error(`Error fetching ${url}:`, error)
        redirect('/dashboard')
    }
}