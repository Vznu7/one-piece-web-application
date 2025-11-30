"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Box, Layers, Settings, ShoppingBag, Menu, X, Home } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/inventory", label: "Inventory", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header Bar - Always visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-neutral-950 flex items-center justify-between px-4 shadow-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -ml-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wider text-white uppercase">
            One Piece
          </span>
          <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-400">
            Admin
          </span>
        </div>
        
        <Link 
          href="/" 
          className="p-2 -mr-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label="Go to store"
        >
          <Home className="h-5 w-5" />
        </Link>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-neutral-950 text-neutral-100 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Desktop Header */}
        <div className="hidden lg:flex h-16 items-center px-5 border-b border-neutral-800">
          <span className="text-sm font-semibold tracking-[0.3em] uppercase">
            One Piece
          </span>
          <span className="ml-2 rounded-full border border-neutral-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-400">
            Admin
          </span>
        </div>

        {/* Mobile: Add top padding for the header */}
        <div className="lg:hidden h-14" />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-neutral-900 font-semibold shadow-lg"
                    : "text-neutral-300 hover:bg-white/10 hover:text-white active:bg-white/20"
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-neutral-900" : ""}`} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-sm">Back to Store</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
