import { get } from '@/lib/server-api'
import { redirect } from 'next/navigation'
import { PreProductionClient } from './PreProductionClient'
import { API_LIST_AUTH } from '@/hooks/api-list'

export default async function Page({ params }) {
    const { id } = await params

    let designData = null;
    try {
        const res = await get(`${API_LIST_AUTH.all_pre_production_data}${id}`);
        designData = res?.data || null;
    } catch (error) {
        console.error(`Error fetching design for ${id}:`, error);
        redirect('/dashboard');
    }

    if (!designData) {
        redirect('/dashboard');
    }

    return (
        <PreProductionClient
            id={id}
            designData={designData}
            inspirationData={designData.inspirationList}
            sketchesData={designData.sketchesList}
            visualDesignersData={designData.visualDesignersList}
            fabricData={designData.fabricsList}
            yarnData={designData.yarnsList}
            sequencesData={designData.sequencesList}
            sampleData={designData.samplesList}
        />
    )
}