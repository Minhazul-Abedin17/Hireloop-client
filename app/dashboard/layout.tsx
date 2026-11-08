
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "../components/DashboardSIdebar";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <main className="min-h-svh min-w-0 flex-1 bg-[#0b0b10] text-white">

        <div className="flex h-14 items-center border-b border-white/10 px-4">
          <SidebarTrigger className="text-white hover:bg-white/10" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>

      </main>
    </SidebarProvider>
  );
}
