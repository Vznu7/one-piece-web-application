"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: CartItem["size"]) => void;
  removeItem: (productId: string, size: CartItem["size"]) => void;
  updateQuantity: (productId: string, size: CartItem["size"], quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
  items: [],
  addItem: (product, size) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.productId === product.id && item.size === size
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            price: product.price,
            images: product.images,
            size,
            quantity: 1,
          },
        ],
      };
    }),
  removeItem: (productId, size) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.productId === productId && item.size === size)
      ),
    })),
  updateQuantity: (productId, size, quantity) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),
  clear: () => set({ items: [] }),
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
