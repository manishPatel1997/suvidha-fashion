'use client'
import { getIn } from "formik";
import React from "react";

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