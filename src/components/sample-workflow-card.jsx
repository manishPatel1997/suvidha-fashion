"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { YarnDetailsModal } from "@/components/yarn-details-modal";
import clsx from "clsx";

export function SampleWorkflowCard({
  title = "6. Sample",
  progress = 50,
  onAddDesign,
}) {
  // Mock data to match the image structure
  const sampleRows = [
    {
      id: 1,
      items: [
        {
          yarn: "Cotton Yarn",
          quality: "Approved",
          sequence: "Round Sequin",
          cdCon: "SEQ-101",
          meter: "2",
          designNo: "D-1425",
        },
        {
          yarn: "Cotton Yarn",
          quality: "Approved",
          sequence: "Round Sequin",
          cdCon: "SEQ-101",
          meter: "2",
          designNo: "D-1425",
        },
        {
          yarn: "Cotton Yarn",
          quality: "Approved",
          sequence: "Round Sequin",
          cdCon: "SEQ-101",
          meter: "2",
          designNo: "D-1425",
        },
      ],
    },
    {
      id: 2,
      items: [
        {
          yarn: "Cotton Yarn",
          quality: "Approved",
          sequence: "Round Sequin",
          cdCon: "SEQ-101",
          meter: "2",
          designNo: "D-1425",
        },
        {
          yarn: "Cotton Yarn",
          quality: "Approved",
          sequence: "Round Sequin",
          cdCon: "SEQ-101",
          meter: "2",
          designNo: "D-1425",
        },
      ],
    },
    {
      id: 3,
      items: [
        {
          yarn: "Cotton Yarn",
          quality: "Approved",
          sequence: "Round Sequin",
          cdCon: "SEQ-101",
          meter: "2",
          designNo: "D-1425",
        },
        {
          yarn: "Cotton Yarn",
          quality: "Approved",
          sequence: "Round Sequin",
          cdCon: "SEQ-101",
          meter: "2",
          designNo: "D-1425",
        },
        {
          yarn: "Cotton Yarn",
          quality: "Approved",
          sequence: "Round Sequin",
          cdCon: "SEQ-101",
          meter: "2",
          designNo: "D-1425",
        },
      ],
    },
  ];

  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center text-[13px] leading-tight">
      <span className="text-[#1A1A1A] font-medium text-sm min-w-[80px]">
        {label}:
      </span>
      <span className="text-[#1A1A1A] text-right ml-2 text-sm">{value}</span>
    </div>
  );

  return (
    <div className="w-full border border-[#dcccbd] rounded-[15px] overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd] flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
          {title}
        </h3>
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="xs"
                className="h-7 px-4 py-0 border-[#dcccbd] bg-[#7DAA7B] text-[14px] font-medium text-white rounded-md hover:bg-[#5d8d5b]"
              >
                Start
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-[1182px] p-16 bg-white border-none rounded-3xl">
              <DialogTitle className="sr-only">Yarn Details</DialogTitle>
              <YarnDetailsModal />
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="xs"
            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium text-primary-foreground rounded-md hover:bg-[#f1ede9]"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Progress */}
        <div className="flex flex-col justify-between gap-2 p-6 pb-0">
          <div className="flex justify-between items-center font-semibold text-primary-foreground w-full">
            <span>Workflow Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="relative w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
              }}
            />
          </div>
        </div>
        <div className="border-b border-[#dcccbd]"></div>
        {/* Sample Rows */}
        <div className="space-y-4 p-6 pt-0">
          {sampleRows.map((row, rowIdx) => (
            <div
              key={row.id}
              style={{
                backgroundColor: ["#DCCCBD", "#E0C3A8", "#CCC0B0"][rowIdx % 3],
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 rounded-[10px] p-5"
            >
              <div className="col-span-3 grid grid-cols-3 gap-5 pr-16 md:pr-0">
                {row.items.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Divider line for mobile/responsive or visual separation if needed. 
                                            The image has vertical dividers between columns. 
                                            We can use border-r for items except the last one.
                                        */}
                    <div
                      className={clsx(
                        "space-y-1.5",
                        idx !== row.items.length - 1 &&
                          "lg:border-r lg:border-[#B0826A] lg:pr-5",
                      )}
                    >
                      <DetailItem label="Yarn" value={item.yarn} />
                      <DetailItem label="Quality con" value={item.quality} />
                      <DetailItem label="Sequence" value={item.sequence} />
                      <DetailItem label="CD Con" value={item.cdCon} />
                      <DetailItem label="Meter" value={item.meter} />
                      <DetailItem label="Design No" value={item.designNo} />

                      {/* Decorative lines at bottom as seen in image */}
                      <div className="pt-2 space-y-1.5">
                        <div className="h-[3px] w-full bg-[#B0826A] rounded-full"></div>
                        <div className="h-[3px] w-full bg-[#B0826A] rounded-full"></div>
                        <div className="h-[3px] w-full bg-[#B0826A] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={onAddDesign}
                  className="h-[28px] w-fit bg-transparent border border-[#000000] text-[#1A1A1A] rounded-md shadow-none text-sm font-semibold px-3.5 cursor-pointer"
                >
                  + Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
