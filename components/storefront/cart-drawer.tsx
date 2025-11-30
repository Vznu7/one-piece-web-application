"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const freeShippingThreshold = 2500;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 99;
  const total = subtotal + shipping;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-neutral-700" />
            <h2 className="text-lg font-semibold text-neutral-900">
              Shopping Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {subtotal < freeShippingThreshold && (
          <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-neutral-600">
                Add ₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")} more for FREE shipping
              </span>
              <span className="text-neutral-500">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-accent to-brand rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {subtotal >= freeShippingThreshold && (
          <div className="px-4 py-3 bg-green-50 border-b border-green-100">
            <p className="text-sm text-green-700 font-medium text-center">
              🎉 You&apos;ve unlocked FREE shipping!
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
              <p className="text-lg font-medium text-neutral-900 mb-2">Your bag is empty</p>
              <p className="text-sm text-neutral-500 mb-6">
                Looks like you haven&apos;t added anything to your bag yet.
              </p>
              <Link 
                href="/products" 
                onClick={closeCart}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-3 pb-4 border-b border-neutral-100"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100"
                    >
                      {item.images && item.images[0]?.startsWith("http") ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-neutral-400 text-xs">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="text-sm font-medium text-neutral-900 hover:text-brand-accent line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Size: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-neutral-200 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.size, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-1.5 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.size, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-neutral-100 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-semibold text-neutral-900">
                          ₹{lineTotal.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with totals and checkout */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-4 py-4 space-y-4 bg-white">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link 
                href="/checkout" 
                onClick={closeCart}
                className="flex items-center justify-center w-full h-11 px-6 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex items-center justify-center w-full h-11 px-6 border border-neutral-300 text-neutral-900 text-sm font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
