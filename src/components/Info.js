// import { clsx } from "clsx";

// function InfoFun({ label, value, className }) {
//     return (
//         <div className={clsx("space-y-3 px-4", className)}>
//             <p className="text-sm font-medium text-muted-foreground leading-none whitespace-nowrap">{label}</p>
//             <p className="text-[16px] font-medium text-primary-foreground leading-none whitespace-nowrap">{value}</p>
//         </div>
//     )
// }

// export default InfoFun

import { clsx } from "clsx"

function InfoFun({ label, value, className }) {
  return (
    <div className={clsx("space-y-2 px-4", className)}>
      <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {label}
      </p>

      {/* Single-line, no break, no truncate */}
      <div className="overflow-x-auto scrollbar-hide">
        <p className="text-[16px] font-medium text-primary-foreground whitespace-nowrap">
          {value}
        </p>
      </div>
    </div>
  )
}

export default InfoFun
