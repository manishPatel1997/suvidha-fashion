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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-295.5 w-[90%] lg:w-full p-0 border-none bg-[#FFFFFF] shadow-none rounded-design overflow-hidden block!"
        showCloseButton={false}
      >
        {/* <div className="relative w-full min-h-fit flex items-center justify-center px-4 py-6 lg:px-23.2 lg:py-21"> */}
        <div className="relative w-full min-h-fit flex items-center justify-center
                px-2 py-3 sm:px-4 sm:py-6 lg:px-23.2 lg:py-21">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-6 right-6 md:top-8 md:right-10 text-primary-foreground hover:opacity-70 transition-opacity z-20"
          >
            <CloseIcon width={17} height={17} color="#1a1a1a" />
          </button>

          <div className="border-2 border-[#dcccbd] rounded-[20px] overflow-hidden bg-white w-full max-w-248.5 flex flex-col">
            <DialogHeader className="m-0 p-0">
              <DialogTitle className="text-[20px] p-2.5 font-semibold text-center font-sans tracking-wide text-primary-foreground bg-[#F8F5F2] border-b-2 border-[#dcccbd]">
                Add Design
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1">
              <div className="px-6 py-5 md:px-9 md:py-10 space-y-4 flex-1 overflow-y-auto max-h-[60vh] md:max-h-none">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7.5 gap-y-3.75">
                  {/* Attach Image */}
                  <div className="space-y-1.5">
                    <label className="text-[16px] font-medium text-primary-foreground block">
                      Attach Image
                    </label>
                    <div className="relative">
                      <div className="flex items-center gap-3 border border-muted-foreground rounded-md px-4 h-11.25 bg-white">
                        <AttachIcon width={16} height={16} color="#858585" />
                        <span className="text-[14px] text-muted-foreground font-sans">
                          {formik.values.attachImage || "Attach file"}
                        </span>
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) formik.setFieldValue("attachImage", file.name)
                        }}
                      />
                    </div>
                    {formik.touched.attachImage && formik.errors.attachImage && (
                      <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.attachImage}</p>
                    )}
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
                    <Select
                      onValueChange={(value) => formik.setFieldValue("category", value)}
                      value={formik.values.category}
                    >
                      <SelectTrigger className="h-11.25! px-4 py-1 border-muted-foreground rounded-md text-muted-foreground text-[14px] w-full bg-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#F8F5F2] border-[#dcccbd]">
                        <SelectItem value="concept" className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground">Concept</SelectItem>
                        <SelectItem value="regular" className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground">Regular</SelectItem>
                        <SelectItem value="cutting" className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground">Cutting</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.category}</p>
                    )}
                  </div>

                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <label className="text-[16px] font-medium text-primary-foreground block">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11.25 border-muted-foreground rounded-md text-left font-normal px-4 bg-white justify-between",
                            !formik.values.startDate && "text-muted-foreground"
                          )}
                        >
                          <span className="text-[14px]">
                            {formik.values.startDate ? format(formik.values.startDate, "PPP") : "Select start date"}
                          </span>
                          <CalendarIcon width={16} height={16} color="#858585" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formik.values.startDate}
                          onSelect={(date) => formik.setFieldValue("startDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.startDate && formik.errors.startDate && (
                      <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.startDate}</p>
                    )}
                  </div>

                  {/* Finish Date */}
                  <div className="space-y-1.5">
                    <label className="text-[16px] font-medium text-primary-foreground block">
                      Finish Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11.25 border-muted-foreground rounded-md text-left font-normal px-4 bg-white justify-between",
                            !formik.values.finishDate && "text-muted-foreground"
                          )}
                        >
                          <span className="text-[14px]">
                            {formik.values.finishDate ? format(formik.values.finishDate, "PPP") : "Select finish date"}
                          </span>
                          <CalendarIcon width={16} height={16} color="#858585" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formik.values.finishDate}
                          onSelect={(date) => formik.setFieldValue("finishDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.finishDate && formik.errors.finishDate && (
                      <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.finishDate}</p>
                    )}
                  </div>

                  {/* Target Date */}
                  <div className="space-y-1.5">
                    <label className="text-[16px] font-medium text-primary-foreground block">
                      Target Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11.25 border-muted-foreground rounded-md text-left font-normal px-4 bg-white justify-between",
                            !formik.values.targetDate && "text-muted-foreground"
                          )}
                        >
                          <span className="text-[14px]">
                            {formik.values.targetDate ? format(formik.values.targetDate, "PPP") : "Select target date"}
                          </span>
                          <CalendarIcon width={16} height={16} color="#858585" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formik.values.targetDate}
                          onSelect={(date) => formik.setFieldValue("targetDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.targetDate && formik.errors.targetDate && (
                      <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.targetDate}</p>
                    )}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


