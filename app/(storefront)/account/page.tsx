"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, User as UserIcon, MapPin } from "lucide-react";

export default function AccountOverviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/account");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6 py-4 sm:py-6 lg:py-8 animate-fade-up">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">My account</h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Welcome back, {session.user?.name || session.user?.email}
        </p>
      </div>
      
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <button className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 text-left hover:border-brand-accent transition-all group active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="rounded-lg sm:rounded-xl bg-brand/10 p-2.5 sm:p-3 group-hover:bg-brand-accent/10 transition-colors">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-brand-accent" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-900">My orders</p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1">Track orders from placed to delivered.</p>
            </div>
          </div>
        </button>
        
        <button className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 text-left hover:border-brand-accent transition-all group active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="rounded-lg sm:rounded-xl bg-brand/10 p-2.5 sm:p-3 group-hover:bg-brand-accent/10 transition-colors">
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-brand-accent" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-900">Profile</p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1">Manage your name, email, and contact details.</p>
            </div>
          </div>
        </button>
        
        <button className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 text-left hover:border-brand-accent transition-all group active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="rounded-lg sm:rounded-xl bg-brand/10 p-2.5 sm:p-3 group-hover:bg-brand-accent/10 transition-colors">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-brand-accent" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-900">Addresses</p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1">Save frequent addresses for faster checkout.</p>
            </div>
          </div>
        </button>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Account Details</h2>
        <dl className="space-y-2.5 sm:space-y-3">
          <div>
            <dt className="text-xs sm:text-sm text-neutral-500">Name</dt>
            <dd className="text-xs sm:text-sm font-medium text-neutral-900">{session.user?.name || "Not set"}</dd>
          </div>
          <div>
            <dt className="text-xs sm:text-sm text-neutral-500">Email</dt>
            <dd className="text-xs sm:text-sm font-medium text-neutral-900">{session.user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs sm:text-sm text-neutral-500">Account Type</dt>
            <dd className="text-xs sm:text-sm font-medium text-neutral-900 capitalize">
              {(session.user as any)?.role || "User"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
