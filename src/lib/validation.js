import * as Yup from "yup"

export const imageValidation = Yup.mixed()
    .required("Image is required")
    .test("fileFormat", "Supported formats: JPEG, PNG, JPG, WEBP", (value) => {
        if (!value) return true
        const supportedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        return supportedFormats.includes(value.type)
    })

export const ImgAcceptType = "image/jpeg, image/png, image/jpg, image/webp"