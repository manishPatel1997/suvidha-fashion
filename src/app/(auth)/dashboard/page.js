"use client";
import * as React from "react";
import { format } from "date-fns";
import { DesignCard } from "@/components/design-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, Search } from "lucide-react";
import { AddDesignModal } from "@/components/add-design-modal";

const designs = [
  {
    id: "D-1425",
    category: "Concept",
    startDate: "00-00-2025",
    finishDate: "00-00-2025",
    targetDate: "00-00-2025",
    status: "Production",
    summary:
      "All sketches and designs are finalized and ready for production planning.",
    image: "/design-thumb.png",
  },
  {
    id: "D-1426",
    category: "Concept",
    startDate: "00-00-2025",
    finishDate: "00-00-2025",
    targetDate: "00-00-2025",
    status: "Production",
    image: "/design-thumb.png",
  },
  {
    id: "D-1427",
    category: "Concept",
    startDate: "00-00-2025",
    finishDate: "00-00-2025",
    targetDate: "00-00-2025",
    status: "Production",
    image: "/design-thumb.png",
  },
  {
    id: "D-1428",
    category: "Concept",
    startDate: "00-00-2025",
    finishDate: "00-00-2025",
    targetDate: "00-00-2025",
    status: "Production",
    image: "/design-thumb.png",
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [designList, setDesignList] = React.useState(designs);

  const handleAddDesign = (newDesign) => {
    setDesignList((prev) => [
      {
        ...newDesign,
        id: `D-${Math.floor(Math.random() * 10000)}`,
        status: "Production",
        image: "/design-thumb.png", // Default for now
        startDate: format(newDesign.startDate, "dd-MM-yyyy"),
        finishDate: format(newDesign.finishDate, "dd-MM-yyyy"),
        targetDate: format(newDesign.targetDate, "dd-MM-yyyy"),
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex  sm:items-center justify-between gap-4">
        <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground">
          Designs
        </h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-9.5 px-4 rounded-lg gap-2 font-semibold w-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Add Design</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
      <AddDesignModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={handleAddDesign}
      />
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search designs..."
            className="pl-10 h-10 border-[#dcccbd] rounded-md placeholder:text-primary-foreground/50 text-[16px] sm:text-[18px] focus-visible:ring-0 focus-visible:border-primary transition-colors"
          />
        </div>
        {/* <Tabs defaultValue="concept" className="w-full">
          <TabsList className="bg-white border border-[#dcccbd] rounded-md p-0 overflow-hidden w-full flex !h-10">
            <TabsTrigger
              value="concept"
              className="flex-1 h-full px-2 sm:px-4 md:px-8 rounded-none font-semibold text-[14px] sm:text-[16px] data-[state=active]:bg-[#dcccbd] data-[state=active]:text-primary-foreground focus-visible:ring-0 focus-visible:outline-none shadow-none"
            >
              <span className="hidden sm:inline">Concept</span>
              <span className="sm:hidden">Concept</span>
            </TabsTrigger>

            <TabsTrigger
              value="regular"
              className="flex-1 h-full px-2 sm:px-4 md:px-8 rounded-none font-semibold text-[14px] sm:text-[16px] data-[state=active]:bg-[#dcccbd] data-[state=active]:text-primary-foreground focus-visible:ring-0 focus-visible:outline-none shadow-none"
            >
              <span className="hidden sm:inline">Regular</span>
              <span className="sm:hidden">Regular</span>
            </TabsTrigger>

            <TabsTrigger
              value="cutting"
              className="flex-1 h-full px-2 sm:px-4 md:px-8 rounded-none font-semibold text-[14px] sm:text-[16px] data-[state=active]:bg-[#dcccbd] data-[state=active]:text-primary-foreground focus-visible:ring-0 focus-visible:outline-none shadow-none"
            >
              <span className="hidden sm:inline">Cutting</span>
              <span className="sm:hidden">Cutting</span>
            </TabsTrigger>
          </TabsList>
        </Tabs> */}
        <Tabs defaultValue="concept" className="w-full">
          {/* Tabs Header */}
          <TabsList
            className="
          w-full
          !h-10
          flex
          bg-white
          border border-[#dcccbd]
          rounded-lg
          p-1
        "
          >
            <TabsTrigger
              value="concept"
              className="
            flex-1
            h-full
            rounded-md
            font-semibold
            text-[14px] sm:text-[16px]
            whitespace-nowrap
            text-muted-foreground
            transition-all duration-200

            data-[state=active]:bg-[#dcccbd]
            data-[state=active]:text-primary-foreground

            focus-visible:outline-none
            focus-visible:ring-0
          "
            >
              Concept
            </TabsTrigger>

            <TabsTrigger
              value="regular"
              className="
            flex-1
            h-full
            rounded-md
            font-semibold
            text-[14px] sm:text-[16px]
            whitespace-nowrap
            text-muted-foreground
            transition-all duration-200

            data-[state=active]:bg-[#dcccbd]
            data-[state=active]:text-primary-foreground

            focus-visible:outline-none
            focus-visible:ring-0
          "
            >
              Regular
            </TabsTrigger>

            <TabsTrigger
              value="cutting"
              className="
            flex-1
            h-full
            rounded-md
            font-semibold
            text-[14px] sm:text-[16px]
            whitespace-nowrap
            text-muted-foreground
            transition-all duration-200

            data-[state=active]:bg-[#dcccbd]
            data-[state=active]:text-primary-foreground

            focus-visible:outline-none
            focus-visible:ring-0
          "
            >
              Cutting
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          {/* <TabsContent value="concept" className="mt-4">
            Concept content here
          </TabsContent>

          <TabsContent value="regular" className="mt-4">
            Regular content here
          </TabsContent>

          <TabsContent value="cutting" className="mt-4">
            Cutting content here
          </TabsContent> */}
        </Tabs>
      </div>
      {/* */}
      {designList.map((design) => (
        <DesignCard key={design.id} {...design} />
      ))}
    </div>
  );
}
