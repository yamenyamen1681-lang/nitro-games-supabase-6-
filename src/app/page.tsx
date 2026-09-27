"use client";

import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DealsSection } from "@/components/DealsSection";
import { ProductSection } from "@/components/ProductSection";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { QuickViewModal } from "@/components/QuickViewModal";
import { LiveSalesToast } from "@/components/LiveSalesToast";
import { FloatingActions } from "@/components/FloatingActions";
import { AdminDashboardModal } from "@/components/AdminDashboardModal";
import { CustomerReviews } from "@/components/CustomerReviews";
import { CyberBackground } from "@/components/CyberBackground"; // استدعاء خلفية السايبر القوية
import { Product, INITIAL_PRODUCTS, ShowcaseConfig, DEFAULT_SHOWCASE } from "@/lib/data";

function NitroGamesApp() {
  const { toastMessage, showToast } = useCart();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [showcase, setShowcase] = useState<ShowcaseConfig>(DEFAULT_SHOWCASE);

  const applyProducts = (list: Product[]) => {
    setProducts(list);
    try {
      localStorage.setItem("nitro_products_v2", JSON.stringify(list));
    } catch (e) {
      console.warn("Storage cache error:", e);
    }
  };

  const applyShowcase = (cfg: ShowcaseConfig) => {
    setShowcase(cfg);
    try {
      localStorage.setItem("nitro_showcase_v2", JSON.stringify(cfg));
    } catch (e) {
      console.warn("Storage cache error:", e);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nitro_showcase_v2");
      if (raw) {
        const parsed = JSON.parse(raw) as ShowcaseConfig;
        if (parsed && typeof parsed === "object") {
          setShowcase({ ...DEFAULT_SHOWCASE, ...parsed });
        }
      }
    } catch (e) {
      console.warn("showcase config parse error:", e);
    }

    async function loadShowcaseFromApi() {
      try {
        const res = await fetch("/api/settings?key=showcase", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.value) {
          applyShowcase({ ...DEFAULT_SHOWCASE, ...data.value });
        }
      } catch (err) {
        console.warn("Using cached showcase config:", err);
      }
    }
    loadShowcaseFromApi();
  }, []);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("nitro_products_v2");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.warn("localStorage parse error:", e);
    }

    async function loadFromApi() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (data.products?.length) {
          applyProducts(data.products);
        }
      } catch (err) {
        console.warn("Using bundled products:", err);
      }
    }
    loadFromApi();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // تصفية المنتجات التي توجد بها خصومات أو عروض خاصة لتقديمها في قسم العروض
  const dealProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="min-h-screen bg-[#03060c] text-gray-100 flex flex-col justify-between selection:bg-[#00a3ff] selection:text-black relative overflow-x-hidden">
      
      {/* 🌟 خلفية السايبر التفاعلية القوية */}
      <CyberBackground />

      {/* التنبيهات المنبثقة (Toast) */}
      {toastMessage && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm">
          <div className="px-4 py-3 rounded-2xl bg-[#0b1120]/95 border border-[#00a3ff]/60 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(0,163,255,0.4)] backdrop-blur-md text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a3ff] animate-ping shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* الهيدر العلوي المحدث والمستجيب */}
      <Header
        onSearchChange={(q) => setSearchQuery(q)}
        onCategorySelect={(cat) => setSelectedCategory(cat)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* المحتوى الرئيسي للمتجر */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 space-y-12 my-6">
        <HeroSection
          products={products}
          showcase={showcase}
          onCategorySelect={(cat) => setSelectedCategory(cat)}
        />
        
        {/* قسم العروض الفلاش الأسطوري الجديد */}
        <DealsSection dealProducts={dealProducts.length > 0 ? dealProducts : products} />

        <ProductSection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          searchQuery={searchQuery}
        />
        <CustomerReviews />
      </main>

      {/* الفوتر وسلة المشتريات والنوافذ المنبثقة */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} onSelectCategory={(cat) => setSelectedCategory(cat)} />

      <CartDrawer />
      <CheckoutModal />
      <QuickViewModal />
      <LiveSalesToast />
      <FloatingActions />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onProductsUpdate={applyProducts}
        showToast={showToast}
        showcase={showcase}
        onShowcaseUpdate={applyShowcase}
      />
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <NitroGamesApp />
    </CartProvider>
  );
}
