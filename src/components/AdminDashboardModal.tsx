"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, CategoryType, CATEGORIES_META, ShowcaseConfig, DEFAULT_SHOWCASE } from "@/lib/data";
import {
  X,
  Lock,
  Unlock,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  Search,
  LogOut,
  Zap,
  ShieldAlert,
  Monitor,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Music
} from "lucide-react";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdate: (updatedList: Product[]) => void;
  showToast: (msg: string) => void;
  showcase?: ShowcaseConfig;
  onShowcaseUpdate?: (cfg: ShowcaseConfig) => void;
}

const PRESET_IMAGES = [
  { label: "كيبورد RGB", url: "/images/keyboard-custom-rgb.jpg" },
  { label: "ماوس 8K", url: "/images/mouse-pro-8k.jpg" },
  { label: "ماوس باد ياباني", url: "/images/mousepad-pro.jpg" },
  { label: "ماوس باد سرعة", url: "/images/mousepad-speed.jpg" },
  { label: "مايكروفون استوديو", url: "/images/microphone-pro.jpg" },
  { label: "سماعة محيطية", url: "/images/headset-pro.jpg" },
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsUpdate,
  showToast,
  showcase,
  onShowcaseUpdate,
}) => {
  // ===== Featured Showcase editor state =====
  const [tab, setTab] = useState<"products" | "showcase" | "audio">("products");
  const [sc, setSc] = useState<ShowcaseConfig>(showcase ?? DEFAULT_SHOWCASE);
  const [pickerCat, setPickerCat] = useState<string>("all");
  const [pickerQuery, setPickerQuery] = useState("");

  // Keep local editor in sync when opened / config changes externally
  React.useEffect(() => {
    if (isOpen && showcase) setSc(showcase);
  }, [isOpen, showcase]);

  const commitShowcase = (next: ShowcaseConfig) => {
    setSc(next);
    // Optimistic UI update (also caches locally via the parent's applyShowcase)
    onShowcaseUpdate?.(next);
    // Persist to the database so it syncs to every device/browser
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "showcase", value: next }),
    }).catch((err) => {
      console.warn("Showcase save error:", err);
      showToast("تعذر حفظ إعدادات المربع المميز في قاعدة البيانات ⚠️");
    });
  };

  const togglePick = (id: number) => {
    const has = sc.productIds.includes(id);
    const ids = has ? sc.productIds.filter((x) => x !== id) : [...sc.productIds, id];
    commitShowcase({ ...sc, productIds: ids });
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const arr = [...sc.productIds];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    commitShowcase({ ...sc, productIds: arr });
  };

  const removeFromShowcase = (id: number) =>
    commitShowcase({ ...sc, productIds: sc.productIds.filter((x) => x !== id) });

  const pickerList = products
    .filter((p) => (pickerCat === "all" ? true : p.category === pickerCat))
    .filter((p) => p.title.toLowerCase().includes(pickerQuery.toLowerCase()));

  const showcaseProducts = sc.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Product form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryType>("keyboards");
  const [price, setPrice] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/keyboard-custom-rgb.jpg");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<{ type: "image" | "video"; url: string }[]>([]);
  const [isUploadingGalleryItem, setIsUploadingGalleryItem] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);

  const handleGalleryFileUpload = async (file: File | undefined | null) => {
    if (!file) return;
    setGalleryUploadError(null);
    setIsUploadingGalleryItem(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "upload failed");
      const type: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
      setGallery((prev) => [...prev, { type, url: data.url }]);
    } catch (err) {
      console.warn("Gallery upload error:", err);
      setGalleryUploadError("تعذر رفع الملف — تأكد إنه صورة أو فيديو وحجمه أقل من 4MB");
    } finally {
      setIsUploadingGalleryItem(false);
    }
  };

  const removeGalleryItem = (idx: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== idx));
  };
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [newVideoUrlInput, setNewVideoUrlInput] = useState("");

  // Site background music (separate from the showcase video)
  const [siteAudioUrl, setSiteAudioUrl] = useState<string>("");
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  React.useEffect(() => {
    if (tab !== "audio" || audioLoaded) return;
    (async () => {
      try {
        const res = await fetch("/api/settings?key=site_audio", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.value?.url) setSiteAudioUrl(data.value.url);
      } catch (err) {
        console.warn("Failed to load site audio setting:", err);
      } finally {
        setAudioLoaded(true);
      }
    })();
  }, [tab, audioLoaded]);

  const saveSiteAudio = async (url: string) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "site_audio", value: { url: url || null } }),
      });
      showToast(url ? "تم حفظ الموسيقى — بتشتغل عند كل الزوار 🎵" : "تم إيقاف موسيقى الموقع");
    } catch (err) {
      console.warn("Failed to save site audio setting:", err);
      showToast("تعذر حفظ إعدادات الموسيقى ⚠️");
    }
  };

  const handleAudioFileUpload = async (file: File | undefined | null) => {
    if (!file) return;
    setAudioUploadError(null);
    setIsUploadingAudio(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "upload failed");
      setSiteAudioUrl(data.url);
      await saveSiteAudio(data.url);
    } catch (err) {
      console.warn("Audio upload error:", err);
      setAudioUploadError("تعذر رفع الملف — تأكد إنه صوت وحجمه أقل من 4MB");
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleVideoFileUpload = async (file: File | undefined | null) => {
    if (!file) return;
    setVideoUploadError(null);
    setIsUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "upload failed");
      const nextUrls = [...(sc.videoUrls ?? []), data.url];
      setSc({ ...sc, videoUrls: nextUrls });
      commitShowcase({ ...sc, videoUrls: nextUrls });
    } catch (err) {
      console.warn("Video upload error:", err);
      setVideoUploadError("تعذر رفع الفيديو — تأكد إنه أقل من 4MB");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const removeShowcaseVideo = (idx: number) => {
    const nextUrls = (sc.videoUrls ?? []).filter((_, i) => i !== idx);
    setSc({ ...sc, videoUrls: nextUrls });
    commitShowcase({ ...sc, videoUrls: nextUrls });
  };

  const addShowcaseVideoUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const nextUrls = [...(sc.videoUrls ?? []), trimmed];
    setSc({ ...sc, videoUrls: nextUrls });
    commitShowcase({ ...sc, videoUrls: nextUrls });
  };

  const handleFileUpload = async (file: File | undefined | null) => {
    if (!file) return;
    setUploadError(null);
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "upload failed");
      setImageUrl(data.url);
    } catch (err) {
      console.warn("Image upload error:", err);
      setUploadError("تعذر رفع الملف — تأكد إنه صورة أو فيديو وحجمه أقل من 4MB");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Admin filter & search
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = passwordInput.trim();
    // Secret admin password strictly Yamen2009Yamen
    if (entered === "Yamen2009Yamen") {
      setIsAuthenticated(true);
      setAuthError("");
      setPasswordInput("");
      showToast("تم التحقق بنجاح.. أهلاً بك في لوحة تحكم المشرف ⚡");
    } else {
      setAuthError("كلمة المرور غير صحيحة! يرجى إعادة المحاولة.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEditingProduct(null);
    onClose();
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setCategory(prod.category);
    setPrice(String(prod.price));
    setOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : "");
    setDescription(prod.description);
    setBrand(prod.brand);
    setBadge(prod.badge || "");
    setImageUrl(prod.image);
    setGallery(prod.gallery ?? []);
    // Scroll form into view
    const formElem = document.getElementById("admin-product-form");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setTitle("");
    setPrice("");
    setOriginalPrice("");
    setDescription("");
    setBrand("");
    setBadge("");
    setImageUrl("/images/keyboard-custom-rgb.jpg");
    setGallery([]);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert("يرجى إدخال اسم المنتج والسعر بالشيكل ₪");
      return;
    }

    const numPrice = Number(price);
    const numOrigPrice = originalPrice ? Number(originalPrice) : undefined;
    const discount =
      numOrigPrice && numOrigPrice > numPrice
        ? Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)
        : 0;

    if (editingProduct) {
      // Persist to the database first — this is the source of truth every
      // device reads from, so we wait for it before updating the UI.
      try {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProduct.id,
            title: title.trim(),
            category,
            price: numPrice,
            originalPrice: numOrigPrice,
            description: description.trim(),
            brand: brand.trim() || "Nitro Games",
            badge: badge.trim() || null,
            image: imageUrl.trim(),
            gallery,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "update failed");

        const updatedProducts = products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                title: title.trim(),
                category,
                price: numPrice,
                originalPrice: numOrigPrice,
                discountPercent: discount,
                description: description.trim(),
                brand: brand.trim() || "Nitro Games",
                badge: badge.trim() || undefined,
                image: imageUrl.trim() || "/images/keyboard-custom-rgb.jpg",
                gallery,
              }
            : p
        );
        onProductsUpdate(updatedProducts);
        showToast(`تم تحديث بيانات "${title.slice(0, 24)}..." على كل الأجهزة! 💾`);
      } catch (err) {
        console.warn("Product update error:", err);
        showToast("تعذر حفظ التعديل في قاعدة البيانات — حاول مرة أخرى ⚠️");
        return;
      }
    } else {
      // Insert in the database first so every device gets the same real ID
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            category,
            price: numPrice,
            originalPrice: numOrigPrice,
            description: description.trim(),
            brand: brand.trim() || "Nitro Games",
            badge: badge.trim() || "جديد بالمتجر ⭐",
            image: imageUrl.trim(),
            gallery,
          }),
        });
        const data = await res.json();
        if (!data.success || !data.product) throw new Error(data.message || "insert failed");

        onProductsUpdate([data.product as Product, ...products]);
        showToast(`تمت إضافة "${title.slice(0, 24)}..." إلى المتجر على كل الأجهزة! 🚀`);
      } catch (err) {
        console.warn("Product insert error:", err);
        showToast("تعذر إضافة المنتج في قاعدة البيانات — حاول مرة أخرى ⚠️");
        return;
      }
    }

    cancelEdit();
  };

  const handleDeleteProduct = async (id: number, prodTitle: string) => {
    if (!confirm(`هل أنت متأكد من حذف المنتج: "${prodTitle}" من المتجر نهائياً؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "delete failed");

      onProductsUpdate(products.filter((p) => p.id !== id));
      showToast("تم حذف المنتج من المتجر على كل الأجهزة 🗑️");
    } catch (err) {
      console.warn("Product delete error:", err);
      showToast("تعذر حذف المنتج من قاعدة البيانات — حاول مرة أخرى ⚠️");
    }
  };

  const filteredList = products
    .filter((p) => (filterCategory === "all" ? true : p.category === filterCategory))
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#0b1120] border border-[#00a3ff]/30 shadow-[0_0_40px_rgba(0,163,255,0.2)] overflow-hidden my-8 text-right">
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-[#1c2942] bg-[#120e09] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1e170e] text-gray-400 hover:text-white hover:bg-[#253048] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500/25 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white font-['Cairo']">لوحة تحكم إدارة المتجر السرية</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00a3ff]/15 text-[#00a3ff] border border-[#00a3ff]/30 font-mono">
                  ADMIN ONLY
                </span>
              </div>
              <div className="text-xs text-gray-400">
                إدارة كاملة لمنتجات NITRO GAMES (إضافة، تعديل، وحذف)
              </div>
            </div>

            <div className="w-11 h-11 rounded-xl bg-[#1e170e] border border-[#00a3ff]/40 flex items-center justify-center text-[#00a3ff] shadow-[0_0_15px_rgba(0,163,255,0.3)]">
              {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Tab switcher (only after login) */}
        {isAuthenticated && (
          <div className="px-6 pt-5 flex items-center gap-2 border-b border-[#1c2942]">
            <button
              onClick={() => setTab("products")}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl cursor-pointer transition-all flex items-center gap-2 ${
                tab === "products"
                  ? "bg-[#0b1120] text-[#00a3ff] border-x border-t border-[#1c2942]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إدارة المنتجات</span>
            </button>
            <button
              onClick={() => setTab("showcase")}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl cursor-pointer transition-all flex items-center gap-2 ${
                tab === "showcase"
                  ? "bg-[#0b1120] text-[#00a3ff] border-x border-t border-[#1c2942]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>المربع المميز (الشاشة الرئيسية)</span>
            </button>
            <button
              onClick={() => setTab("audio")}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl cursor-pointer transition-all flex items-center gap-2 ${
                tab === "audio"
                  ? "bg-[#0b1120] text-[#00a3ff] border-x border-t border-[#1c2942]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>موسيقى الموقع</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        {!isAuthenticated ? (
          /* Login Form - Strict and secure, no visible password leak */
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#1e170e] border border-[#00a3ff]/30 flex items-center justify-center mx-auto text-[#00a3ff] shadow-[0_0_20px_rgba(0,163,255,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white font-['Cairo']">منطقة المشرف المحمية</h3>
              <p className="text-xs text-gray-400">
                أدخل كلمة المرور السرية للمشرف للوصول إلى لوحة التحكم والتحكم بالمنتجات.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-right">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  كلمة المرور السرية:
                </label>
                <input
                  type="password"
                  required
                  placeholder="أدخل كلمة المرور..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError("");
                  }}
                  className="w-full bg-[#152034] border border-[#27405f] text-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#00a3ff] text-center tracking-widest font-mono"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 justify-center">
                  <AlertCircle className="w-4 h-4" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-cyber-cyan text-black font-black text-sm py-3.5 rounded-xl cursor-pointer"
              >
                دخول لوحة التحكم 🚀
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-mono pt-1">
                <ShieldAlert className="w-3.5 h-3.5 text-[#00a3ff]" />
                <span>الوصول مشفر ومقتصر على المشرف فقط</span>
              </div>
            </form>
          </div>
        ) : tab === "showcase" ? (
          /* ===================== SHOWCASE CONTROL PANEL ===================== */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Quick toggles */}
            <div className="p-5 rounded-2xl bg-[#0b1120] border border-[#1c2942] space-y-5">
              <div className="flex items-center justify-between border-b border-[#1c2942] pb-3">
                <span className="text-[11px] text-gray-400 font-mono">
                  {showcaseProducts.length} منتج في المربع المميز
                </span>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5 font-['Cairo']">
                  <Monitor className="w-4 h-4 text-[#00a3ff]" />
                  إعدادات المربع المميز
                </h4>
              </div>

              {/* enable / autoplay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#101a2e] border border-[#1c2942] cursor-pointer hover:border-[#00a3ff]/60 transition-colors">
                  <span className="text-xs font-bold text-gray-200">إظهار المربع في الشاشة الرئيسية</span>
                  <input
                    type="checkbox"
                    checked={sc.enabled}
                    onChange={(e) => commitShowcase({ ...sc, enabled: e.target.checked })}
                    className="w-4 h-4 accent-[#00a3ff] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#101a2e] border border-[#1c2942] cursor-pointer hover:border-[#00a3ff]/60 transition-colors">
                  <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                    {sc.autoPlay ? <Play className="w-3.5 h-3.5 text-[#00a3ff]" /> : <Pause className="w-3.5 h-3.5 text-gray-400" />}
                    تدوير تلقائي للصور
                  </span>
                  <input
                    type="checkbox"
                    checked={sc.autoPlay}
                    onChange={(e) => commitShowcase({ ...sc, autoPlay: e.target.checked })}
                    className="w-4 h-4 accent-[#00a3ff] cursor-pointer"
                  />
                </label>
              </div>

              {/* speed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-300">سرعة تبديل الصور</label>
                  <span className="text-xs font-mono font-bold text-[#00a3ff]">
                    {(sc.intervalMs / 1000).toFixed(1)} ثانية
                  </span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={9000}
                  step={500}
                  value={sc.intervalMs}
                  onChange={(e) => commitShowcase({ ...sc, intervalMs: Number(e.target.value) })}
                  className="w-full accent-[#00a3ff] cursor-pointer"
                />
              </div>

              {/* texts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">نص الشارة (أعلى اليسار)</label>
                  <input
                    type="text"
                    value={sc.badgeText}
                    onChange={(e) => setSc({ ...sc, badgeText: e.target.value })}
                    onBlur={(e) => commitShowcase({ ...sc, badgeText: e.target.value })}
                    placeholder="LIVE SHOWCASE"
                    className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white font-tech rounded-xl px-3 py-2 focus:outline-none focus:border-[#00a3ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">نص الشريط السفلي</label>
                  <input
                    type="text"
                    value={sc.headline}
                    onChange={(e) => setSc({ ...sc, headline: e.target.value })}
                    onBlur={(e) => commitShowcase({ ...sc, headline: e.target.value })}
                    placeholder="عتاد البطولات • جاهز للشحن"
                    className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00a3ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">نص الزر الرئيسي</label>
                  <input
                    type="text"
                    value={sc.ctaLabel}
                    onChange={(e) => setSc({ ...sc, ctaLabel: e.target.value })}
                    onBlur={(e) => commitShowcase({ ...sc, ctaLabel: e.target.value })}
                    placeholder="تسوق الآن"
                    className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00a3ff]"
                  />
                </div>
              </div>

              {/* video(s) */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  فيديو (اختياري) — لو ضفت أكثر من فيديو، بيشتغلوا واحد ورا الثاني بالمربع المميز
                  بدل صور المنتجات
                </label>

                <div className="flex items-center gap-2 mb-2">
                  <label
                    className={`text-[11px] font-bold px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                      isUploadingVideo
                        ? "bg-[#152034] text-gray-500 border-[#27405f] cursor-not-allowed"
                        : "bg-[#00a3ff] text-black border-[#00a3ff] hover:brightness-110"
                    }`}
                  >
                    {isUploadingVideo ? "جاري الرفع..." : "📁 أضف فيديو من جهازك"}
                    <input
                      type="file"
                      accept="video/*"
                      disabled={isUploadingVideo}
                      onChange={(e) => {
                        handleVideoFileUpload(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {videoUploadError && (
                  <p className="text-[11px] text-red-400 mb-2">{videoUploadError}</p>
                )}

                {(sc.videoUrls ?? []).length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {(sc.videoUrls ?? []).map((url, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 bg-[#152034] border border-[#1c2942] rounded-lg px-3 py-2"
                      >
                        <span className="text-[11px] text-gray-300 font-mono truncate" dir="ltr">
                          {idx + 1}. {url}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeShowcaseVideo(idx)}
                          className="text-[11px] text-red-400 hover:text-red-300 underline shrink-0"
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="text-[11px] text-gray-400 block mb-1">
                  أو ألصق رابط فيديو مباشر وأضفه للقائمة:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newVideoUrlInput}
                    onChange={(e) => setNewVideoUrlInput(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    dir="ltr"
                    className="flex-1 bg-[#152034] border border-[#1c2942] text-xs text-white font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-[#00a3ff]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addShowcaseVideoUrl(newVideoUrlInput);
                      setNewVideoUrlInput("");
                    }}
                    className="text-[11px] font-bold px-3 py-2 rounded-lg bg-[#00a3ff] text-black hover:brightness-110"
                  >
                    إضافة
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  الحد الأقصى لحجم كل فيديو مرفوع 4MB. لفيديوهات أكبر، ارفعها على خدمة استضافة
                  خارجية وألصق روابطها المباشرة بدل الرفع.
                </p>
              </div>
            </div>

            {/* Current showcase order */}
            <div className="p-5 rounded-2xl bg-[#0b1120] border border-[#1c2942] space-y-3">
              <h4 className="text-sm font-black text-white font-['Cairo']">ترتيب المنتجات في المربع</h4>

              {showcaseProducts.length === 0 ? (
                <p className="text-xs text-gray-400 p-4 text-center bg-[#101a2e] rounded-xl border border-[#1c2942]">
                  لم تختر أي منتج بعد — اختر من القائمة بالأسفل، وسيتم تلقائياً عرض أول 6 منتجات.
                </p>
              ) : (
                <div className="space-y-2">
                  {showcaseProducts.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#101a2e] border border-[#1c2942]"
                    >
                      <span className="w-7 h-7 rounded-lg bg-[#00a3ff]/15 text-[#00a3ff] border border-[#00a3ff]/30 flex items-center justify-center text-[11px] font-tech">
                        {i + 1}
                      </span>
                      <div className="relative w-10 h-10 rounded-lg bg-black/50 border
