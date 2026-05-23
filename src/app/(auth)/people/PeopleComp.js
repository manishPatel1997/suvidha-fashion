"use client";
import * as React from "react";
import { UserCard } from "@/components/people/UserCard";
import { AddFabricModal } from "@/components/add-fabric-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { API_LIST_AUTH } from "@/hooks/api-list";
import { usePost, useDelete } from "@/hooks/useApi";
import { StockListPage } from "@/components/stock/StockListPage";
import { toast } from "sonner";
import { StateUpdate } from "@/lib/helper";

function PeopleContent({ data = null }) {

    return (
        <>
            <StockListPage
                title="People"
                ServerData={data}
                addButtonText="Add People"
                searchPlaceholder="Search name..."
                fetchApiEndpoint={API_LIST_AUTH.User.get}
                listClassName="grid [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] gap-6"
                getItemId={(item) => item.id}
                getItemLabel={(item) => item.name}
                renderCard={({ key, item, onEdit, onDelete }) => (
                    <UserCard
                        key={key}
                        id={item.id}
                        user_id={item.user_id}
                        name={item.name}
                        email={item.email}
                        contact={item.contact}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
                renderAddModal={({ open, onOpenChange, onAdd }) => (
                    <AddFabricModal
                        isPeople={true}
                        open={open}
                        onOpenChange={onOpenChange}
                        onAdd={(newItem) => {
                            onAdd(newItem);
                            toast.success("User added successfully");
                        }}
                    />
                )}
                renderEditModal={({ open, onOpenChange, initialData, onUpdate }) => (
                    <AddFabricModal
                        isPeople={true}
                        open={open}
                        onOpenChange={onOpenChange}
                        initialData={initialData}
                        onAdd={(updatedItem) => {
                            onUpdate(updatedItem);
                            toast.success("User updated successfully");
                        }}
                    />
                )}
                renderDeleteModal={({ open, onOpenChange, selectedData, onDelete }) => (
                    <PeopleDeleteModal
                        open={open}
                        onOpenChange={onOpenChange}
                        selectedData={selectedData}
                        onDeleteSuccess={(deletedId) => {
                            onDelete(deletedId);
                            toast.success("User deleted successfully");
                        }}
                    />
                )}
            />
        </>
    );
}

function PeopleDeleteModal({ open, onOpenChange, selectedData, onDeleteSuccess }) {
    const { mutate: deleteUser, isPending: isDeleting } = usePost(
        API_LIST_AUTH.User.delete,
        {
            onSuccess: (res, variables) => {
                if (res?.success) {
                    // Pass the id from variables (always fresh — avoids stale closure)
                    onDeleteSuccess(variables?.id);
                } else {
                    toast.error(res?.message || "Failed to delete user");
                }
            },
            onError: (err) => {
                toast.error(err.message || "Failed to delete user");
            }
        }
    );
    return (
        <DeleteConfirmationModal
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={() => deleteUser({ id: selectedData?.id })}
            isLoading={isDeleting}
            title="Delete User"
            description={`Are you sure you want to delete ${selectedData?.name}?`}
        />
    );
}

export default function PeoplePage({ initialData, initialPagination }) {
    return (
        <React.Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <PeopleContent data={{ initialData, initialPagination }} />
        </React.Suspense>
    );
}
