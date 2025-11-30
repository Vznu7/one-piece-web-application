import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top spacing for the fixed header */}
        <div className="lg:hidden h-14 flex-shrink-0" />
        
        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
