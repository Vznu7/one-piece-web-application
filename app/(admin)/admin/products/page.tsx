"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Search, Package, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  images: string[];
  inStock: boolean;
  createdAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All" },
    { id: "shirts", name: "Shirts" },
    { id: "pants", name: "Pants" },
    { id: "t-shirts", name: "T-Shirts" },
    { id: "accessories", name: "Accessories" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-300 border-t-neutral-900 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/products/new")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800"
        >
          <PlusCircle className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600 font-medium">No products found</p>
          <p className="text-sm text-neutral-400 mt-1">
            {searchQuery || categoryFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Add your first product to get started"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/products/new")}
            className="mt-4"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all duration-200 group"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-neutral-100">
                {product.images.length > 0 && product.images[0].startsWith("http") ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-neutral-300" />
                  </div>
                )}

                {/* Stock Badge */}
                <div className="absolute top-3 left-3">
                  {product.inStock ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500 text-white shadow-sm">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-500 text-white shadow-sm">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Desktop: Hover Actions */}
                <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                    className="p-3 bg-white rounded-full hover:bg-neutral-100 transition-colors shadow-lg"
                  >
                    <Pencil className="w-5 h-5 text-neutral-700" />
                  </button>
                  <button
                    onClick={() => router.push(`/products/${product.slug}`)}
                    className="p-3 bg-white rounded-full hover:bg-neutral-100 transition-colors shadow-lg"
                  >
                    <Eye className="w-5 h-5 text-neutral-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-3 bg-white rounded-full hover:bg-red-50 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">{product.name}</h3>
                    <p className="text-xs text-neutral-500 capitalize mt-0.5">{product.category}</p>
                  </div>
                  <p className="text-lg font-bold text-neutral-900 flex-shrink-0">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Mobile: Action Buttons */}
                <div className="flex gap-2 mt-4 sm:hidden">
                  <button
                    onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
