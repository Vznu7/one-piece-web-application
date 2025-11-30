import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Heart, SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, X } from "lucide-react";
import { ProductFilters } from "@/components/storefront/product-filters";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams?.category === "string" ? searchParams.category : undefined;
  const search = typeof searchParams?.search === "string" ? searchParams.search : undefined;
  const sort = typeof searchParams?.sort === "string" ? searchParams.sort : "newest";
  const minPrice = typeof searchParams?.minPrice === "string" ? parseInt(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams?.maxPrice === "string" ? parseInt(searchParams.maxPrice) : undefined;

  // Build where clause
  const where: any = {};
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Build orderBy
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  else if (sort === "price-high") orderBy = { price: "desc" };
  else if (sort === "name") orderBy = { name: "asc" };

  // Fetch products from database
  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  // Get all unique categories and price range
  const allProducts = await prisma.product.findMany();
  const categories = [...new Set(allProducts.map((p) => p.category))];
  const prices = allProducts.map((p) => p.price);
  const priceRange = { min: Math.min(...prices), max: Math.max(...prices) };

  const categoryLabels: Record<string, string> = {
    shirts: "Shirts",
    pants: "Pants",
    "t-shirts": "T-Shirts",
    accessories: "Accessories",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[200px] sm:h-[280px] bg-neutral-900 overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/5864240/pexels-photo-5864240.jpeg"
          alt="Shop Collection"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            {category ? categoryLabels[category] || "Shop" : search ? `Search: "${search}"` : "All Products"}
          </h1>
          <p className="text-sm sm:text-base text-white/80">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </p>
        </div>
      </div>

      <div className="container-page py-6 sm:py-8">
        {/* Active Filters & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <Link
                href={`/products${search ? `?search=${search}` : ""}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-full text-sm hover:bg-neutral-200 transition-colors"
              >
                {categoryLabels[category]}
                <X className="h-3 w-3" />
              </Link>
            )}
            {search && (
              <Link
                href={`/products${category ? `?category=${category}` : ""}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 rounded-full text-sm hover:bg-neutral-200 transition-colors"
              >
                Search: {search}
                <X className="h-3 w-3" />
              </Link>
            )}
            {!category && !search && (
              <span className="text-sm text-neutral-500">Showing all products</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ProductFilters
              categories={categories}
              categoryLabels={categoryLabels}
              currentCategory={category}
              currentSort={sort}
              priceRange={priceRange}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <Link
            href="/products"
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {categoryLabels[cat] || cat}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-neutral-400 mb-4">
              <Grid3X3 className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-500 mb-6">Try adjusting your filters or search terms</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const validImages = product.images?.filter((img) => img.startsWith("http")) || [];
              return (
              <div key={product.id} className="group">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 mb-3">
                    {validImages.length > 0 ? (
                      <>
                        <Image
                          src={validImages[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {validImages.length > 1 && (
                          <Image
                            src={validImages[1]}
                            alt={product.name}
                            fill
                            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                        <span className="text-4xl font-bold text-neutral-300">{product.name.charAt(0)}</span>
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-100 transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Stock Status */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white text-neutral-900 text-sm font-semibold rounded">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="space-y-1">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">
                    {categoryLabels[product.category] || product.category}
                  </p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-neutral-900 line-clamp-2 group-hover:text-neutral-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-semibold text-neutral-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
