"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import FallBackImg from "./FallBackImage"
import SmallLogo from "@/assets/small_logo.svg"

import HomeIcon from "@/assets/HomeIcon"
import OrderIcon from "@/assets/OrderIcon"
import FabricIcon from "@/assets/FabricIcon"
import YarnIcon from "@/assets/YarnIcon"
import SequenceIcon from "@/assets/SequenceIcon"
import PeopleIcon from "@/assets/PeopleIcon"
import VendorIcon from "@/assets/VendorIcon"
import IdeasIcon from "@/assets/IdeasIcon"
import SketchesIcon from "@/assets/SketchesIcon"
import LogOutIcon from "@/assets/LogOutIcon"

/* ================= Menu Config ================= */
const MENU_ITEMS = [
  { name: "Home", href: "/dashboard", Icon: HomeIcon, hasArrow: false },
  { name: "Order", href: "/order", Icon: OrderIcon, hasArrow: true },
  { name: "Fabric", href: "/fabric", Icon: FabricIcon, hasArrow: true },
  { name: "Yarn", href: "/yarn", Icon: YarnIcon, hasArrow: true },
  { name: "Sequence", href: "/sequence", Icon: SequenceIcon, hasArrow: true },
  { name: "People", href: "/people", Icon: PeopleIcon, hasArrow: true },
  { name: "Vendor", href: "/vendor", Icon: VendorIcon, hasArrow: true },
  { name: "Ideas", href: "/ideas", Icon: IdeasIcon, hasArrow: true },
  { name: "Sketches", href: "/sketches", Icon: SketchesIcon, hasArrow: true },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-none bg-transparent">
      {/* ================= Header ================= */}
      <SidebarHeader className="mt-2 border-b-2 border-border-design py-7 group-data-[collapsible=icon]:border-0">
        <Link href="/user-profile">
          <div className="px-4 group-data-[collapsible=icon]:hidden">
            <FallBackImg className="w-[179px] h-[56px]" IsEager={true} />
          </div>
          <div className="hidden group-data-[collapsible=icon]:flex justify-center">
            <FallBackImg alt="Small Logo" src={SmallLogo} IsEager={true} />
          </div>
        </Link>
      </SidebarHeader>

      {/* ================= Content ================= */}
      <SidebarContent className="pt-6 px-4.5 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          {MENU_ITEMS.map(({ name, href, Icon, hasArrow }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href)

            return (
              <SidebarMenuItem key={href} className="group/menu-item">
                <SidebarMenuButton
                  asChild
                  className={`
                    h-[40px] w-full rounded-[8px]
                    flex items-center px-4
                    transition-all

                    ${isActive
                      ? "bg-[#E5DFDB]"
                      : "hover:bg-[#E5DFDB]"
                    }

                    group-data-[collapsible=icon]:w-[40px]
                    group-data-[collapsible=icon]:px-0
                    group-data-[collapsible=icon]:justify-center
                  `}
                >
                  <Link
                    href={href}
                    className="relative flex items-center w-full gap-3 group-data-[collapsible=icon]:justify-center"
                  >
                    {/* Active / Hover Indicator */}
                    <div
                      className={`
                        absolute left-0 top-[6px] bottom-[6px] w-[3px]
                        rounded-r bg-[#b0826a]
                        transition-opacity
                        ${isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover/menu-item:opacity-100"
                        }
                        group-data-[collapsible=icon]:hidden
                      `}
                    />

                    {/* Left Icon */}
                    <Icon className="h-[18px] w-[18px] text-[#b0826a]" />

                    {/* Label */}
                    <span className="flex-1 text-[18px] group-data-[collapsible=icon]:hidden">
                      {name}
                    </span>

                    {/* Right Chevron */}
                    {hasArrow && (
                      <ChevronRight
                        className="
                          h-[16px] w-[16px]
                          text-[#1a1a1a]
                          opacity-60
                          group-hover/menu-item:opacity-100
                          group-data-[collapsible=icon]:hidden
                        "
                      />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto pb-6">
        <SidebarMenu>
          <SidebarMenuItem
            className="
        px-[19px]
        group/menu-item

        group-data-[collapsible=icon]:px-0
        group-data-[collapsible=icon]:flex
        group-data-[collapsible=icon]:justify-center
      "
          >
            <SidebarMenuButton
              className="
          h-[40px]
          w-full
          rounded-[6px]
          flex items-center gap-3
          px-[15px]
          text-[#c26b6e]
          border-none
          transition-all
          hover:bg-red-50

          group-data-[collapsible=icon]:w-[40px]
          group-data-[collapsible=icon]:px-0
          group-data-[collapsible=icon]:justify-center
          cursor-pointer
        "
            >
              <LogOutIcon className="h-[16px] w-[16px] shrink-0" />

              <span className="text-[18px] font-medium group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
