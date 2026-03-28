import { post } from '@/lib/server-api'
import { redirect } from 'next/navigation'
import { PreProductionClient } from './PreProductionClient'
import { API_LIST_AUTH } from '@/hooks/api-list'
import { fetchStepData } from '@/lib/helperServer'

// ✅ Common Fetch Function
// const fetchStepData = async (url, id) => {
//     try {
//         const response = await post(url, { design_id: id })
//         return response?.data || null
//     } catch (error) {
//         if (error.digest?.startsWith('NEXT_REDIRECT')) {
//             throw error
//         }
//         console.error(`Error fetching ${url}:`, error)
//         redirect('/dashboard')
//     }
// }

export default async function Page({ params }) {
    const { id } = await params

    const steps = [
        {
            key: 'inspirationData',
            url: '/api/v1/design/inspiration/get'
        },
        {
            key: 'sketchesData',
            url: API_LIST_AUTH.Sketches.get
        },
        {
            key: 'visualDesignersData',
            url: API_LIST_AUTH.VisualDesigners.get
        },
        {
            key: 'fabricData',
            url: API_LIST_AUTH.Fabric.get
        },
        {
            key: 'yarnData',
            url: API_LIST_AUTH.Yarn.get
        },
        {
            key: 'sequencesData',
            url: API_LIST_AUTH.Sequences.get
        },
        {
            key: "sampleData",
            url: API_LIST_AUTH.Sample.get
        }
    ]

    const result = {}

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i]

        const data = await fetchStepData(step.url, id)
        result[step.key] = data

        // Stop execution if status is not valid
        if (
            !data ||
            (data.status !== 'skipped' && data.status !== 'completed' && data.status !== "reopen")
        ) {
            break
        }
    }
    return (
        <PreProductionClient
            id={id}
            inspirationData={result.inspirationData}
            sketchesData={result.sketchesData}
            visualDesignersData={result.visualDesignersData}
            fabricData={result.fabricData}
            yarnData={result.yarnData}
            sequencesData={result.sequencesData}
            sampleData={result.sampleData}
        />
    )
}