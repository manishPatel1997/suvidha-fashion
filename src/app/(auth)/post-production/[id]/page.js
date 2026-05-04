export const dynamic = 'force-dynamic'
import PostProductionHome from '@/components/post-production/PostProductionHome'
import { API_POST_PRODUCTION } from '@/hooks/api-list'
import { fetchGetData } from '@/lib/helperServer'

async function page({ params }) {
    const { id } = await params
    const postProductionData = await fetchGetData(API_POST_PRODUCTION.get, id)
    console.log('postProductionData', postProductionData)
    return (
        <div className="space-y-8">
            <div className="flex flex-row sm:items-center justify-between gap-4">
                <h1 className="text-[26px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground flex items-center gap-1 sm:gap-3">
                    <span className='text-nowrap sm:text-normal '>Post Production</span>
                </h1>
            </div>
            <PostProductionHome
                titleName="Deko"
                Idx="1"
                sketchesData={postProductionData?.deko}
                defaultOpen={true}
            />
            <PostProductionHome
                titleName="Mill"
                Idx="2"
                sketchesData={postProductionData?.mill}
            />
            {/* 
            <PostProductionHome
                titleName="Photography"
                Idx="3"
                sketchesData={postProductionData?.photography}
            />
            <PostProductionHome
                titleName="Folder"
                Idx="4"
                sketchesData={postProductionData?.folder}
            /> */}
        </div>
    )
}

export default page
