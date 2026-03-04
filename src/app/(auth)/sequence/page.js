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
            title="Sequence"
            addButtonText="Add Sequence"
            searchPlaceholder="Search sequence name..."
            fetchApiEndpoint={API_LIST_AUTH.StockSequence.get}
            getItemId={(item) => item.id}
            getItemLabel={(item) => item.sequence_name || `Sequence ${item.id}`}
            renderCard={({ key, item, onViewDetails }) => (
                <FabricDesignCard
                    key={key}
                    id={item.id}
                    fabric_id={item.sequence_id}
                    category={item.category}
                    fabric_name={item.sequence_name}
                    fabric_color={item.sequence_color}
                    image={item?.sequence_image ? `${process.env.NEXT_PUBLIC_BASE_URL}${item?.sequence_image}` : "/design-thumb.png"}
                    onViewDetails={onViewDetails}
                    isFabric={false}
                    isSequences={true}
                />
            )}
            renderAddModal={({ open, onOpenChange, onAdd }) => (
                <AddFabricModal
                    isFabric={false}
                    isSequences={true}
                    open={open}
                    onOpenChange={onOpenChange}
                    onAdd={onAdd}
                />
            )}
            renderSidebar={({ open, onOpenChange, selectedData, onUpdateSuccess }) =>
                open && selectedData ? (
                    <StockDetailsSidebar
                        type="Sequence"
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

