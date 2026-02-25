// import { post } from '@/lib/server-api'
// import { redirect } from 'next/navigation'
// import { PreProductionClient } from './PreProductionClient'
// import { API_LIST_AUTH } from '@/hooks/api-list'

// const getInspirationData = async (id) => {
//     try {
//         const response = await post('/api/v1/design/inspiration/get', { design_id: id })
//         return response?.data || null
//     } catch (error) {
//         // Next.js redirect throws a specific error that should not be caught here
//         if (error.digest?.startsWith('NEXT_REDIRECT')) {
//             throw error;
//         }
//         console.error('Error fetching inspirations server-side:', error)
//         redirect('/dashboard')
//     }
// }
// const getSketchesData = async (id) => {
//     try {
//         const response = await post(API_LIST_AUTH.Sketches.get, { design_id: id })
//         return response?.data || null
//     } catch (error) {
//         // Next.js redirect throws a specific error that should not be caught here
//         if (error.digest?.startsWith('NEXT_REDIRECT')) {
//             throw error;
//         }
//         console.error('Error fetching inspirations server-side:', error)
//         redirect('/dashboard')
//     }
// }
// const getVisualDesignersData = async (id) => {
//     try {
//         const response = await post(API_LIST_AUTH.VisualDesigners.get, { design_id: id })
//         return response?.data || null
//     } catch (error) {
//         // Next.js redirect throws a specific error that should not be caught here
//         if (error.digest?.startsWith('NEXT_REDIRECT')) {
//             throw error;
//         }
//         console.error('Error fetching inspirations server-side:', error)
//         redirect('/dashboard')
//     }
// }
// const getFabricData = async (id) => {
//     try {
//         const response = await post(API_LIST_AUTH.Fabric.get, { design_id: id })
//         return response?.data || null
//     } catch (error) {
//         // Next.js redirect throws a specific error that should not be caught here
//         if (error.digest?.startsWith('NEXT_REDIRECT')) {
//             throw error;
//         }
//         console.error('Error fetching inspirations server-side:', error)
//         redirect('/dashboard')
//     }
// }
// const getYarnData = async (id) => {
//     try {
//         const response = await post(API_LIST_AUTH.Yarn.get, { design_id: id })
//         return response?.data || null
//     } catch (error) {
//         // Next.js redirect throws a specific error that should not be caught here
//         if (error.digest?.startsWith('NEXT_REDIRECT')) {
//             throw error;
//         }
//         console.error('Error fetching inspirations server-side:', error)
//         redirect('/dashboard')
//     }
// }

// export default async function Page({ params }) {
//     const { id } = await params
//     const inspirationData = await getInspirationData(id)
//     let sketchesData = null
//     let visualDesignersData = null
//     let fabricData = null
//     let yarnData = null
//     console.log('inspirationData', inspirationData)
//     if (inspirationData?.status === "skipped" || inspirationData?.status === "completed") {
//         sketchesData = await getSketchesData(id)
//     }
//     if (sketchesData?.status === "skipped" || sketchesData?.status === "completed") {
//         visualDesignersData = await getVisualDesignersData(id)
//     }
//     if (visualDesignersData?.status === "skipped" || visualDesignersData?.status === "completed") {
//         fabricData = await getFabricData(id)
//     }
//     if (fabricData?.status === "skipped" || fabricData?.status === "completed") {
//         yarnData = await getYarnData(id)
//     }

//     return (
//         <PreProductionClient id={id} inspirationData={inspirationData} sketchesData={sketchesData} visualDesignersData={visualDesignersData} fabricData={fabricData} yarnData={yarnData} />
//     )
// }
import { post } from '@/lib/server-api'
import { redirect } from 'next/navigation'
import { PreProductionClient } from './PreProductionClient'
import { API_LIST_AUTH } from '@/hooks/api-list'

// ✅ Common Fetch Function
const fetchStepData = async (url, id) => {
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
            (data.status !== 'skipped' && data.status !== 'completed')
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
        />
    )
}