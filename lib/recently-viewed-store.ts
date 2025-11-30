"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

interface RecentlyViewedItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  viewedAt: number;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  addItem: (product: Product) => void;
  clear: () => void;
}

const MAX_ITEMS = 10;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          // Remove if already exists
          const filtered = state.items.filter((item) => item.productId !== product.id);
          // Add to front
          const newItems = [
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              category: product.category,
              price: product.price,
              images: product.images,
              viewedAt: Date.now(),
            },
            ...filtered,
          ].slice(0, MAX_ITEMS);
          return { items: newItems };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed-storage",
    }
  )
);
