"use client";
import * as React from "react";
import { FabricDesignCard } from "@/components/fabric/FabricDesignCard";
import { AddFabricModal } from "@/components/add-fabric-modal";
import { API_LIST_AUTH } from "@/hooks/api-list";
import { StockListPage } from "@/components/stock/StockListPage";
import dynamic from "next/dynamic";
const StockDetailsSidebar = dynamic(
    () =>
        import("@/components/stock/StockDetailsSidebar").then(
            (mod) => mod.StockDetailsSidebar
        ),
    { ssr: false }
);

function DashboardContent() {
    return (
        <StockListPage
            title="Yarn"
            addButtonText="Add Yarn"
            searchPlaceholder="Search yarn name..."
            fetchApiEndpoint={API_LIST_AUTH.StockYarn.get}
            getItemId={(item) => item.id}
            getItemLabel={(item) => item.yarn_name || `Yarn ${item.id}`}
            renderCard={({ key, item, onViewDetails }) => (
                <FabricDesignCard
                    key={key}
                    id={item.id}
                    fabric_id={item.yarn_id}
                    category={item.category}
                    fabric_name={item.yarn_name}
                    fabric_color={item.yarn_color}
                    image={item?.yarn_image ? `${process.env.NEXT_PUBLIC_BASE_URL}${item?.yarn_image}` : "/design-thumb.png"}
                    onViewDetails={onViewDetails}
                    isFabric={false}
                    isSequences={false}
                />
            )}
            renderAddModal={({ open, onOpenChange, onAdd }) => (
                <AddFabricModal
                    isFabric={false}
                    isSequences={false}
                    open={open}
                    onOpenChange={onOpenChange}
                    onAdd={onAdd}
                />
            )}
            // renderSidebar={({ open, onOpenChange, selectedData, onUpdateSuccess }) => (
            //     // <FabricDetailsSidebar
            //     //     type="Yarn"
            //     //     open={open}
            //     //     onOpenChange={onOpenChange}
            //     //     selectedData={selectedData}
            //     //     onUpdateSuccess={onUpdateSuccess}
            //     // />
            //     <StockDetailsSidebar
            //         type="Yarn"
            //         open={open}
            //         onOpenChange={onOpenChange}
            //         selectedData={selectedData}
            //         onUpdateSuccess={onUpdateSuccess}
            //     />
            // )}
            renderSidebar={({ open, onOpenChange, selectedData, onUpdateSuccess }) =>
                open && selectedData ? (
                    <StockDetailsSidebar
                        type="Yarn"
                        open={open}
                        onOpenChange={onOpenChange}
                        selectedData={selectedData}
                        onUpdateSuccess={onUpdateSuccess}
                    />
                ) : null
            }
        />
    );
}

export default function Home() {
    return (
        <React.Suspense>
            <DashboardContent />
        </React.Suspense>
    );
}

