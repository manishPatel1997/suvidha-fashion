"use client";
import * as React from "react";
import { FabricDesignCard } from "@/components/fabric/FabricDesignCard";
import { AddFabricModal } from "@/components/add-fabric-modal";
import { API_LIST_AUTH } from "@/hooks/api-list";
import StokeAlertCard from "@/components/fabric/StokeAlertCard";
import { StockDetailsSidebar } from "@/components/stock/StockDetailsSidebar";
import { StockListPage } from "@/components/stock/StockListPage";

function DashboardContent() {
    return (
        <StockListPage
            title="Fabric"
            addButtonText="Add Fabric"
            searchPlaceholder="Search fabrics name..."
            fetchApiEndpoint={API_LIST_AUTH.StockFabric.get}
            alertComponent={StokeAlertCard}
            getItemId={(item) => item.id}
            getItemLabel={(item) => item.fabric_name || `Fabric ${item.id}`}
            renderCard={({ key, item, onViewDetails }) => (
                <FabricDesignCard
                    isFabric={true}
                    isSequences={false}
                    key={key}
                    id={item.id}
                    fabric_id={item.fabric_id}
                    category={item.category}
                    fabric_name={item.fabric_name}
                    fabric_color={item.fabric_color}
                    image={item?.fabric_image ? `${process.env.NEXT_PUBLIC_BASE_URL}${item?.fabric_image}` : "/design-thumb.png"}
                    onViewDetails={onViewDetails}
                />
            )}
            renderAddModal={({ open, onOpenChange, onAdd }) => (
                <AddFabricModal
                    isFabric={true}
                    isSequences={false}
                    open={open}
                    onOpenChange={onOpenChange}
                    onAdd={onAdd}
                />
            )}
            renderSidebar={({ open, onOpenChange, selectedData, onUpdateSuccess }) => (
                <StockDetailsSidebar
                    type="Fabric"
                    open={open}
                    onOpenChange={onOpenChange}
                    selectedData={selectedData}
                    onUpdateSuccess={onUpdateSuccess}
                />
            )}
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

