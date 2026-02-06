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

const validationSchema = Yup.object().shape({
  attachImage: Yup.mixed().required("Image is required"),
  designId: Yup.string().required("Design Id is required"),
  category: Yup.string().required("Category is required"),
  startDate: Yup.date().required("Start date is required"),
  finishDate: Yup.date()
    .required("Finish date is required")
    .min(Yup.ref('startDate'), "Finish date cannot be before start date"),
  targetDate: Yup.date().required("Target date is required"),
})

export function AddDesignModal({ open, onOpenChange, onAdd }) {
  const formik = useFormik({
    initialValues: {
      attachImage: "",
      designId: "",
      category: "",
      startDate: null,
      finishDate: null,
      targetDate: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form values:", values)
      if (onAdd) onAdd(values)
      onOpenChange(false)
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
                name="attachImage"
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
                name="designId"
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
                name="startDate"
                runForm={formik}
                placeholder="Select start date"
              />
            </div>

            {/* Finish Date */}
            <div className="space-y-1.5">
              <label className="text-[16px] font-medium text-primary-foreground block">
                Finish Date
              </label>
              <FormDatePicker
                name="finishDate"
                runForm={formik}
                placeholder="Select finish date"
              />
            </div>

            {/* Target Date */}
            <div className="space-y-1.5">
              <label className="text-[16px] font-medium text-primary-foreground block">
                Target Date
              </label>
              <FormDatePicker
                name="targetDate"
                runForm={formik}
                placeholder="Select target date"
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
