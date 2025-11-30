"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const exists = state.items.find((item) => item.productId === product.id);
          if (exists) return state;
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
                addedAt: Date.now(),
              },
            ],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
);
