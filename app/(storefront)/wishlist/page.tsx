"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ArrowLeft, ExternalLink } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";

export default function WishlistPage() {
  const { items, removeItem, clear } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="container-page py-12 sm:py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
            <Heart className="h-12 w-12 text-neutral-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
            Your wishlist is empty
          </h1>
          <p className="text-neutral-600 mb-8">
            Save items you love to your wishlist and review them anytime you want.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            My Wishlist ({items.length} {items.length === 1 ? "item" : "items"})
          </h1>
        </div>
        <button
          onClick={clear}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.productId)}
              className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {/* Image */}
            <Link href={`/products/${item.slug}`} className="block aspect-[3/4] relative bg-neutral-100 overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="h-12 w-12" />
                </div>
              )}
            </Link>

            {/* Content */}
            <div className="p-4">
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                {item.category}
              </p>
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-medium text-neutral-900 line-clamp-2 mb-2 hover:text-brand-accent transition-colors">
                  {item.name}
                </h3>
              </Link>
              <p className="text-lg font-bold text-neutral-900 mb-4">
                ₹{item.price.toLocaleString("en-IN")}
              </p>

              {/* View Product Button */}
              <Link
                href={`/products/${item.slug}`}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition-all bg-neutral-900 text-white hover:bg-neutral-800 flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
