"use client"

import * as React from "react"
import * as Yup from "yup"
import { Formik } from "formik"
import dynamic from "next/dynamic"
import { CommonModal } from "./CommonModal"
import { Button } from "@/components/ui/button"
import { FloatingTextarea } from "./ui/floating-textarea"
import { FormSelect } from "./ui/form-select"
import { API_LIST_AUTH } from "@/hooks/api-list"
import { usePost } from "@/hooks/useApi"
import { imageValidation, ImgAcceptType } from "@/lib/validation"
import AttachIcon from "@/assets/AttachIcon"
import { Input } from "./ui/input"
import { FileInput } from "./ui/file-input"
import CloseIcon from "@/assets/CloseIcon"
import clsx from "clsx"
import { cn } from "@/lib/utils"
import { StateUpdate } from "@/lib/helper"
const AddFabricModal = dynamic(() => import("./add-fabric-modal").then((mod) => mod.AddFabricModal))

export function AddImageModal({
    open,
    onOpenChange,
    onAdd,
    title = "Sketches",
    isLoading = false
}) {
    const formikRef = React.useRef(null)
    const [data, setData] = React.useState({
        isFabricModal: false,
        fabricOptions: [],
        userOptions: [],
        yarnOptions: [],
        selectedData: null
    })

    const isInspirations = title === "Inspirations"
    const isSketches = title === "Sketches"
    const isDesign = title === "Design"
    const isFabric = title === "Fabric"
    const isYarn = title === "Yarn"

    /* ---------------- FETCH USERS ---------------- */
    const { mutate: GetUser, isPending: GetUserPending } = usePost(
        API_LIST_AUTH.users_get,
        {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    const formattedUsers = res.data.map((user) => ({
                        value: user.id.toString(),
                        label: user.name,
                        email: user.email
                    }))

                    StateUpdate({ userOptions: formattedUsers }, setData)
                }
            }
        }
    )

    /* ---------------- FETCH FABRICS ---------------- */
    const { mutate: GetFabric, isPending: GetFabricPending } = usePost(
        API_LIST_AUTH.StockFabric.get,
        {
            onSuccess: (res) => {
                console.log('res', res)
                if (res.success && res.data) {
                    const formattedFabrics = res.data.map((item) => ({
                        value: item.id.toString(),
                        label: item.fabric_name || item.name || `Fabric ${item.id}`,
                        rawData: item
                    }))
                    StateUpdate({ fabricOptions: formattedFabrics }, setData)
                }
            }
        }
    )

    /* ---------------- FETCH YARNS ---------------- */
    const { mutate: GetYarn, isPending: GetYarnPending } = usePost(
        API_LIST_AUTH.StockYarn.get,
        {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    const formattedYarns = res.data.map((item) => ({
                        value: item.id.toString(),
                        label: item.yarn_name || item.name || `Yarn ${item.id}`,
                        rawData: item
                    }))
                    StateUpdate({ yarnOptions: formattedYarns }, setData)
                }
            }
        }
    )

    React.useEffect(() => {
        if (open) {
            if (isSketches || isDesign) {
                GetUser()
            }
            if (isFabric) {
                GetFabric()
            }
            if (isYarn) {
                GetYarn()
            }
        }
    }, [open, isSketches, isDesign, isFabric, isYarn])

    const validationSchema = React.useMemo(() => {
        if (isInspirations) {
            return Yup.object().shape({
                image_url: imageValidation,
                note: Yup.string().trim().optional(),
            })
        }
        if (isDesign) {
            return Yup.object().shape({
                design_no: Yup.string().required("Design number is required"),
                user_id: Yup.string().required("Please select who to assign to"),
                note: Yup.string().optional(),
            })
        }
        if (isFabric) {
            return Yup.object().shape({
                fabric_stock_id: Yup.string().required("Please select a fabric"),
                fabric_meter: Yup.string().required("Fabric meter is required"),
                note: Yup.string().optional(),
            })
        }
        if (isYarn) {
            return Yup.object().shape({
                yarn_stock_id: Yup.string().required("Please select a yarn"),
                yarn_num_cons: Yup.string().required("Yarn num cons is required"),
                note: Yup.string().optional(),
            })
        }
        return Yup.object().shape({
            user_id: Yup.string().required("Please select who to assign to"),
            note: Yup.string().optional(),
        })
    }, [title, isInspirations, isDesign])

    const handleOpenChange = (isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen && formikRef.current) {
            formikRef.current.resetForm()
        }
    }

    return (
        <CommonModal
            open={open}
            onOpenChange={handleOpenChange}
            title={isFabric ? null : title}
            className={cn(
                "sm:max-w-[550px]",
                isFabric && "sm:max-w-[650px]"
            )}
            containerClassName={cn(
                !isFabric && "px-4 sm:px-6 py-10 sm:py-10 lg:pt-18 lg:pb-12",
                isFabric && "px-4 sm:px-6 py-0! sm:pb-10!"
            )}
            contentClassName={cn(
                isFabric && "border-none "
            )}
            IsClose={!isFabric}
        >
            <div className={clsx(
                "rounded-[20px] overflow-hidden flex flex-col  overflow-y-auto max-h-[80vh] ",
            )}>
                {/* Header Actions - Hidden in Edit Mode */}
                {isFabric &&
                    <div className="w-full  py-4 flex flex-col items-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-primary-foreground hover:opacity-70 transition-opacity"
                        >
                            <CloseIcon width={17} height={17} color="#1a1a1a" />
                        </Button>
                        <div className="px-5">

                            <Button
                                onClick={() => StateUpdate({ isFabricModal: true }, setData)}
                                type="button"
                                variant="ghost"
                                className="h-9 px-6 bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground rounded-md text-[14px] font-semibold"
                            >
                                + Add Fabric
                            </Button>

                        </div>


                    </div>
                }
                <div className={cn(
                    isFabric && "px-5"
                )}>

                    <div className={cn(
                        isFabric && 'rounded-[20px] border-2 border-[#dcccbd] overflow-hidden'
                    )}>
                        {isFabric && <div className={cn(
                            "text-[20px] p-2.5  font-semibold text-center font-sans tracking-wide text-primary-foreground bg-[#F8F5F2] border-b-2 border-[#dcccbd]  ",
                            !title && "sr-only",

                        )}>
                            {title || "Modal Dialog"}
                        </div>}
                        <Formik
                            innerRef={formikRef}
                            initialValues={React.useMemo(() => {
                                const values = { note: "" }
                                if (isInspirations) values.image_url = ""
                                if (isDesign) values.design_no = ""
                                if (isSketches || isDesign) values.user_id = ""
                                if (isFabric) {
                                    values.fabric_stock_id = ""
                                    values.fabric_meter = ""
                                }
                                if (isYarn) {
                                    values.yarn_stock_id = ""
                                    values.yarn_num_cons = ""
                                }
                                return values
                            }, [isInspirations, isDesign, isSketches, isFabric])}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                const finalValues = { ...values }
                                // if (isSketches && !finalValues.image) {
                                //     finalValues.image = "/design-thumb.png"
                                // }
                                if (isFabric) {
                                    finalValues.fabric_stock_id = data.selectedData.id
                                }
                                if (onAdd) onAdd(finalValues)
                            }}
                        >
                            {(runForm) => (
                                <form
                                    onSubmit={runForm.handleSubmit}
                                    className="flex flex-col flex-1 "
                                >
                                    <div className="px-6 py-5 md:px-10 md:py-8 space-y-6">
                                        {/* Attach Image - For Inspirations or Fabric */}
                                        {(isInspirations) && (
                                            <div className="space-y-1.5">
                                                <label className="text-[16px] font-medium text-primary-foreground block">
                                                    Attach Image {isInspirations && <span className="text-[#ff6b6b]">*</span>}
                                                </label>
                                                <FileInput
                                                    name="image_url"
                                                    accept={ImgAcceptType}
                                                    runForm={runForm}
                                                    icon={<AttachIcon width={16} height={16} color="#858585" />}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0]
                                                        if (file) {
                                                            runForm.setFieldValue("image_url", file)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Fabric Select */}
                                        {isFabric && (
                                            <div className="space-y-1.5">
                                                <label className="text-[16px] font-medium block">
                                                    Fabric <span className="text-[#ff6b6b]">*</span>
                                                </label>
                                                <FormSelect
                                                    name="fabric_stock_id"
                                                    runForm={runForm}
                                                    options={data.fabricOptions}
                                                    placeholder="Select fabric"
                                                    isSearch
                                                    isLoading={GetFabricPending}
                                                    triggerClassName="h-[45px]!"
                                                    onChange={(val) => {
                                                        const selected = data.fabricOptions.find(opt => opt.value === val)
                                                        if (selected) {
                                                            StateUpdate({ selectedData: selected.rawData }, setData)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Yarn */}
                                        {isYarn && (
                                            <div className="space-y-1.5">
                                                <label className="text-[16px] font-medium block">
                                                    Yarn <span className="text-[#ff6b6b]">*</span>
                                                </label>
                                                <FormSelect
                                                    name="yarn_stock_id"
                                                    runForm={runForm}
                                                    options={data.yarnOptions}
                                                    placeholder="Select yarn"
                                                    isSearch
                                                    isLoading={GetYarnPending}
                                                    triggerClassName="h-[45px]!"
                                                    onChange={(val) => {
                                                        const selected = data.yarnOptions.find(opt => opt.value === val)
                                                        if (selected) {
                                                            StateUpdate({ selectedData: selected.rawData }, setData)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Fabric Meter */}
                                        {isYarn && (
                                            <div className="space-y-1.5">
                                                <label className="text-[16px] font-medium block">
                                                    Yarn num cons <span className="text-[#ff6b6b]">*</span>
                                                </label>
                                                <Input
                                                    name="yarn_num_cons"
                                                    type="number"
                                                    placeholder="Yarn num cons"
                                                    runForm={runForm}
                                                    className="h-[45px]"
                                                />
                                            </div>
                                        )}
                                        {/* Fabric Meter */}
                                        {isFabric && (
                                            <div className="space-y-1.5">
                                                <label className="text-[16px] font-medium block">
                                                    Fabric Meter <span className="text-[#ff6b6b]">*</span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    name="fabric_meter"
                                                    placeholder="Fabric meter"
                                                    runForm={runForm}
                                                    className="h-[45px]"
                                                />
                                            </div>
                                        )}

                                        {/* Design No - Only for Design */}
                                        {isDesign && (
                                            <div className="space-y-1.5">
                                                <label className="text-[16px] font-medium text-primary-foreground block">
                                                    Design No <span className="text-[#ff6b6b]">*</span>
                                                </label>
                                                <Input
                                                    name="design_no"
                                                    placeholder="Enter design number"
                                                    runForm={runForm}
                                                    className="h-[45px]"
                                                />
                                            </div>
                                        )}

                                        {/* Assigned To - For Sketches or Design */}
                                        {(isSketches || isDesign) && (
                                            <div className="space-y-1.5">
                                                <label className="text-[16px] font-medium block">
                                                    Assigned To{" "}
                                                    <span className="text-[#ff6b6b]">*</span>
                                                </label>

                                                <FormSelect
                                                    name="user_id"
                                                    runForm={runForm}
                                                    options={data.userOptions}
                                                    placeholder="Search by name or email"
                                                    isSearch
                                                    isLoading={GetUserPending}
                                                    triggerClassName="h-[45px]!"
                                                />
                                            </div>
                                        )}


                                        {/* Note */}
                                        <div className="space-y-1.5">
                                            <label className="text-[16px] font-medium block">
                                                Note
                                            </label>

                                            <FloatingTextarea
                                                name="note"
                                                label="Add Note"
                                                runForm={runForm}
                                                isFloating={false}
                                                className="min-h-[120px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="px-6 md:px-[60px] md:pb-5 flex justify-center">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 h-9 px-12 rounded-[5px] font-semibold text-[16px]"
                                        >
                                            {isLoading ? "Adding..." : "Add"}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            {data.isFabricModal && <AddFabricModal
                open={data.isFabricModal}
                onOpenChange={(isOpen) => StateUpdate({ isFabricModal: isOpen }, setData)}
                onAdd={(val) => {
                    console.log('val', val)
                }}
            />}
        </CommonModal>
    )
}
