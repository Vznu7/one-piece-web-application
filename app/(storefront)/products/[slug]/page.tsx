import { notFound } from "next/navigation";
import { ProductClient } from "./ProductClient";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const product = await prisma.product.findFirst({
    where: { slug: decodedSlug },
  });

  if (!product) {
    return notFound();
  }

  const typedProduct: Product = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description || "",
    category: product.category || "",
    price: product.price,
    images: product.images || [],
    sizes: (product.sizes || []) as Product["sizes"],
    inStock: product.inStock,
    tags: product.tags || undefined,
  };

  return <ProductClient product={typedProduct} />;
}

