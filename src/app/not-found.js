"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to profile after 5 seconds
    const timer = setTimeout(() => {
      router.push("/profile");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f2] px-4 font-sans text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-[30px] shadow-sm border border-[#e4e4e7] flex flex-col items-center gap-6">
        <div className="relative">
          <h1 className="text-[120px] font-extrabold leading-none text-[#dcccbd] opacity-40">
            404
          </h1>
          <h2 className="text-3xl font-bold text-[#1a1a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full whitespace-nowrap">
            Page Not Found
          </h2>
        </div>
        
        <p className="text-[#858585] text-[18px]">
          The page you are looking for doesn't exist or has been moved. You will be redirected to your profile shortly.
        </p>

        <Link
          href="/profile"
          className="mt-2 flex items-center justify-center gap-3 w-full py-4 bg-[#b0826a] text-white rounded-[8px] hover:bg-[#9a6e57] transition-colors duration-300 font-medium text-[18px]"
        >
          Go to Profile
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
