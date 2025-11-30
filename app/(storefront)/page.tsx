import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Truck, RefreshCcw, Shield, Star } from "lucide-react";

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[85vh] bg-neutral-100 overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/769731/pexels-photo-769731.jpeg"
          alt="One More Piece Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-page">
            <div className="max-w-xl text-white space-y-6">
              <p className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-white/80">
                New Collection 2025
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Elevate Your Everyday Style
              </h1>
              <p className="text-base sm:text-lg text-white/90 max-w-md">
                Discover timeless pieces crafted with precision and care. Minimal design, maximum impact.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products?tag=new"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-neutral-900 text-white py-4 sm:py-5">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-neutral-400" />
              <span className="text-xs sm:text-sm font-medium">Free Shipping ₹2,500+</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCcw className="h-5 w-5 text-neutral-400" />
              <span className="text-xs sm:text-sm font-medium">7-Day Easy Returns</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-neutral-400" />
              <span className="text-xs sm:text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-neutral-400" />
              <span className="text-xs sm:text-sm font-medium">Premium Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-page">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Shop by Category</h2>
            <p className="text-neutral-500">Find your perfect fit</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { slug: "shirts", label: "Shirts", image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg" },
              { slug: "t-shirts", label: "T-Shirts", image: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg" },
              { slug: "pants", label: "Pants", image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg" },
              { slug: "accessories", label: "Accessories", image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{cat.label}</h3>
                  <span className="text-xs sm:text-sm text-white/80 group-hover:text-white flex items-center gap-1 transition-colors">
                    Shop Now <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-neutral-50">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">New Arrivals</h2>
              <p className="text-neutral-500">Fresh styles just dropped</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => {
              const validImage = product.images?.find((img) => img.startsWith("http"));
              return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-200 mb-3">
                  {validImage ? (
                    <Image
                      src={validImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-400 bg-gradient-to-br from-neutral-100 to-neutral-200">
                      <span className="text-4xl font-bold text-neutral-300">{product.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">{product.category}</p>
                  <h3 className="font-medium text-neutral-900 line-clamp-2 group-hover:text-neutral-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-semibold text-neutral-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
              );
            })}
          </div>
          <Link
            href="/products"
            className="sm:hidden mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/5864240/pexels-photo-5864240.jpeg"
                alt="One More Piece Brand"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-neutral-500">
                About Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                Designed for the Modern Individual
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                At One More Piece, we believe in the power of thoughtful design. Every piece in our collection is crafted with intention—from the selection of premium fabrics to the precision of every stitch.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Our mission is simple: create timeless, versatile clothing that empowers you to express your unique style without compromising on comfort or quality.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                Explore Our Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-16 lg:py-20 bg-neutral-900 text-white">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Join the One More Piece Family</h2>
            <p className="text-neutral-300">
              Subscribe to get early access to new arrivals, exclusive offers, and style inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:border-white/50"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-neutral-500">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
