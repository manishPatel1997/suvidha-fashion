"use client"

import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { formAttr } from "@/lib/helper"
import AttachIcon from "@/assets/AttachIcon"
import CloseIcon from "@/assets/CloseIcon"
import CalendarIcon from "@/assets/CalendarIcon"
import { CommonModal } from "./CommonModal"


import { FileInput } from "@/components/ui/file-input"
import { FormSelect } from "@/components/ui/form-select"
import { FormDatePicker } from "@/components/ui/form-date-picker"

const today = new Date();
today.setHours(0, 0, 0, 0);

const validationSchema = Yup.object().shape({
  image: Yup.mixed().required("Image is required"),
  design_slug_id: Yup.string().required("Design Id is required"),
  category: Yup.string().required("Category is required"),
  start_date: Yup.date()
    .required("Start date is required")
    .min(today, "Start date cannot be in the past"),
  finish_date: Yup.date()
    .required("Finish date is required")
    .min(today, "Finish date cannot be in the past")
    .min(Yup.ref('start_date'), "Finish date cannot be before start date"),
  target_date: Yup.date()
    .required("Target date is required")
    .min(today, "Target date cannot be in the past")
    .min(Yup.ref('finish_date'), "Target date cannot be before finish date"),
})

export function AddDesignModal({ open, onOpenChange, onAdd }) {
  const formik = useFormik({
    initialValues: {
      image: "",
      design_slug_id: "",
      category: "",
      start_date: null,
      finish_date: null,
      target_date: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form values:", values)
      if (onAdd) onAdd(values)
      formik.resetForm()
    },
  })

  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      formik.resetForm()
    }
  }

  const categoryOptions = [
    { value: "concept", label: "Concept" },
    { value: "regular", label: "Regular" },
    { value: "cutting", label: "Cutting" },
  ]

  return (
    <CommonModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Add Design"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1">
        <div className="px-6 py-5 md:px-9 md:py-10 space-y-4 flex-1 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7.5 gap-y-5.25">
            {/* Attach Image */}
            <div className="space-y-1.5">
              <label className="text-[16px] font-medium text-primary-foreground block">
                Attach Image
              </label>
              <FileInput
                name="image"
                runForm={formik}
                icon={<AttachIcon width={16} height={16} color="#858585" />}
              />
            </div>

            {/* Design Id */}
            <div className="space-y-1.5">
              <label className="text-[16px] font-medium text-primary-foreground block">
                Design Id
              </label>
              <Input
                name="design_slug_id"
                placeholder="Design Id"
                className="h-11.25 border-muted-foreground rounded-md placeholder:text-muted-foreground placeholder:text-[14px] text-[14px]"
                runForm={formik}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[16px] font-medium text-primary-foreground block">
                Category
              </label>
              <FormSelect
                name="category"
                runForm={formik}
                options={categoryOptions}
                placeholder="Select category"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-[16px] font-medium text-primary-foreground block">
                Start Date
              </label>
              <FormDatePicker
                name="start_date"
                runForm={formik}
                placeholder="Select start date"
                calendarProps={{ disabled: { before: today } }}
              />
            </div>

            {/* Finish Date */}
            <div className="space-y-1.5">
              <label className="text-[16px] font-medium text-primary-foreground block">
                Finish Date
              </label>
              <FormDatePicker
                name="finish_date"
                runForm={formik}
                placeholder="Select finish date"
                calendarProps={{
                  disabled: { before: formik.values.start_date || today }
                }}
              />
            </div>

            {/* Target Date */}
            <div className="space-y-1.5">
              <label className="text-[16px] font-medium text-primary-foreground block">
                Target Date
              </label>
              <FormDatePicker
                name="target_date"
                runForm={formik}
                placeholder="Select target date"
                calendarProps={{
                  disabled: {
                    before: formik.values.finish_date || formik.values.start_date || today
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className=" px-6 py-3 md:px-[36px] md:py-[20px] flex justify-end">
          <Button
            type="submit"
            className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-11.25 px-8 rounded-md font-semibold text-[16px]"
          >
            Add
          </Button>
        </div>
      </form>
    </CommonModal>

  )
}
