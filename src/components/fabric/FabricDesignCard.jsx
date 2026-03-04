import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "../ui/button"

export function FabricDesignCard({
    isFabric = false,
    isSequences = false,
    fabric_id,
    category,
    fabric_name,
    fabric_color,
    image,
    onViewDetails,
}) {
    return (
        <Card className="@container w-full border border-[#dcccbd] rounded-[10px] bg-white overflow-hidden shadow-none py-0 gap-2 min-w-0 relative">

            {/* Header */}
            <div className="bg-[#fcf8f4] px-[19px] py-[10px] border-b border-[#dcccbd] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary-foreground">{isFabric ? 'Fabric' : isSequences ? 'Sequences' : 'Yarn'} ID:</span>
                    <span className="text-sm font-semibold text-primary-foreground">{fabric_id}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-[19px] flex flex-col space-y-[15px] relative ">
                <div>
                    {/* Narrow card: stacked layout (single column) */}
                    <div className="flex flex-col @sm:hidden space-y-4">
                        <div className="relative w-full max-w-[250px] max-h-24 h-24 shrink-0 rounded-[5px] overflow-hidden border border-[#dcccbd]/50">
                            <Image
                                src={image}
                                alt={`${isFabric ? 'Fabric' : isSequences ? 'Sequences' : 'Yarn'} ${fabric_id}`}
                                fill
                                className="object-bottom-left"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                quality={100}
                            />
                        </div>
                        <div className="w-full h-px bg-[#dcccbd]" />
                        <div className="text-normal space-y-1">
                            <div className="flex">
                                <div className="text-muted-foreground w-34 shrink-0">
                                    {isFabric ? 'Fabric Category' : isSequences ? 'Sequences' : 'Yarn Category'} :
                                </div>
                                <div className="font-medium text-[#1A1A1A]">
                                    {category}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="text-muted-foreground w-34 shrink-0">
                                    {isFabric ? 'Fabric' : isSequences ? 'Sequences' : 'Yarn'} Name:
                                </div>
                                <div className="font-medium text-[#1A1A1A]">
                                    {fabric_name}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="text-muted-foreground w-34 shrink-0">
                                    {isFabric ? 'Fabric' : isSequences ? 'Sequences' : 'Yarn'} Color:
                                </div>
                                <div className="font-medium text-[#1A1A1A] flex items-center gap-2">
                                    <div className="w-4! h-4! rounded" style={{ backgroundColor: fabric_color }} />{fabric_color}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end pb-4">
                            <Button
                                onClick={onViewDetails}
                                className="w-[30px] h-[30px] flex items-center justify-center rounded-[5px] border border-[#dcccbd] text-primary-foreground hover:bg-sidebar-accent transition-colors"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Wide card: horizontal layout */}
                <div className="hidden @sm:flex flex-wrap items-center gap-y-[19px] gap-x-6 pb-4">
                    <div className="relative w-32 h-20 shrink-0 rounded-[5px] overflow-hidden border border-[#dcccbd]/50">
                        <Image
                            src={image}
                            alt={`Fabric ${fabric_id}`}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 256px"
                            quality={90}
                        />
                    </div>
                    <div className="flex-1 min-w-fit flex flex-wrap items-center justify-between gap-y-4">
                        <div className="text-normal space-y-1 border-[#dcccbd]/80 lg:border-l pl-4 ">
                            <div className="flex">
                                <div className="text-muted-foreground w-34 shrink-0">
                                    {isFabric ? 'Fabric Category' : isSequences ? 'Sequences' : 'Yarn Category'} :
                                </div>
                                <div className="font-medium text-[#1A1A1A]">
                                    {category}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="text-muted-foreground w-34 shrink-0">
                                    {isFabric ? 'Fabric' : isSequences ? 'Sequences' : 'Yarn'} Name:
                                </div>
                                <div className="font-medium text-[#1A1A1A]">
                                    {fabric_name}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="text-muted-foreground w-34 shrink-0">
                                    {isFabric ? 'Fabric' : isSequences ? 'Sequences' : 'Yarn'} Color:
                                </div>
                                <div className="font-medium text-[#1A1A1A] flex items-center gap-2">
                                    <div className="w-4! h-4! rounded" style={{ backgroundColor: fabric_color }} />{fabric_color}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-10 pl-4 shrink-0">
                            <Button
                                onClick={onViewDetails}
                                className="w-[30px] h-[30px] flex items-center justify-center rounded-[5px] border border-[#dcccbd] text-primary-foreground hover:bg-sidebar-accent transition-colors shrink-0"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    )
}