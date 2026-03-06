'use client'
import PostProductionHome from '@/components/post-production/PostProductionHome'

function page() {
    return (
        <div className="space-y-8">
            <div className="flex flex-row sm:items-center justify-between gap-4">
                <h1 className="text-[26px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground flex items-center gap-1 sm:gap-3">
                    <span className='text-nowrap sm:text-normal '>Post Production</span>
                </h1>
            </div>
            <PostProductionHome />
        </div>
    )
}

export default page
