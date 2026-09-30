"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { INITIAL_PRODUCTS, Product } from "@/lib/data";
import { CartProvider } from "@/context/CartContext";

function HomePageContent() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch products:", err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#020914] text-white flex flex-col font-['Cairo']">
      {/* الهيدر العلوي وشريط الإشعارات */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* عنوان قسم المنتجات المتاحة */}
        <div className="text-center my-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
            المنتجات المتاحة 🎮
          </h1>
        </div>

        {/* شبكة عرض المنتجات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <CartProvider>
      <HomePageContent />
    </CartProvider>
  );
}
