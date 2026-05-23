export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { API_SKETCHES_DESIGNS } from '@/hooks/api-list'
import { post } from '@/lib/server-api'
import { rethrowNavigationError } from '@/lib/server-errors'
import SketchesHome from '@/components/sketches/SketchesHome'

async function page({ searchParams }) {
    const Pagination = await searchParams
    const page = Number(Pagination?.page) || 1
    const limit = Number(Pagination?.limit) || 10

    let sketchesData = []
    let paginationData = {}

    try {

        const response = await post(API_SKETCHES_DESIGNS.get, {
            page,
            limit,
            pagination: "true",
        })

        sketchesData = response?.data?.data || []

        paginationData = response?.data?.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1
        }

    } catch (error) {
        rethrowNavigationError(error)
        console.error("Error fetching sketches:", error)
    }

    return (
        <div className="space-y-8">
            <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
                <SketchesHome
                    initialData={sketchesData}
                    initialPagination={paginationData}
                />
            </Suspense>
        </div>
    )
}

export default page