"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useRecentlyViewedStore } from "@/lib/recently-viewed-store";
import type { Product, Size } from "@/lib/types";
import {
  Heart,
  Share2,
  Truck,
  RefreshCcw,
  Shield,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Ruler,
  MapPin,
  Check,
  X,
  Minus,
  Plus,
} from "lucide-react";

interface ProductClientProps {
  product: Product;
}

export function ProductClient({ product }: ProductClientProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [showDescription, setShowDescription] = useState(true);
  const [showDelivery, setShowDelivery] = useState(false);
  
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const addToRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

  const isWishlisted = isInWishlist(product.id);

  useEffect(() => {
    addToRecentlyViewed(product);
  }, [product, addToRecentlyViewed]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize);
    }
    openCart();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize);
    }
    router.push("/checkout");
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const checkPincode = () => {
    if (!pincode || pincode.length !== 6) return;
    setPincodeStatus("checking");
    // Simulate API call
    setTimeout(() => {
      const available = Math.random() > 0.2; // 80% chance available
      setPincodeStatus(available ? "available" : "unavailable");
    }, 1000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  // Filter valid image URLs - accept both http and https, and also relative paths
  const validImages = product.images.filter((img) => 
    img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/"))
  );

  // Image navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neutral-500 mb-4 sm:mb-6 flex-wrap">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-900">Shop</Link>
          <span>/</span>
          <span className="text-neutral-900 truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image Gallery - Contained Carousel */}
          <div className="w-full">
            {/* Main Image Container */}
            <div className="relative w-full bg-neutral-100 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
              {validImages.length > 0 ? (
                <Image
                  src={validImages[selectedImage] || validImages[0]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                  No Image Available
                </div>
              )}
              
              {/* Left Arrow */}
              {validImages.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-700" />
                </button>
              )}
              
              {/* Right Arrow */}
              {validImages.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-neutral-700" />
                </button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all z-10 ${
                  isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              {/* Image Counter */}
              {validImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {selectedImage + 1} / {validImages.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {validImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-neutral-900"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name} ${idx + 1}`} 
                      fill 
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full space-y-4 sm:space-y-5">
            {/* Title & Price */}
            <div>
              <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wide mb-1">
                {product.category}
              </p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <p className="text-xl sm:text-2xl font-bold text-neutral-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <span className="text-xs sm:text-sm text-green-600 font-medium">Inclusive of all taxes</span>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-900">
                  Select Size {!selectedSize && <span className="text-red-500">*</span>}
                </p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size as Size)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 hover:border-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-900">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {product.inStock ? (
                  <span className="text-xs sm:text-sm text-green-600 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> In Stock
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-md hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full py-3 border-2 border-neutral-900 text-neutral-900 font-semibold rounded-md hover:bg-neutral-900 hover:text-white disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Buy Now
              </button>
              <button
                onClick={handleShare}
                className="w-full py-3 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Pincode Check */}
            <div className="p-3 sm:p-4 bg-neutral-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-neutral-900 font-medium text-sm">
                <MapPin className="w-4 h-4" />
                Check Delivery Availability
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ""));
                    setPincodeStatus("idle");
                  }}
                  placeholder="Enter Pincode"
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                />
                <button
                  onClick={checkPincode}
                  disabled={pincode.length !== 6 || pincodeStatus === "checking"}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors text-sm"
                >
                  {pincodeStatus === "checking" ? "..." : "Check"}
                </button>
              </div>
              {pincodeStatus === "available" && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Delivery available! 3-5 business days.
                </p>
              )}
              {pincodeStatus === "unavailable" && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <X className="w-3 h-3" /> Sorry, delivery not available.
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-200">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto text-neutral-700 mb-1" />
                <p className="text-[10px] sm:text-xs text-neutral-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <RefreshCcw className="w-5 h-5 mx-auto text-neutral-700 mb-1" />
                <p className="text-[10px] sm:text-xs text-neutral-600">Easy Returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto text-neutral-700 mb-1" />
                <p className="text-[10px] sm:text-xs text-neutral-600">Secure Payment</p>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-0">
              {/* Description */}
              <div className="border-b border-neutral-200">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="w-full flex items-center justify-between py-3"
                >
                  <span className="text-sm font-medium text-neutral-900">Description</span>
                  {showDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showDescription && (
                  <div className="pb-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {product.description || "No description available."}
                  </div>
                )}
              </div>

              {/* Delivery & Returns */}
              <div className="border-b border-neutral-200">
                <button
                  onClick={() => setShowDelivery(!showDelivery)}
                  className="w-full flex items-center justify-between py-3"
                >
                  <span className="text-sm font-medium text-neutral-900">Delivery & Returns</span>
                  {showDelivery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showDelivery && (
                  <div className="pb-3 text-xs sm:text-sm text-neutral-600 space-y-1">
                    <p>• Free shipping on orders over ₹2,500</p>
                    <p>• Standard delivery: 5-7 business days</p>
                    <p>• Easy 7-day returns & exchanges</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowSizeGuide(false)} />
          <div className="fixed inset-4 sm:inset-x-4 sm:top-1/2 sm:-translate-y-1/2 max-w-lg mx-auto bg-white rounded-xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Size Guide</h2>
                <button onClick={() => setShowSizeGuide(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-neutral-100">
                      <th className="px-3 py-2 text-left font-semibold">Size</th>
                      <th className="px-3 py-2 text-center font-semibold">Chest</th>
                      <th className="px-3 py-2 text-center font-semibold">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: "S", chest: "38", length: "27" },
                      { size: "M", chest: "40", length: "28" },
                      { size: "L", chest: "42", length: "29" },
                      { size: "XL", chest: "44", length: "30" },
                    ].map((row) => (
                      <tr key={row.size} className="border-b border-neutral-100">
                        <td className="px-3 py-2 font-medium">{row.size}</td>
                        <td className="px-3 py-2 text-center">{row.chest}&quot;</td>
                        <td className="px-3 py-2 text-center">{row.length}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
