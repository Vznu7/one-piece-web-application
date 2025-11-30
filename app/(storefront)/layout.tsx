import { ReactNode } from "react";
import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";
import { CartDrawer } from "@/components/storefront/cart-drawer";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background w-full max-w-[100vw] overflow-x-hidden">
      <StorefrontHeader />
      <main className="flex-1 w-full">
        {children}
      </main>
      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
