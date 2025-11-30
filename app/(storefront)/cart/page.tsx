"use client";

import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
 
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const freeShippingThreshold = 2500;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <h1 className="text-2xl font-semibold text-neutral-900">Your cart is empty</h1>
          <p className="text-neutral-500">
            Add some items from our collection to get started.
          </p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8 py-4 sm:py-8 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">Your cart</h1>
        <div className="space-y-3 sm:space-y-4">
          {items.map((item) => {
            const lineTotal = item.price * item.quantity;

            return (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-brand/20 to-brand-accent/20">
                  {item.images && item.images[0] && item.images[0].startsWith("http") ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-medium text-brand-dark">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm sm:text-base font-medium text-neutral-900 hover:text-brand-accent line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                      Size: {item.size} • {item.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-400 active:bg-neutral-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-400 active:bg-neutral-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                      <p className="text-sm sm:text-base font-medium text-neutral-900">
                        ₹{lineTotal.toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-neutral-400 hover:text-red-500 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 h-fit lg:sticky lg:top-24">
        <h2 className="text-base sm:text-lg font-semibold text-neutral-900">Summary</h2>
        <div className="space-y-2 text-xs sm:text-sm text-neutral-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                `₹${shipping}`
              )}
            </span>
          </div>
          {subtotal < freeShippingThreshold && shipping > 0 && (
            <p className="text-[11px] sm:text-xs text-neutral-500 py-2">
              Add ₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")} more for free shipping within India!
            </p>
          )}
          <div className="flex justify-between font-medium text-neutral-900 border-t border-neutral-200 pt-3 mt-2 text-sm sm:text-base">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <Link href="/checkout" className="block">
          <Button className="w-full text-sm sm:text-base">Proceed to Checkout</Button>
        </Link>
        <Link
          href="/products"
          className="block text-center text-xs sm:text-sm text-neutral-600 hover:text-neutral-900"
        >
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}
