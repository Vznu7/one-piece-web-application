import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@onemorpiece.com" },
    update: {},
    create: {
      email: "admin@onemorpiece.com",
      name: "Admin User",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create demo customer user
  const customerPassword = await bcrypt.hash("demo123", 10);
  const customer = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo Customer",
      password: customerPassword,
      role: "user",
    },
  });
  console.log("✅ Created demo customer:", customer.email);

  // Create products
  const products = [
    {
      slug: "midnight-crew-shirt",
      name: "Midnight Crew Shirt",
      description:
        "A sharp, tailored button-down in midnight black. Breathable cotton with subtle stretch for all-day comfort. Classic collar, minimal detailing—pairs effortlessly with any outfit.",
      price: 2499,
      category: "shirts",
      sizes: ["S", "M", "L", "XL"],
      images: ["placeholder-1.jpg"],
      inStock: true,
      featured: true,
      tags: ["new", "trending"],
    },
    {
      slug: "essential-cargo-pants",
      name: "Essential Cargo Pants",
      description:
        "Modern cargo pants with a clean silhouette. Multiple utility pockets, tapered fit, adjustable waist. Built for movement—casual enough for the street, refined enough for anywhere.",
      price: 3499,
      category: "pants",
      sizes: ["28", "30", "32", "34", "36"],
      images: ["placeholder-2.jpg"],
      inStock: true,
      featured: true,
      tags: ["trending"],
    },
    {
      slug: "signature-tee-black",
      name: "Signature Tee - Black",
      description:
        "Heavyweight cotton tee with a relaxed fit. Pre-washed for softness, reinforced neckline, and subtle branding. A foundational piece that holds its shape and color through countless wears.",
      price: 1299,
      category: "t-shirts",
      sizes: ["S", "M", "L", "XL", "XXL"],
      images: ["placeholder-3.jpg"],
      inStock: true,
      featured: false,
      tags: ["new"],
    },
    {
      slug: "minimalist-leather-wallet",
      name: "Minimalist Leather Wallet",
      description:
        "Slim bifold wallet in premium leather. Holds 6-8 cards, hidden cash compartment, and ages beautifully. Compact design fits front or back pocket without bulk.",
      price: 1999,
      category: "accessories",
      sizes: ["One Size"],
      images: ["placeholder-4.jpg"],
      inStock: true,
      featured: false,
      tags: [],
    },
    {
      slug: "oxford-dress-shirt-white",
      name: "Oxford Dress Shirt - White",
      description:
        "Classic white oxford in premium cotton. Button-down collar, slightly fitted cut. Perfect for office, events, or layering under blazers. Crisp and versatile.",
      price: 2799,
      category: "shirts",
      sizes: ["S", "M", "L", "XL"],
      images: ["placeholder-5.jpg"],
      inStock: true,
      featured: false,
      tags: [],
    },
    {
      slug: "slim-fit-chinos-khaki",
      name: "Slim Fit Chinos - Khaki",
      description:
        "Tailored chinos in stretch khaki. Modern slim fit with a mid-rise waist. Versatile enough for work or weekend—dress up or keep it casual.",
      price: 2999,
      category: "pants",
      sizes: ["28", "30", "32", "34", "36"],
      images: ["placeholder-6.jpg"],
      inStock: true,
      featured: false,
      tags: [],
    },
    {
      slug: "signature-tee-white",
      name: "Signature Tee - White",
      description:
        "The same heavyweight cotton as our black tee, now in clean white. Pre-washed, relaxed fit, and built to last. Simple, essential, and endlessly wearable.",
      price: 1299,
      category: "t-shirts",
      sizes: ["S", "M", "L", "XL", "XXL"],
      images: ["placeholder-7.jpg"],
      inStock: true,
      featured: false,
      tags: [],
    },
    {
      slug: "canvas-tote-bag",
      name: "Canvas Tote Bag",
      description:
        "Durable canvas tote with reinforced handles. Large main compartment, interior pocket for essentials. Perfect for daily carry, groceries, or gym gear.",
      price: 1499,
      category: "accessories",
      sizes: ["One Size"],
      images: ["placeholder-8.jpg"],
      inStock: true,
      featured: false,
      tags: ["new"],
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    console.log(`✅ Created product: ${created.name}`);
  }

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
