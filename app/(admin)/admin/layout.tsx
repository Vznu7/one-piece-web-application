import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        <AdminTopbar />
        <main className="p-4 sm:p-6 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