// "use client"

// import * as React from "react"
// import { useFormik } from "formik"
// import * as Yup from "yup"
// import { format } from "date-fns"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { cn } from "@/lib/utils"
// import { formAttr } from "@/lib/helper"
// import AttachIcon from "@/assets/AttachIcon"
// import CloseIcon from "@/assets/CloseIcon"
// import CalendarIcon from "@/assets/CalendarIcon"

// const validationSchema = Yup.object().shape({
//   attachImage: Yup.mixed().required("Image is required"),
//   designId: Yup.string().required("Design Id is required"),
//   category: Yup.string().required("Category is required"),
//   startDate: Yup.date().required("Start date is required"),
//   finishDate: Yup.date()
//     .required("Finish date is required")
//     .min(Yup.ref('startDate'), "Finish date cannot be before start date"),
//   targetDate: Yup.date().required("Target date is required"),
// })

// export function AddDesignModal({ open, onOpenChange }) {
//   const formik = useFormik({
//     initialValues: {
//       attachImage: "",
//       designId: "",
//       category: "",
//       startDate: null,
//       finishDate: null,
//       targetDate: null,
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       console.log("Form values:", values)
//       onOpenChange(false)
//       formik.resetForm()
//     },
//   })

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent 
//         className="max-w-[95vw] sm:max-w-[900px] p-0 border-none bg-[#FFFFFF] shadow-none rounded-design overflow-hidden !block"
//         showCloseButton={false}
//       >
//         <div className="relative w-full min-h-[500px] flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
//           <button 
//             onClick={() => onOpenChange(false)}
//             className="absolute top-4 right-4 sm:top-6 sm:right-6 text-primary-foreground hover:opacity-70 transition-opacity z-20"
//           >
//             <CloseIcon width={17} height={17} color="#1a1a1a" />
//           </button>

//           <div className="border-2 border-[#dcccbd] rounded-[20px] overflow-hidden bg-white w-full max-w-full min-h-[400px] flex flex-col justify-center">
//             <DialogHeader className="mb-6">
//               <DialogTitle className="text-[20px] p-2.5 font-semibold text-center font-sans tracking-wide text-primary-foreground bg-[#F8F5F2] border-b-2 border-[#dcccbd]">
//                 Add Design
//               </DialogTitle>
//             </DialogHeader>

