import { Size } from "../src/generated/prisma";
import prisma from "../src/lib/prisma";

async function main() {
  // Seed Categories
  await prisma.category.createMany({
    data: [
      {
        name: "Sweaters",
        slug: "sweaters",
        description: "Cozy handmade crochet sweaters",
        image: "https://example.com/images/categories/sweaters.jpg",
      },
      {
        name: "Hats",
        slug: "hats",
        description: "Stylish crochet hats for all seasons",
        image: "https://example.com/images/categories/hats.jpg",
      },
      {
        name: "Bags",
        slug: "bags",
        description: "Durable and trendy crochet bags",
        image: "https://example.com/images/categories/bags.jpg",
      },
      {
        name: "Tops",
        slug: "tops",
        description: "Lightweight crochet tops for sunny days",
        image: "https://example.com/images/categories/tops.jpg",
      },
    ],
  });

  // Fetch categories
  const categories = await prisma.category.findMany();

  const sweaters = categories.find((c) => c.slug === "sweaters");
  const hats = categories.find((c) => c.slug === "hats");
  const bags = categories.find((c) => c.slug === "bags");
  const tops = categories.find((c) => c.slug === "tops");

  if (!sweaters || !hats || !bags || !tops)
    throw new Error("Some categories are missing");

  // Seed Products
  const products = [
    {
      name: "Chunky Winter Sweater",
      description: "Warm, thick sweater perfect for cold weather.",
      price: 59.99,
      isFeatured: true,
      categoryId: sweaters.id,
      images: [
        "https://example.com/images/products/winter-sweater-1.jpg",
        "https://example.com/images/products/winter-sweater-2.jpg",
      ],
      sizes: [Size.S, Size.M, Size.L],
    },
    {
      name: "Sunburst Crochet Hat",
      description: "Colorful, lightweight hat for sunny days.",
      price: 19.99,
      isFeatured: false,
      categoryId: hats.id,
      images: ["https://example.com/images/products/sunburst-hat-1.jpg"],
      sizes: [Size.S, Size.M],
    },
    {
      name: "Boho Market Bag",
      description: "Handcrafted bohemian-style market bag.",
      price: 34.5,
      isFeatured: true,
      categoryId: bags.id,
      images: [
        "https://example.com/images/products/boho-bag-1.jpg",
        "https://example.com/images/products/boho-bag-2.jpg",
      ],
      sizes: [], // No sizes for bags
    },
    {
      name: "Summer Lace Top",
      description: "Elegant crochet top made for warm weather.",
      price: 42.75,
      isFeatured: false,
      categoryId: tops.id,
      images: ["https://example.com/images/products/summer-top-1.jpg"],
      sizes: [Size.M, Size.L, Size.XL],
    },
    {
      name: "Cable Knit Hoodie",
      description: "Stylish hoodie with a crochet cable knit pattern.",
      price: 68.99,
      isFeatured: true,
      categoryId: sweaters.id,
      images: [
        "https://example.com/images/products/cable-knit-hoodie-1.jpg",
        "https://example.com/images/products/cable-knit-hoodie-2.jpg",
      ],
      sizes: [Size.M, Size.L, Size.XL, Size.XXL],
    },
  ];

  // Insert products
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId,
        images: {
          create: product.images.map((imageUrl) => ({ imageUrl })),
        },
        sizes: {
          create: product.sizes.map((size) => ({
            size,
            stock: Math.floor(Math.random() * 10) + 1, // random stock
          })),
        },
      },
    });
  }

  console.log("✅ Seeded categories and products.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
