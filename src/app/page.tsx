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
import { AdminDashboardModal } from "@/components/AdminDashboardModal";
import { Product, INITIAL_PRODUCTS, ShowcaseConfig, DEFAULT_SHOWCASE } from "@/lib/data";

// العبارات القديمة الأصلية للإشعارات
const OLD_NOTIFICATIONS = [
  "أسعارنا أحسن من غيرنا.. تصفح الأقسام وقارن بنفسك! 💰",
  "نورتنا يا زائرنا الكريم، جاهز لترفع مستواك؟ ✨",
  "أهلاً بك في متجر Nitro Games، عروض ممتازة بانتظارك! 🎮",
  "بعدك ما نقّيت عتادك الاحترافي؟ تصفح المنتجات الآن ⚡",
  "توصيل سريع لكافة مناطق فلسطين والداخل المحتل 🚚",
  "ضمان حقيقي لمدة سنة كاملة على جميع المنتجات 🛡️",
  "أقوى كيبوردات وماوسات الجيمنج صارت بين ايديك 🔥",
  "خدمة العملاء جاهزة لمساعدتك بأي وقت.. لا تتردد بالسؤال 💬"
];

function NitroGamesApp() {
  const { showToast } = useCart();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [showcase, setShowcase] = useState<ShowcaseConfig>(DEFAULT_SHOWCASE);

  // نظام تدوير الإشعارات القديمة تلقائياً ووضعها بعيداً عن الواتساب
  const [currentNotifIndex, setCurrentNotifIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotifIndex((prev) => (prev + 1) % OLD_NOTIFICATIONS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Wrapped setters: update UI state AND mirror to localStorage as a fast-paint
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

  // Showcase config effect
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

  // Products effect
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

  // Secret shortcut: Ctrl + Shift + A
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
      {/* Animated Stars Background */}
      <div className="stars-background" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 40px 70px, #00d2ff, rgba(0,0,0,0)),
          radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 160px 120px, #7000ff, rgba(0,0,0,0))
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        animation: 'moveStars 100s linear infinite',
        opacity: 0.4,
        pointerEvents: 'none'
      }} />

      <style jsx global>{`
        @keyframes moveStars {
          from { background-position: 0 0; }
          to { background-position: 0 10000px; }
        }
      `}</style>

      {/* Animated aurora backdrop */}
      <div className="aurora-stage relative z-10">
        <div className="tech-grid" />
        <div className="aurora-blob" style={{ width: 420, height: 420, top: "-8%", right: "6%", background: "#00a3ff" }} />
        <div className="aurora-blob" style={{ width: 380, height: 380, top: "-35%", left: "4%", background: "#00e5ff", animationDelay: "-6s" }} />
        <div className="aurora-blob" style={{ width: 340, height: 340, bottom: "-6%", right: "28%", background: "#5b8cff", animationDelay: "-12s" }} />
      </div>

      {/* شريط الإشعارات القديم بتصميم أنيق ومناسب (بعيد عن زر الواتساب في الجانب الآخر) */}
      <div className="fixed bottom-4 left-4 z-40 max-w-xs sm:max-w-sm animate-fade-in-down">
        <div className="px-4 py-2.5 rounded-xl panel border-[#00a3ff]/40 bg-[#070b14]/95 text-white text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#00a3ff] animate-pulse shrink-0" />
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
