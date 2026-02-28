"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export default function PageHeader({
    title,
    href,
    preserveQuery = false,
}) {
    const searchParams = useSearchParams()

    // Convert ReadonlyURLSearchParams to normal string
    const queryString = searchParams?.toString()

    const finalHref =
        preserveQuery && queryString
            ? {
                pathname: href,
                query: Object.fromEntries(searchParams.entries()),
            }
            : href

    return (
        <Link href={finalHref}>
            <h1 className="cursor-pointer text-[26px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground flex items-center gap-1 sm:gap-3">
                <ChevronLeft className="w-[1em] h-[1em] text-primary-foreground" />
                <span className="text-nowrap sm:text-normal">
                    {title}
                </span>
            </h1>
        </Link>
    )
}