//             <form onSubmit={formik.handleSubmit} className="space-y-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-6">
//                 {/* Attach Image */}
//                 <div className="space-y-2">
//                   <label className="text-[16px] font-medium text-primary-foreground block">
//                     Attach Image
//                   </label>
//                   <div className="relative">
//                     <div className="flex items-center gap-3 border border-muted-foreground rounded-md px-4 h-11.25 bg-white">
//                       <AttachIcon width={16} height={16} color="#858585" />
//                       <span className="text-[14px] text-muted-foreground font-sans">
//                         {formik.values.attachImage || "Attach file"}
//                       </span>
//                     </div>
//                     <input
//                       type="file"
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       onChange={(e) => {
//                         const file = e.target.files[0]
//                         if (file) formik.setFieldValue("attachImage", file.name)
//                       }}
//                     />
//                   </div>
//                   {formik.touched.attachImage && formik.errors.attachImage && (
//                     <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.attachImage}</p>
//                   )}
//                 </div>

//                 {/* Design Id */}
//                 <div className="space-y-2">
//                   <label className="text-[16px] font-medium text-primary-foreground block">
//                     Design Id
//                   </label>
//                   <Input
//                     name="designId"
//                     placeholder="Design Id"
//                     className="h-11.25 border-muted-foreground rounded-md placeholder:text-muted-foreground placeholder:text-[14px] text-[14px]"
//                     runForm={formik}
//                   />
//                 </div>

//                 {/* Category */}
//                 <div className="space-y-2">
//                   <label className="text-[16px] font-medium text-primary-foreground block">
//                     Category
//                   </label>
//                   <Select
//                     onValueChange={(value) => formik.setFieldValue("category", value)}
//                     value={formik.values.category}
//                   >
//                     <SelectTrigger className="!h-11.25 px-4 py-1 border-muted-foreground rounded-md text-muted-foreground text-[14px] w-full bg-white">
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-[#F8F5F2] border-[#dcccbd]">
//                       <SelectItem value="concept" className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground">Concept</SelectItem>
//                       <SelectItem value="regular" className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground">Regular</SelectItem>
//                       <SelectItem value="cutting" className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground">Cutting</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {formik.touched.category && formik.errors.category && (
//                     <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.category}</p>
//                   )}
//                 </div>

//                 {/* Start Date */}
//                 <div className="space-y-2">
//                   <label className="text-[16px] font-medium text-primary-foreground block">
//                     Start Date
//                   </label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full h-11.25 border-muted-foreground rounded-md text-left font-normal px-4 bg-white justify-between",
//                           !formik.values.startDate && "text-muted-foreground"
//                         )}
//                       >
//                         <span className="text-[14px]">
//                           {formik.values.startDate ? format(formik.values.startDate, "PPP") : "Select start date"}
//                         </span>
//                         <CalendarIcon width={16} height={16} color="#858585" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={formik.values.startDate}
//                         onSelect={(date) => formik.setFieldValue("startDate", date)}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   {formik.touched.startDate && formik.errors.startDate && (
//                     <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.startDate}</p>
//                   )}
//                 </div>

//                 {/* Finish Date */}
//                 <div className="space-y-2">
//                   <label className="text-[16px] font-medium text-primary-foreground block">
//                     Finish Date
//                   </label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full h-11.25 border-muted-foreground rounded-md text-left font-normal px-4 bg-white justify-between",
//                           !formik.values.finishDate && "text-muted-foreground"
//                         )}
//                       >
//                         <span className="text-[14px]">
//                           {formik.values.finishDate ? format(formik.values.finishDate, "PPP") : "Select finish date"}
//                         </span>
//                         <CalendarIcon width={16} height={16} color="#858585" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={formik.values.finishDate}
//                         onSelect={(date) => formik.setFieldValue("finishDate", date)}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   {formik.touched.finishDate && formik.errors.finishDate && (
//                     <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.finishDate}</p>
//                   )}
//                 </div>

//                 {/* Target Date */}
//                 <div className="space-y-2">
//                   <label className="text-[16px] font-medium text-primary-foreground block">
//                     Target Date
//                   </label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full h-11.25 border-muted-foreground rounded-md text-left font-normal px-4 bg-white justify-between",
//                           !formik.values.targetDate && "text-muted-foreground"
//                         )}
//                       >
//                         <span className="text-[14px]">
//                           {formik.values.targetDate ? format(formik.values.targetDate, "PPP") : "Select target date"}
//                         </span>
//                         <CalendarIcon width={16} height={16} color="#858585" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={formik.values.targetDate}
//                         onSelect={(date) => formik.setFieldValue("targetDate", date)}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   {formik.touched.targetDate && formik.errors.targetDate && (
//                     <p className="text-[#ff6b6b] text-xs mt-1">{formik.errors.targetDate}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-end pt-4">
//                 <Button
//                   type="submit"
//                   className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground h-11.25 px-8 rounded-md font-semibold text-[16px]"
//                 >
//                   Add
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }