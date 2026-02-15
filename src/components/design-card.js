import Image from "next/image"
import { ChevronRight, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"
import InfoFun from "./Info"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function DesignCard({
  id,
  design_slug_id,
  category,
  startDate,
  finishDate,
  targetDate,
  status,
  summary,
  image,
  isLocked = false,
  backUrl = "",
}) {
  return (
    <Card className="@container w-full border border-[#dcccbd] rounded-[10px] bg-white overflow-hidden shadow-none py-0 gap-4 min-w-0 relative">
      {/* Header Area */}
      <div className="bg-[#f8f5f2] px-[19px] py-[10px] border-b border-[#dcccbd] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary-foreground">Design ID:</span>
          <span className="text-sm font-semibold text-primary-foreground">{design_slug_id}</span>
        </div>
        {isLocked && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-[#82b084] hover:bg-[#82b084]/90 text-white border-none h-7 px-4 rounded-[5px] text-xs font-medium"
            >
              Start
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-4 rounded-[5px] border-[#dcccbd] text-primary-foreground text-xs font-medium bg-white"
            >
              Skip
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area — responds to card width via container queries */}
      <div className="px-[19px] flex flex-col space-y-[15px] relative pt-4">
        {isLocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <Lock className="size-16 text-[#bcbcbc]" strokeWidth={1.5} />
          </div>
        )}

        <div className={isLocked ? "blur-[6px] opacity-40 pointer-events-none select-none" : ""}>
          {/* Narrow card: stacked layout (single column) */}
          <div className="flex flex-col @sm:hidden space-y-4">
            <div className="relative w-full max-w-[250px] max-h-24 h-24 shrink-0 rounded-[5px] overflow-hidden border border-[#dcccbd]/50">
              <Image
                src={image}
                alt={`Design ${design_slug_id}`}
                fill
                className="object-left-bottom"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={90}
              />
            </div>
            <InfoFun label="Category" value={category} />
            <div className="w-full h-px bg-[#dcccbd]" />
            <InfoFun label="Start Date" value={startDate} />
            <div className="w-full h-px bg-[#dcccbd]" />
            <InfoFun label="Finish Date" value={finishDate} />
            <div className="w-full h-px bg-[#dcccbd]" />
            <InfoFun label="Target Date" value={targetDate} />
            <div className="w-full h-px bg-[#dcccbd]" />
            <div className="flex items-center justify-between pb-4">
              <InfoFun className="space-y-[10px] px-0" label="Status" value={status} />
              <Link href={`pre-production/${id}${backUrl}`} className="w-[30px] h-[30px] flex items-center justify-center rounded-[5px] border border-[#dcccbd] text-primary-foreground hover:bg-sidebar-accent transition-colors">
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Wide card: horizontal layout */}
        <div className="hidden @sm:flex flex-wrap items-center gap-x-[19px] gap-y-4 pb-4">
          <div className="relative w-32 h-20 shrink-0 rounded-[5px] overflow-hidden border border-[#dcccbd]/50">
            <Image
              src={image}
              alt={`Design ${design_slug_id}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 256px"
              quality={90}
            />
          </div>
          <div className="flex-1 min-w-fit flex flex-wrap items-center justify-between gap-y-4">
            <InfoFun label="Category" value={category} className="shrink-0" />
            <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
            <InfoFun label="Start Date" value={startDate} className="shrink-0" />
            <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
            <InfoFun label="Finish Date" value={finishDate} className="shrink-0" />
            <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
            <InfoFun label="Target Date" value={targetDate} className="shrink-0" />
            <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
            <div className="flex items-center gap-10 pl-4 shrink-0">
              <InfoFun className="space-y-[10px] px-0" label="Status" value={status} />
              <Link href={`pre-production/${id}${backUrl}`} className="w-[30px] h-[30px] flex items-center justify-center rounded-[5px] border border-[#dcccbd] text-primary-foreground hover:bg-sidebar-accent transition-colors shrink-0">
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Area with Divider */}
        {summary ? (
          <div className="pt-[5px] border-t border-[#dcccbd]">
            <p className="text-sm font-medium text-muted-foreground py-2">
              {summary}
            </p>
          </div>
        ) : <div className="pt-[5px]"></div>}
      </div>
    </Card>
  )
}