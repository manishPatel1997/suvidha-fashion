'use client'
import Image from "next/image";
import FALLBACK_IMAGE from "@/assets/logo.svg"

const FallBackImg = ({ src, alt, className = "", IsEager = false }) => {
    return (
        <>
            <Image
                src={src || FALLBACK_IMAGE}
                alt={alt || "logo"}
                width={100}
                // unoptimized
                height={100}
                loading={IsEager ? "eager" : "lazy"}
                className={`${className || ""}`}
            />
        </>
    );
};

export default FallBackImg