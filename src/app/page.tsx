"use client";

import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrustBadges } from "@/components/TrustBadges";
import { DealsSection } from "@/components/DealsSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductSection } from "@/components/ProductSection";
import { CustomerReviews } from "@/components/CustomerReviews";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { QuickViewModal } from "@/components/QuickViewModal";
import { LiveSalesToast } from "@/components/LiveSalesToast";
import { FloatingActions } from "@/components/FloatingActions";
import AdminDashboardModal from "@/components/AdminDashboardModal";
import { Product, INITIAL_PRODUCTS, ShowcaseConfig, DEFAULT_SHOWCASE } from "@@/lib/data"; // أو "@/lib/data" حسب مشروعك

// عبارات الشريط السفلي القديم (تم جعل النصوص أقصر وأكثر دقة)
const OLD_NOTIFICATIONS = [
  "أسعارنا تنافسية.. قارن بنفسك! 💰",
  "أهلاً بك في متجر Nitro Games ✨",
  "توصيل سريع لكافة مناطق فلسطين 🚚",
  "ضمان حقيقي لمدة سنة كاملة 🛡️",
  "أقوى عتاد الجيمنج بين إيديك 🔥"
];

function NitroGamesApp() {
  const { showToast } = useCart();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [showcase, setShowcase] = useState<ShowcaseConfig>(DEFAULT_SHOWCASE);

  // تدوير الإشعارات القديمة
  const [currentNotifIndex, setCurrentNotifIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotifIndex((prev) => (prev + 1) % OLD_NOTIFICATIONS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const applyProducts = (list: Product[]) => {
    setProducts(list);
    try {
      localStorage.setItem("nitro_products_v2", JSON.stringify(list));
    } catch (e) {
      console.warn(e);
    }
  };

  const applyShowcase = (cfg: ShowcaseConfig) => {
    setShowcase(cfg);
    try {
      localStorage.setItem("nitro_showcase_v2", JSON.stringify(cfg));
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nitro_showcase_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setShowcase({ ...DEFAULT_SHOWCASE, ...parsed });
        }
      }
    } catch (e) {
      console.warn(e);
    }
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
      console.warn(e);
    }
  }, []);

  // Shortcut Ctrl + Shift + A
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

  return (
    <div className="min-h-screen bg-[#05070d] text-gray-100 flex flex-col justify-between selection:bg-[#00a3ff] selection:text-black relative overflow-x-hidden" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* الشريط القديم مصغر جداً وفي أقصى الزاوية السفلية اليسرى */}
      <div className="fixed bottom-2 left-2 z-40 max-w-[200px] pointer-events-none">
        <div className="px-2 py-1 rounded bg-[#070b14]/80 border border-[#00a3ff]/20 text-gray-300 text-[10px] flex items-center gap-1.5 shadow backdrop-blur-sm">
          <span className="w-1 h-1 rounded-full bg-[#00a3ff] animate-ping shrink-0" />
          <span className="truncate">{OLD_NOTIFICATIONS[currentNotifIndex]}</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header
          onSearchChange={(q) => setSearchQuery(q)}
          onCategorySelect={(cat) => setSelectedCategory(cat)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        <main className="flex-1 relative z-10">
          <HeroSection
            products={products}
            showcase={showcase}
            onCategorySelect={(cat) => setSelectedCategory(cat)}
          />
          <TrustBadges />
          <DealsSection products={products} />
          <CategoryGrid
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
          <ProductSection
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            searchQuery={searchQuery}
          />
          <CustomerReviews />
          <NewsletterSection />
        </main>

        <Footer onOpenAdmin={() => setIsAdminOpen(true)} onSelectCategory={(cat) => setSelectedCategory(cat)} />
      </div>

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
