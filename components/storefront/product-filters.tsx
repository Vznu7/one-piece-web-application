"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  categoryLabels: Record<string, string>;
  currentCategory?: string;
  currentSort: string;
  priceRange: { min: number; max: number };
}

export function ProductFilters({
  categories,
  categoryLabels,
  currentCategory,
  currentSort,
  priceRange,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A-Z" },
  ];

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const currentSortLabel = sortOptions.find((o) => o.value === currentSort)?.label || "Sort";

  return (
    <>
      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowSort(!showSort)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:border-neutral-300 transition-colors"
        >
          {currentSortLabel}
          <ChevronDown className={`h-4 w-4 transition-transform ${showSort ? "rotate-180" : ""}`} />
        </button>
        {showSort && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSort(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateSearchParams("sort", option.value);
                    setShowSort(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                    currentSort === option.value ? "bg-neutral-100 font-medium" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {/* Filter Sidebar */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateSearchParams("category", null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !currentCategory
                        ? "bg-neutral-900 text-white"
                        : "hover:bg-neutral-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateSearchParams("category", cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentCategory === cat
                          ? "bg-neutral-900 text-white"
                          : "hover:bg-neutral-100"
                      }`}
                    >
                      {categoryLabels[cat] || cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { label: "Under ₹1,000", max: 1000 },
                    { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
                    { label: "₹2,000 - ₹3,000", min: 2000, max: 3000 },
                    { label: "₹3,000 - ₹5,000", min: 3000, max: 5000 },
                    { label: "Over ₹5,000", min: 5000 },
                  ].map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (range.min) params.set("minPrice", range.min.toString());
                        else params.delete("minPrice");
                        if (range.max) params.set("maxPrice", range.max.toString());
                        else params.delete("maxPrice");
                        router.push(`/products?${params.toString()}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-neutral-100 transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateSearchParams("sort", option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentSort === option.value
                          ? "bg-neutral-900 text-white"
                          : "hover:bg-neutral-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200">
              <button
                onClick={() => {
                  router.push("/products");
                  setShowFilters(false);
                }}
                className="w-full py-3 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
