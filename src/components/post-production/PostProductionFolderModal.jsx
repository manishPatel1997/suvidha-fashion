"use client"
import React from 'react'
import { CommonModal } from '../CommonModal'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { usePost } from '@/hooks/useApi'
import { API_POST_PRODUCTION } from '@/hooks/api-list'
import CloseIcon from '@/assets/CloseIcon'

export function PostProductionFolderModal({
    open,
    onOpenChange,
    selectedData,
    onSuccess
}) {
    const [folderNo, setFolderNo] = React.useState(selectedData?.folder_name || "")

    React.useEffect(() => {
        if (open) {
            setFolderNo(selectedData?.folder_name || "")
        }
    }, [open, selectedData])

    const { mutate: updateFolder, isPending } = usePost(API_POST_PRODUCTION.folder_update, {
        onSuccess: (res) => {
            if (res.success) {
                onSuccess({ ...selectedData, folder_name: folderNo })
                onOpenChange(false)
            }
        },
        onError: (error) => {
            console.error("Error updating folder:", error)
        }
    })

    const handleAdd = () => {
        if (!folderNo) return
        updateFolder({
            folder_assign_id: String(selectedData?.folder_id),
            folder_name: folderNo
        })
    }

    return (
        <CommonModal
            open={open}
            onOpenChange={onOpenChange}
            title="Folder No"
            className="max-w-[600px]!"
            containerClassName="py-10 px-0 sm:px-0 lg:px-0"
            contentClassName="max-w-[540px]"
        >
            <div className="p-6 space-y-6">
                <div className="">
                    <label className="text-[14px] font-medium text-primary-foreground font-sans">Folder</label>
                    <Input
                        value={folderNo}
                        onChange={(e) => setFolderNo(e.target.value)}
                        placeholder="Add Folder no"
                        className="h-11"
                    />
                </div>

                <div className="flex justify-center pt-1">
                    <Button
                        onClick={handleAdd}
                        disabled={isPending || !folderNo}
                        className="w-[140px] h-10 bg-[#DCCCBD] hover:bg-[#C4B4A3] text-primary-foreground rounded-[8px] text-[15px] font-medium transition-colors border-none shadow-none"
                    >
                        {isPending ? "Adding..." : "Add"}
                    </Button>
                </div>
            </div>
        </CommonModal>
    )
}
