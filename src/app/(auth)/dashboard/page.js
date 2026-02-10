"use client";
import * as React from "react";
import { format } from "date-fns";
import { DesignCard } from "@/components/design-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, Search } from "lucide-react";
import { AddDesignModal } from "@/components/add-design-modal";
import { usePost } from "@/hooks/useApi";
import { usePagination } from "@/hooks/usePagination";
import { CommonPagination } from "@/components/CommonPagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";



function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [designList, setDesignList] = React.useState([]);
  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [category, setCategory] = React.useState(searchParams.get("category") || "concept");
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    pagination,
    setPagination,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
  } = usePagination(parseInt(searchParams.get("limit")) || 1);

  // Initial sync from URL
  React.useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    if (page !== currentPage) setCurrentPage(page);
  }, []);

  // Update URL when states change
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (limit !== 10) params.set("limit", limit.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category && category !== "concept") params.set("category", category);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : pathname, { scroll: false });
  }, [currentPage, limit, debouncedSearch, category, pathname, router]);

  const { mutate: getDesigns, isPending } = usePost('/api/v1/design/list', {
    onSuccess: (data) => {
      console.log('data?.data', data?.data)
      if (data?.data?.data) {
        setPagination(data.data.pagination);

        // Map backend data to DesignCard props
        const mappedDesigns = data.data.data.map(item => ({
          id: item.id,
          design_slug_id: item.design_slug_id,
          category: item.category,
          startDate: item.start_date,
          finishDate: item.finish_date,
          targetDate: item.target_date,
          status: item.status,
          summary: item.note,
          image: `${process.env.NEXT_PUBLIC_API_URL}${item.image}`,
          isLocked: false,
          backUrl: `?page=${currentPage}&limit=${limit}${debouncedSearch ? `&search=${debouncedSearch}` : ""}${category && category !== "concept" ? `&category=${category}` : ""}`
        }));

        setDesignList(mappedDesigns);
      }
    },
  });

  React.useEffect(() => {
    getDesigns({ page: currentPage, limit: limit, search: debouncedSearch, category: category });
    // getDesigns({ page: currentPage, limit: limit, search: debouncedSearch, category: category });
  }, [currentPage, limit, debouncedSearch, category]);

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
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search designs..."
            className="pl-10 h-10 border-[#dcccbd] rounded-md placeholder:text-primary-foreground/50 text-[16px] sm:text-[18px] focus-visible:ring-0 focus-visible:border-primary transition-colors"
          />
        </div>
        <Tabs value={category} onValueChange={(val) => {
          setCategory(val);
          setCurrentPage(1);
        }} className="w-full">
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
      {isPending ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-lg text-primary-foreground">Loading designs...</p>
        </div>
      ) : designList.length > 0 ? (
        designList.map((design) => <DesignCard key={design.id} {...design} />)
      ) : (
        <div className="flex justify-center items-center py-10">
          <p className="text-lg text-primary-foreground opacity-60">
            No designs found.
          </p>
        </div>
      )}

      <CommonPagination
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
      />
    </div>
  );
}

export default function Home() {
  return (
    <React.Suspense fallback={
      <div className="flex justify-center items-center py-10">
        <p className="text-lg text-primary-foreground font-serif">Loading Dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </React.Suspense>
  );
}
