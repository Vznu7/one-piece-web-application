import type { Metadata, Viewport } from "next";
import SessionProvider from "@/components/auth/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "One More Piece | Modern Fashion Store",
  description: "One More Piece – minimal, modern clothing and accessories.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
