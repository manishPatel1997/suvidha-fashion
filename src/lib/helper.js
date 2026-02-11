'use client'
import { getIn } from "formik";
import React from "react";
import { format } from "date-fns";

export const errorContainer = (form, field) => {
  if (form.touched[field] && form.errors[field]) {
    return React.createElement(
      "span",
      { className: "text-[#ff6b6b] text-xs" },
      form.errors[field],
    );
  }
  return null;
};

export const formAttr = (form, field) => ({
  onBlur: form.handleBlur(field), // Ensure field is passed to handleBlur
  onChange: form.handleChange(field), // Ensure field is passed to handleChange
  value: getIn(form.values, field) || "", // Use getIn for nested field access
});

export const modalOpen = (modal, value, setOpenModal) => {
  setOpenModal((prev) => ({
    ...prev,
    [modal]: value
  }))
}


export const statusColors = {
  Pending: "bg-[#858585] text-white",
  "In Process": "bg-[#EAB308] text-white",
  Completed: "bg-[#22C55E] text-white",
}

/**
 * Converts a plain object to FormData
 * @param {Object} obj - The object to convert
 * @returns {FormData} The resulting FormData object
 */
export const toFormData = (obj) => {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Check if it's a date field based on key name or type
    const isDateKey = key.includes("date") || key.includes("_at");

    if (value instanceof Date) {
      formData.append(key, format(value, "yyyy-MM-dd"));
    } else if (isDateKey && typeof value === 'string' && value.length > 0) {
      // Try to parse and format date strings for date-related keys
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        formData.append(key, format(parsedDate, "yyyy-MM-dd"));
      } else {
        formData.append(key, value);
      }
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};