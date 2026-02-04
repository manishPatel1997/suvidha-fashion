import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
    return (
        <>
            <SidebarProvider>
                <DashboardSidebar />
                <main className="p-2 sm:p-4 md:p-8 bg-white flex-1 min-w-0">
                    <div className="px-2 sm:px-4 md:px-6 py-4 sm:py-8 max-w-full min-w-0 overflow-visible">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </>
    )
}