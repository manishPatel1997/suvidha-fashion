// import Image from "next/image"
// import { ChevronRight } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import InfoFun from "./Info"

// export function DesignCard({
//   id,
//   category,
//   startDate,
//   finishDate,
//   targetDate,
//   status,
//   summary,
//   image
// }) {
//   return (
//     <Card className="@container w-full border border-[#dcccbd] rounded-[10px] bg-white overflow-hidden shadow-none py-0 gap-4 min-w-0">
//       {/* Header Area */}
//       <div className="bg-[#f8f5f2] px-[19px] py-[10px] border-b border-[#dcccbd]">
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-primary-foreground">Design ID:</span>
//           <span className="text-sm font-semibold text-primary-foreground">{id}</span>
//         </div>
//       </div>

//       {/* Main Content Area — responds to card width via container queries */}
//       <div className="px-[19px] flex flex-col space-y-[15px]">
//         {/* Narrow card: stacked layout (single column) */}
//         <div className="flex flex-col @sm:hidden space-y-4">
//           <div className="relative w-full h-20 shrink-0 rounded-[5px] overflow-hidden border border-[#dcccbd]/50">
//             <Image
//               src={image}
//               alt={`Design ${id}`}
//               fill
//               className="object-bottom-left"
//             />
//           </div>
//           <InfoFun label="Category" value={category} />
//           <div className="w-full h-px bg-[#dcccbd]" />
//           <InfoFun label="Start Date" value={startDate} />
//           <div className="w-full h-px bg-[#dcccbd]" />
//           <InfoFun label="Finish Date" value={finishDate} />
//           <div className="w-full h-px bg-[#dcccbd]" />
//           <InfoFun label="Target Date" value={targetDate} />
//           <div className="w-full h-px bg-[#dcccbd]" />
//           <div className="flex items-center justify-between">
//             <InfoFun className="space-y-[10px] px-0" label="Status" value={status} />
//             <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[5px] border border-[#dcccbd] text-primary-foreground hover:bg-sidebar-accent transition-colors">
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Wide card: horizontal layout — whole block wraps below image when space is insufficient */}
//         <div className="hidden @sm:flex flex-wrap items-center gap-x-[19px] gap-y-4">
//           {/* Thumbnail — never shrinks, wraps to its own row when needed */}
//           <div className="relative w-30 h-20 shrink-0 rounded-[5px] overflow-hidden border border-[#dcccbd]/50">
//             <Image
//               src={image}
//               alt={`Design ${id}`}
//               fill
//               className="object-bottom-left"
//             />
//           </div>

//           {/* Metrics block — one row, fills space; whole block wraps below image only when row is too narrow; inner wrap for individual items */}
//           <div className="flex-1 min-w-[fit-content] flex flex-wrap items-center justify-between gap-y-4">
//             <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
//             <InfoFun label="Category" value={category} className="shrink-0" />
//             <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
//             <InfoFun label="Start Date" value={startDate} className="shrink-0" />
//             <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
//             <InfoFun label="Finish Date" value={finishDate} className="shrink-0" />
//             <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
//             <InfoFun label="Target Date" value={targetDate} className="shrink-0" />
//             <div className="w-px h-[35px] shrink-0 bg-[#dcccbd]" />
//             <div className="flex items-center gap-10 pl-4 shrink-0">
//               <InfoFun className="space-y-[10px] px-0" label="Status" value={status} />
//               <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[5px] border border-[#dcccbd] text-primary-foreground hover:bg-sidebar-accent transition-colors shrink-0">
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer Area with Divider */}
//         {summary && (
//           <div className="pt-[5px] border-t border-[#dcccbd]">
//             <p className="text-sm font-medium text-muted-foreground py-2">
//               {summary}
//             </p>
//           </div>
//         )}
//       </div>
//     </Card>
//   )
// }

import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import InfoFun from "./Info"

export function DesignCard({
  id,
  category,
  startDate,
  finishDate,
  targetDate,
  status,
  summary,
  image
}) {
  return (
    <Card className="@container w-full border border-[#dcccbd] rounded-[10px] bg-white overflow-hidden shadow-none py-0 gap-4 min-w-0">
      {/* Header Area */}
      <div className="bg-[#f8f5f2] px-[19px] py-[10px] border-b border-[#dcccbd]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary-foreground">Design ID:</span>
          <span className="text-sm font-semibold text-primary-foreground">{id}</span>
        </div>
      </div>

      {/* Main Content Area — responds to card width via container queries */}
      <div className="px-[19px] flex flex-col space-y-[15px]">
        {/* Narrow card: stacked layout (single column) */}
        <div className="flex flex-col @sm:hidden space-y-4">
          <div className="relative w-full max-w-[250px] max-h-24 h-24 shrink-0 rounded-[5px] overflow-hidden border border-[#dcccbd]/50">
            <Image
              src={image}
              alt={`Design ${id}`}
              fill
              className="object-left-bottom"
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
          <div className="flex items-center justify-between">
            <InfoFun className="space-y-[10px] px-0" label="Status" value={status} />
            <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[5px] border border-[#dcccbd] text-primary-foreground hover:bg-sidebar-accent transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Wide card: horizontal layout — whole block wraps below image when space is insufficient */}
        <div className="hidden @sm:flex flex-wrap items-center gap-x-[19px] gap-y-4">
          {/* Thumbnail — never shrinks, wraps to its own row when needed */}
       

          <div className="relative w-32 h-20 shrink-0 rounded-[5px] overflow-hidden border border-[#dcccbd]/50">
            <Image
              src={image}
              alt={`Design ${id}`}
              fill
              className="object-cover object-center"
              sizes="100vw"

            />
          </div>

          {/* Metrics block — one row, fills space; whole block wraps below image only when row is too narrow; inner wrap for individual items */}
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
              <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[5px] border border-[#dcccbd] text-primary-foreground hover:bg-sidebar-accent transition-colors shrink-0">
                <ChevronRight size={16} />
              </button>
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