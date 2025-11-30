"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TrendingUp, Package, AlertCircle, ShoppingCart } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login?callbackUrl=/admin/dashboard");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") {
    return null;
  }

  const stats = [
    { label: "Total Sales", value: "₹24,590", icon: TrendingUp, color: "text-green-600" },
    { label: "Total Orders", value: "12", icon: ShoppingCart, color: "text-blue-600" },
    { label: "Total Products", value: "4", icon: Package, color: "text-purple-600" },
    { label: "Low Stock", value: "0", icon: AlertCircle, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 py-4 sm:py-6 lg:py-8 animate-fade-up">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Welcome back, {session.user?.name}! High-level view of One More Piece store performance.
        </p>
      </div>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4 lg:p-6 text-sm space-y-2 sm:space-y-3 hover:border-brand-accent/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-xs text-neutral-500">{stat.label}</p>
                <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-900">{stat.value}</p>
            </div>
          );
        })}
      </div>
      
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 text-sm h-48 sm:h-56 lg:h-64 flex flex-col">
          <h3 className="text-sm sm:text-base font-semibold text-neutral-900 mb-3 sm:mb-4">Sales over time</h3>
          <div className="flex-1 flex items-center justify-center text-xs sm:text-sm text-neutral-400">
            Chart placeholder - Connect to real data
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 text-sm h-48 sm:h-56 lg:h-64 flex flex-col">
          <h3 className="text-sm sm:text-base font-semibold text-neutral-900 mb-3 sm:mb-4">Orders by status</h3>
          <div className="flex-1 flex items-center justify-center text-xs sm:text-sm text-neutral-400">
            Chart placeholder - Connect to real data
          </div>
        </div>
      </div>
      
      <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 text-sm">
        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 mb-3 sm:mb-4">Recently placed orders</h3>
        <div className="text-[10px] sm:text-xs text-neutral-500 bg-neutral-50 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
          No orders yet. This table will list incoming orders once backend is connected.
        </div>
      </div>
    </div>
  );
}
