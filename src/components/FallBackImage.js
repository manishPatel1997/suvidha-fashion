'use client'
import Image from "next/image";
import FALLBACK_IMAGE from "@/assets/logo.svg"

const FallBackImg = ({ src, alt, className = "",IsEager=false }) => {
    return (
        <>
            <Image
                src={src || FALLBACK_IMAGE}
                alt={alt || "logo"}
                width={100}
                // unoptimized
                height={100}
                loading={IsEager ?"eager" : "lazy" }
                className={`${className || ""}`}
            />
        </>
    );
};

export default FallBackImg
// 'use client'
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const FallBackImg = ({ src, alt, className = "" }) => {
//     const FALLBACK_IMAGE = "/no_img.webp";
//     const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE);

//     const isValidUrl = (url) => {
//         if (!url || typeof url !== 'string' || url.trim() === '') {
//             return false;
//         }
//         try {
//             new URL(url);
//             return true;
//         } catch {
//             return false;
//         }
//     };

//     useEffect(() => {
//         const sourceUrl = `${process.env.NEXT_PUBLIC_API_URL}/${src}` && typeof src === 'string' && src.trim() !== '' ? `${process.env.NEXT_PUBLIC_API_URL}/${src}` : null;
//         if (sourceUrl && isValidUrl(sourceUrl)) {
//             const img = new window.Image();
//             img.onload = () => {
//                 setImgSrc(sourceUrl);
//             };
//             img.onerror = () => {
//                 setImgSrc(FALLBACK_IMAGE);
//             };
//             img.src = sourceUrl;
//             // setImgSrc(`${process.env.NEXT_PUBLIC_API_URL}/${sourceUrl}`)
//         } else {
//             setImgSrc(FALLBACK_IMAGE);
//         }
//     }, [src]);
//     return (
//         <>
//             <Image
//                 src={imgSrc}
//                 alt={alt || "logo"}
//                 width={100}
//                 // unoptimized
//                 height={100}
//                 className={`w-[50px] h-[50px] sm:w-[100px] sm:h-[100px] bg-contain rounded-xl ${className || ""}`}
//             />
//         </>
//     );
// };

// export default FallBackImg