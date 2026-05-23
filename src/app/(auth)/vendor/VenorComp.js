"use client"

import * as React from "react"
import { VendorCard } from "@/components/vendor/VendorCard"
import { AddFabricModal } from "@/components/add-fabric-modal"
import { API_LIST_AUTH } from "@/hooks/api-list"
import { usePost } from "@/hooks/useApi"
import { toast } from "sonner"
import { StockListPage } from "@/components/stock/StockListPage"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

function VendorContent({ data = null }) {
    return (
        <>
            <StockListPage
                title="Vendor"
                ServerData={data}
                searchPlaceholder="Search Vendor name..."
                addButtonText="Add Vendor"
                fetchApiEndpoint={API_LIST_AUTH.Vendor.get}
                listClassName="grid [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] gap-6"
                getItemId={(item) => item.id}
                getItemLabel={(item) => item.name}
                renderCard={({ key, item, onEdit, onDelete }) => (
                    <VendorCard
                        key={key}
                        id={item.id}
                        name={item.name}
                        category={item.category}
                        contact={item.contact}
                        address={item.address}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
                renderAddModal={({ open, onOpenChange, onAdd }) => (
                    <AddFabricModal
                        isVendor={true}
                        open={open}
                        onOpenChange={onOpenChange}
                        onAdd={(newItem) => {
                            onAdd(newItem);
                            toast.success("Vendor added successfully");
                        }}
                    />
                )}
                renderEditModal={({ open, onOpenChange, initialData, onUpdate }) => (
                    <AddFabricModal
                        isVendor={true}
                        open={open}
                        onOpenChange={onOpenChange}
                        initialData={initialData}
                        onAdd={(updatedItem) => {
                            onUpdate(updatedItem);
                            toast.success("Vendor updated successfully");
                        }}
                    />
                )}
                renderDeleteModal={({ open, onOpenChange, selectedData, onDelete }) => (
                    <VendorDeleteModal
                        open={open}
                        onOpenChange={onOpenChange}
                        selectedData={selectedData}
                        onDeleteSuccess={(deletedId) => {
                            onDelete(deletedId);
                            toast.success("Vendor deleted successfully");
                        }}
                    />
                )}
            />
        </>
    );
}

function VendorDeleteModal({ open, onOpenChange, selectedData, onDeleteSuccess }) {
    const { mutate: deleteVendor, isPending: isDeleting } = usePost(
        API_LIST_AUTH.Vendor.delete,
        {
            onSuccess: (res, variables) => {
                if (res?.success) {
                    // Pass the id from variables (always fresh — avoids stale closure)
                    onDeleteSuccess(variables?.id);
                } else {
                    toast.error(res?.message || "Failed to delete vendor");
                }
            },
            onError: (err) => {
                toast.error(err.message || "Failed to delete vendor");
            }
        }
    );

    return (
        <DeleteConfirmationModal
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={() => deleteVendor({ id: selectedData?.id })}
            isLoading={isDeleting}
            title="Delete Vendor"
            description={`Are you sure you want to delete ${selectedData?.name}?`}
        />
    );
}

export default function VendorPage({ initialData, initialPagination }) {
    return (
        <React.Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <VendorContent
                data={{ initialData, initialPagination }}
            />
        </React.Suspense>
    );
}
