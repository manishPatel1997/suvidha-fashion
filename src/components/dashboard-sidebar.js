"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useParams, useSearchParams } from "next/navigation"
import { ChevronRight, Settings } from "lucide-react"

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

import Cookies from "js-cookie"

/* ================= Menu Config ================= */
const MENU_ITEMS = [
  { name: "Home", href: "/dashboard", Icon: HomeIcon, hasArrow: false },
  // { name: "Order", href: "/order", Icon: OrderIcon, hasArrow: true },
  { name: "Fabric", href: "/fabric", Icon: FabricIcon, hasArrow: true },
  { name: "Yarn", href: "/yarn", Icon: YarnIcon, hasArrow: true },
  { name: "Sequence", href: "/sequence", Icon: SequenceIcon, hasArrow: true },
  { name: "People", href: "/people", Icon: PeopleIcon, hasArrow: true },
  { name: "Vendor", href: "/vendor", Icon: VendorIcon, hasArrow: true },
  { name: "Ideas", href: "/ideas", Icon: IdeasIcon, hasArrow: true },
  { name: "Sketches", href: "/sketches", Icon: SketchesIcon, hasArrow: true },
  { name: "Tasks", href: "/tasks", Icon: HomeIcon, hasArrow: false },
  { name: "Profile", href: "/profile", Icon: PeopleIcon, hasArrow: false },
  { name: "Settings", href: "/settings", Icon: Settings, hasArrow: false },
]

const PRE_PRODUCTION_MENU_ITEMS = [
  { name: "Pre-production", href: "/pre-production", Icon: SketchesIcon, hasArrow: true },
  { name: "Production", href: "/production", Icon: OrderIcon, hasArrow: true },
  { name: "Post production", href: "/post-production", Icon: FabricIcon, hasArrow: true },
]

const ROUTE_MODULE_MAP = {
  "/pre-production": "pre_production",
  "/production": "production",
  "/post-production": "post_production",
  "/fabric": "fabric",
  "/yarn": "yarn",
  "/sequence": "sequence",
  "/people": "user",
  "/vendor": "vendor",
  "/settings": "setting",
  "/tasks": "task",
  "/ideas": "ideas",
  "/sketches": "sketches"
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()

  const [moduleAccess, setModuleAccess] = React.useState([])
  const [userRole, setUserRole] = React.useState(null)
  React.useEffect(() => {
    try {
      const token = Cookies.get("token")
      if (token) {
        const payloadBase64 = token.split('.')[1]
        const decoded = JSON.parse(atob(payloadBase64))
        if (decoded?.module_access) {
          setModuleAccess(decoded.module_access.split(','))
        }
        if (decoded?.role) {
          setUserRole(decoded.role)
        }
      }
    } catch (e) {
      console.error('Failed to decode token:', e)
    }
  }, [])

  const isPreProductionPhase =
    pathname.startsWith("/pre-production") ||
    pathname.startsWith("/production") ||
    pathname.startsWith("/post-production")

  let baseMenuItems = isPreProductionPhase ? PRE_PRODUCTION_MENU_ITEMS : MENU_ITEMS

  let currentMenuItems = baseMenuItems.filter(item => {
    if (item.href === '/dashboard') {
      return userRole && userRole.toLowerCase() === 'admin'
    }

    const requiredModule = ROUTE_MODULE_MAP[item.href]
    if (requiredModule) {
      return moduleAccess.includes(requiredModule)
    }
    return true
  })

  const handleLogout = () => {
    Cookies.remove("token")
    window.location.reload()
  }

  return (
    <Sidebar collapsible="icon" className="border-none bg-transparent">
      {/* ================= Header ================= */}
      <SidebarHeader className="mt-2 border-b-2 border-border-design py-7 group-data-[collapsible=icon]:border-0">
        <Link href="/dashboard">
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
          {currentMenuItems.map(({ name, href, Icon, hasArrow }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href)

            let finalHref = href
            const isProductionLink = ["/pre-production", "/production", "/post-production"].includes(href)

            if (isProductionLink) {
              if (params?.id) {
                finalHref = `${href}/${params.id}`
              }
              const queryString = searchParams?.toString()
              if (queryString) {
                finalHref = `${finalHref}?${queryString}`
              }
            }

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
                    href={finalHref}
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
                          text-primary-foreground
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
              onClick={handleLogout}
              className="
          h-[40px]
          w-full
          rounded-md
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
