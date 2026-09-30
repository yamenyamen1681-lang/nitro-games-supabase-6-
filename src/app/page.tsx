"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { INITIAL_PRODUCTS, DEFAULT_SHOWCASE, Product } from "@/lib/data";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // جلب المنتجات من قاعدة البيانات إذا توفرت
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
        console.warn("Failed to fetch dynamic products, using fallback data:", err);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#020914] text-white flex flex-col font-['Cairo']">
      {/* الهيدر العلوي */}
      <Header />

      {/* الجزء الرئيسي - الهيرو */}
      <main className="flex-1">
        <HeroSection
          products={products}
          showcase={DEFAULT_SHOWCASE}
          onCategorySelect={(cat) => setSelectedCategory(cat)}
        />

        {/* قسم المنتجات */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              المنتجات المتاحة 🎮
            </h2>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 font-tech">
              لا توجد منتجات متوفرة حالياً في القسم المختار.
            </div>
          )}
        </section>
      </main>

      {/* سلة المشتريات والفوتر */}
      <CartDrawer />
      <Footer />
    </div>
  );
}
