import * as Yup from "yup"

export const imageValidation = Yup.mixed()
    .required("Image is required")
    .test("fileFormat", "Supported formats: JPEG, PNG, JPG, WEBP", (value) => {
        if (!value) return true
        const supportedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        return supportedFormats.includes(value.type)
    })

export const ImgAcceptType = "image/jpeg, image/png, image/jpg, image/webp"

export const PasswordValidation = Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")