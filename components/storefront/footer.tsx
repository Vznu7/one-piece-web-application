import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function StorefrontFooter() {
  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo-one-more-piece.png"
                  alt="One More Piece"
                  width={40}
                  height={40}
                  className="h-8 w-8 object-cover"
                />
              </div>
              <span className="text-lg font-bold">One More Piece</span>
            </Link>
            <p className="text-neutral-400 text-sm max-w-sm">
              Discover timeless fashion pieces crafted with precision and care. 
              Minimal design, maximum impact for the modern individual.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/products?category=shirts" className="hover:text-white transition-colors">Shirts</Link>
              </li>
              <li>
                <Link href="/products?category=t-shirts" className="hover:text-white transition-colors">T-Shirts</Link>
              </li>
              <li>
                <Link href="/products?category=pants" className="hover:text-white transition-colors">Pants</Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link>
              </li>
              <li>
                <Link href="/products?tag=new" className="hover:text-white transition-colors">New Arrivals</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">Track Order</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Shipping Info</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Returns & Exchange</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Size Guide</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>support@onemorepiece.in</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
            </ul>
            <div className="pt-4">
              <p className="text-xs text-neutral-500 mb-2">Working Hours</p>
              <p className="text-sm text-neutral-400">Mon - Sat: 10:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-white/10">
        <div className="container-page py-4 sm:py-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
            <p className="text-xs sm:text-sm text-neutral-500">We accept</p>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 rounded text-[10px] sm:text-xs font-medium">UPI</div>
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 rounded text-[10px] sm:text-xs font-medium">Paytm</div>
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 rounded text-[10px] sm:text-xs font-medium">PhonePe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-page py-4">
          <div className="flex flex-col items-center gap-3 text-[10px] sm:text-xs text-neutral-500 sm:flex-row sm:justify-between">
            <p className="text-center">© {new Date().getFullYear()} One More Piece. All rights reserved.</p>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
