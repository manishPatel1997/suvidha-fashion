"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { StateUpdate } from "@/lib/helper";
import { usePost } from "@/hooks/useApi";
import { API_LIST_AUTH } from "@/hooks/api-list";
import dynamic from "next/dynamic";
const AddDetailsModal = dynamic(() =>
  import("@/components/add-details-modal").then((mod) => mod.AddDetailsModal)
)
const EditTargetModal = dynamic(() =>
  import("@/components/edit-target-modal").then((mod) => mod.EditTargetModal)
)

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center text-[13px] leading-tight">
    <span className="text-[#1A1A1A] font-medium text-sm min-w-[80px]">
      {label}:
    </span>
    <span className="text-[#1A1A1A] text-right ml-2 text-sm">{value}</span>
  </div>
);

export function SampleWorkflowCard({
  title = "6. Sample",
  PreData,
}) {
  const modalTitle = `${title} Target`
  const [data, setData] = React.useState({
    status: PreData?.sampleData?.status || "",
    IsBlur: PreData?.sampleData?.status === "pending",
    assign: PreData?.sampleData?.assigns || [],
    sample_target: PreData?.sampleData?.sample_target || 0,
    note: PreData?.sampleData?.note || "",
    progress: (PreData?.sampleData?.assigns.length / PreData?.sampleData?.sample_target) * 100,
  })
  const [clickedAction, setClickedAction] = React.useState(null)

  const [openModal, setOpenModal] = React.useState({
    isEditModalOpen: false,
    isDetailsModalOpen: false,
    selectData: null
  })

  React.useEffect(() => {
    if (PreData?.sampleData) {
      StateUpdate({
        status: PreData?.sampleData?.status || "",
        IsBlur: PreData?.sampleData?.status === "pending",
        assign: PreData?.sampleData?.assigns || [],
        sample_target: PreData?.sampleData?.sample_target || 0,
        note: PreData?.sampleData?.note || "",
        progress: (PreData?.sampleData?.assigns.length / PreData?.sampleData?.sample_target) * 100,
      }, setData)
    }
  }, [PreData?.sampleData])

  const { mutate: updateStatus, isPending: isUpdatingStatus } = usePost(API_LIST_AUTH.Sample.assignStatus, {
    onSuccess: (res, variables) => {
      setClickedAction(null)
      if (res.success) {
        StateUpdate({ IsBlur: false, status: variables.status }, setData)
      }
    },
    onError: (error) => {
      setClickedAction(null)
      console.error("Error updating status:", error)
    }
  })

  const handleOnCompleted = (type) => {
    setClickedAction(type)
    const body = {
      design_id: PreData?.sampleData?.design_id.toString(),
      status: type
    }
    updateStatus(body)
  }

  const onEditTarget = async (val) => {
    const body = {
      design_id: PreData?.sampleData?.design_id.toString(),
      sample_target: val.toString(),
      status: "running", // running
      note: ""
    }
    updateTarget(body)
  }

  const { mutate: updateTarget, isPending } = usePost(API_LIST_AUTH.Sample.target, {
    onSuccess: (res, variables) => {
      if (res.success) {
        StateUpdate({
          sample_target: Number(variables.sample_target),
          progress: (data.assign.length / Number(variables.sample_target)) * 100,
          IsBlur: false,
          status: "running"
        }, setData)
        StateUpdate({ isEditModalOpen: false, IsEditTarget: false }, setOpenModal)
      }
    },
    onError: (error) => {
      console.error("Error updating target:", error)
    }
  })

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      <AccordionItem
        value="workflow"
        className="border border-[#dcccbd] rounded-md bg-white shadow-sm overflow-hidden group"
      >
        {/* HEADER */}
        <div className="relative">
          <AccordionTrigger
            className={clsx(
              "px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd] ",
              "flex items-start justify-between",
              "hover:no-underline",
              "data-[state=closed]:h-[73.74px]"
            )}
          >

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full ">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center font-semibold text-primary-foreground w-full">
                  <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
                    {title}
                  </h3>
                  <span className=" group-data-[state=open]:hidden">{Math.round(data.progress)}%</span>
                </div>

                <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden  group-data-[state=open]:hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${data.progress}%`,
                      background:
                        "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

          </AccordionTrigger>
          <div className="absolute right-14 top-[50%] -translate-y-1/2 flex items-center space-x-2 z-10 group-data-[state=closed]:hidden">
            {data.IsBlur && <Button
              variant="outline"
              size="xs"
              onClick={() => StateUpdate({ isEditModalOpen: true }, setOpenModal)}
              className="h-7 px-4 py-0 border-[#dcccbd] bg-[#7DAA7B] text-[14px] font-medium text-white rounded-md hover:bg-[#5d8d5b]"
            >
              Start
            </Button>}
            {!data.IsBlur && data.status !== "completed" && data.status !== "skipped" && <Button
              variant="outline"
              size="xs"
              disabled={data.IsBlur || isUpdatingStatus}
              onClick={() => handleOnCompleted("skipped")}
              className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium text-primary-foreground rounded-md hover:bg-[#f1ede9]"
            >
              {isUpdatingStatus && clickedAction === "skipped" ? "..." : "Skip"}
            </Button>}
          </div>
        </div>

        {/* CONTENT */}
        <AccordionContent className="p-0">
          <div
            className={clsx(
              "p-6 space-y-8",
            )}
          >
            {/* Progress */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center font-semibold text-primary-foreground w-full lg:w-[80%]">
                  <span>Workflow Progress</span>
                  <span>{data?.progress ? Math.round(data.progress) : 0}%</span>
                </div>

                <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${data.progress}%`,
                      background:
                        "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-[#dcccbd]"></div>
          {/* Sample Rows */}
          <div className="space-y-4 p-6 pt-6">
            {PreData?.fabricData?.fabrics?.map((row) => {
              const filteredAssign =
                data?.assign?.filter(
                  (item) => item.fabric_assign_id === row.id
                ) || []

              const totalSampleMeter = filteredAssign.reduce(
                (sum, item) => sum + Number(item.sample_meter || 0),
                0
              )
              return (
                <div
                  key={row.id}
                  style={{ backgroundColor: row.fabric_color }}
                  className="grid grid-cols-1 lg:grid-cols-4 gap-5 rounded-[10px] p-5 min-h-[225px]"
                >
                  <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredAssign.map((item, index) => {
                      const isLast = index === filteredAssign.length - 1

                      return (
                        <div key={item.id || index} className="relative">
                          <div
                            className={clsx(
                              "space-y-1.5",

                              // sm breakpoint border logic
                              index % 2 === 0 &&
                              !isLast &&
                              "sm:border-r sm:border-[#B0826A] sm:pr-5 xl:border-r-0 xl:pr-0",

                              // xl breakpoint border logic
                              index % 3 !== 2 &&
                              !isLast &&
                              "xl:border-r xl:border-[#B0826A] xl:pr-5"
                            )}
                          >
                            <DetailItem label="Yarn" value={item.yarn_name} />
                            <DetailItem label="Quality con" value={item.quality_con} />
                            <DetailItem label="Sequence" value={item.sequence_name} />
                            <DetailItem label="CD Con" value={item.sample_cd_con} />
                            <DetailItem label="Meter" value={item.sample_meter} />
                            <DetailItem label="Design No" value={item.sample_design_no} />

                            <div className="pt-2 space-y-1.5">
                              <div className="h-[3px] w-full bg-[#B0826A] rounded-full" />
                              <div className="h-[3px] w-full bg-[#B0826A] rounded-full" />
                              <div className="h-[3px] w-full bg-[#B0826A] rounded-full" />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {totalSampleMeter < row.fabric_meter && !data.IsBlur && data.status !== "completed" && data.status !== "skipped" && <div className="flex justify-start lg:justify-end items-start">
                    <Button
                      variant="outline"
                      onClick={() =>
                        StateUpdate(
                          { isDetailsModalOpen: true, selectData: row },
                          setOpenModal
                        )
                      }
                      className="h-[28px] w-fit bg-transparent border border-[#000000] text-[#1A1A1A] rounded-md shadow-none text-sm font-semibold px-3.5 cursor-pointer"
                    >
                      + Add
                    </Button>
                  </div>}
                </div>
              )
            })}
            {!data.IsBlur && data.status !== "completed" && data.status !== "skipped" &&
              <div className="flex justify-end flex-auto self-end">
                <Button
                  onClick={() => handleOnCompleted("completed")}
                  className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 h-[36px] px-8 rounded-[8px]"
                  disabled={data.IsBlur || isUpdatingStatus}
                >
                  {isUpdatingStatus && clickedAction === "completed" ? "Processing..." : "Completed"}
                </Button>
              </div>
            }
          </div>
        </AccordionContent>
      </AccordionItem>
      <EditTargetModal
        open={openModal.isEditModalOpen}
        onOpenChange={(isOpen) => { StateUpdate({ isEditModalOpen: isOpen }, setOpenModal) }}
        title={modalTitle}
        initialValue={data.sample_target}
        onSave={onEditTarget}
        isLoading={isPending}
        IsEditTarget={openModal.IsEditTarget}
        min={data.assign.length > 0 ? data.assign.length : 1}
      />

      {openModal.isDetailsModalOpen && <AddDetailsModal
        open={openModal.isDetailsModalOpen}
        onOpenChange={(isOpen) => { StateUpdate({ isDetailsModalOpen: isOpen, selectData: null }, setOpenModal) }}
        onAdd={(values) => {
          StateUpdate({
            assign: [...data.assign, values],
            progress: (data.assign.length / Number(data.sample_target)) * 100,
          }, setData)
          StateUpdate({ isDetailsModalOpen: false, selectData: null }, setOpenModal)
        }}
        selectData={openModal.selectData}
        assign={data?.assign?.filter((item) => item.fabric_assign_id == openModal.selectData?.id).reduce((acc, item) => acc + item.sample_meter, 0)}
        PreData={PreData}
      />}
    </Accordion>
  );
}
