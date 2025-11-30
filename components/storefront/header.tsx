"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  User,
  LogOut,
  Heart,
  Menu,
  X,
  ChevronRight,
  Package,
  MapPin,
  Settings,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function StorefrontHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const openCart = useCartStore((s) => s.openCart);
  const itemsCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop All" },
    { href: "/products?category=shirts", label: "Shirts" },
    { href: "/products?category=t-shirts", label: "T-Shirts" },
    { href: "/products?category=pants", label: "Pants" },
    { href: "/products?category=accessories", label: "Accessories" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
        {/* Announcement Bar */}
        <div className="bg-neutral-900 text-white text-center py-2 px-4">
          <p className="text-[10px] sm:text-xs font-medium tracking-wide">
            ✨ Free Shipping on Orders Over South India
          </p>
        </div>

        {/* Main Header */}
        <div className="border-b border-neutral-200">
          <div className="container-page flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-brand-accent/10 to-brand/10 flex items-center justify-center overflow-hidden border border-brand-accent/20 group-hover:border-brand-accent/40 transition-all">
                <Image
                  src="/logo-one-more-piece.png"
                  alt="One More Piece"
                  width={40}
                  height={40}
                  className="h-6 w-6 sm:h-8 sm:w-8 object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm sm:text-base font-bold text-neutral-900">One More Piece</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link href="/wishlist" className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors hidden sm:flex">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[1rem] flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                {session ? (
                  <>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <User className="h-5 w-5" />
                    </button>
                    {showUserMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 bg-white shadow-xl py-2 z-50">
                          <div className="px-4 py-3 border-b border-neutral-100">
                            <p className="text-sm font-semibold text-neutral-900 truncate">{session.user?.name}</p>
                            <p className="text-xs text-neutral-500 truncate">{session.user?.email}</p>
                          </div>
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                            <User className="h-4 w-4" /> My Profile
                          </Link>
                          <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                            <Package className="h-4 w-4" /> My Orders
                          </Link>
                          <Link href="/profile/addresses" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                            <MapPin className="h-4 w-4" /> My Addresses
                          </Link>
                          <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                            <Heart className="h-4 w-4" /> Wishlist
                          </Link>
                          {(session.user as any)?.role === "admin" && (
                            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-accent hover:bg-brand-accent/5 border-t border-neutral-100 mt-1" onClick={() => setShowUserMenu(false)}>
                              <Settings className="h-4 w-4" /> Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => { setShowUserMenu(false); signOut({ callbackUrl: "/" }); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-neutral-100 mt-1"
                          >
                            <LogOut className="h-4 w-4" /> Sign out
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link href="/auth/login" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <User className="h-5 w-5" />
                  </Link>
                )}
              </div>

              <button onClick={openCart} className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors" aria-label="Open cart">
                <ShoppingBag className="h-5 w-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[1rem] flex items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white px-1">
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowSearch(false)} />
          <div className="fixed inset-x-0 top-0 z-50 bg-white p-4 shadow-xl animate-slide-down">
            <form onSubmit={handleSearch} className="container-page">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 text-lg outline-none placeholder:text-neutral-400"
                />
                <button type="button" onClick={() => setShowSearch(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
              <Link href="/" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2">
                <Image src="/logo-one-more-piece.png" alt="One More Piece" width={32} height={32} className="h-8 w-8 object-cover" />
                <span className="font-bold text-neutral-900">One More Piece</span>
              </Link>
              <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <div className="space-y-1 px-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-100 rounded-lg">
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </Link>
                ))}
              </div>

              <div className="mt-6 px-4">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">My Account</p>
                <div className="space-y-1">
                  {session ? (
                    <>
                      <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg">
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg">
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                      <Link href="/wishlist" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg">
                        <Heart className="h-4 w-4" /> Wishlist ({wishlistCount})
                      </Link>
                      {(session.user as any)?.role === "admin" && (
                        <Link href="/admin/dashboard" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-accent hover:bg-brand-accent/5 rounded-lg">
                          <Settings className="h-4 w-4" /> Admin Dashboard
                        </Link>
                      )}
                      <button onClick={() => { setShowMobileMenu(false); signOut({ callbackUrl: "/" }); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </>
                  ) : (
                    <Link href="/auth/login" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-lg justify-center">
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slide-down { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        .animate-slide-down { animation: slide-down 0.2s ease-out; }
        @keyframes slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out; }
      `}</style>
    </>
  );
}
