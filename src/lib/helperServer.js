import { post } from "./server-api"
import { redirect } from "next/navigation"

export const fetchStepData = async (url, id) => {
    try {
        const response = await post(url, { design_id: id })
        return response?.data || null
    } catch (error) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }
        console.error(`Error fetching ${url}:`, error)
        redirect('/dashboard')
    }
}