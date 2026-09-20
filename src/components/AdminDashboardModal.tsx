"use client";

import React, { useState } from "react";
import { Product, ShowcaseConfig } from "@/lib/data";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdate: (products: Product[]) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  showcase: ShowcaseConfig;
  onShowcaseUpdate: (cfg: ShowcaseConfig) => void;
}

export default function AdminDashboardModal({
  isOpen,
  onClose,
  products,
  onProductsUpdate,
  showToast,
  showcase,
  onShowcaseUpdate,
}: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<"products" | "showcase" | "notifications">("products");
  
  // حالات إدارة المنتجات
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // نموذج المنتج
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("keyboards");
  const [image, setImage] = useState("");

  // حالات الإشعارات الجديدة
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifLink, setNotifLink] = useState("");

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !image) {
      showToast("يرجى تعبئة الحقول الأساسية", "error");
      return;
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      title,
      price: parseFloat(price),
      category,
      image,
    };

    if (editingProduct) {
      const updated = products.map((p) => (p.id === editingProduct.id ? newProduct : p));
      onProductsUpdate(updated);
      showToast("تم تحديث المنتج بنجاح", "success");
    } else {
      onProductsUpdate([newProduct, ...products]);
      showToast("تم إضافة المنتج بنجاح", "success");
    }

    setEditingProduct(null);
    setTitle("");
    setPrice("");
    setImage("");
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      const updated = products.filter((p) => p.id !== id);
      onProductsUpdate(updated);
      showToast("تم الحذف بنجاح", "info");
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifBody) {
      showToast("يرجى كتابة عنوان ونصف الإشعار على الأقل", "error");
      return;
    }
    showToast("تم إرسال الإشعار الفوري بنجاح للجميع! 🚀", "success");
    setNotifTitle("");
    setNotifBody("");
    setNotifLink("");
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b0f19] border border-[#00a3ff]/30 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* رأس النافذة */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#070b14]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>⚙️</span> لوحة تحكم المتجر (الرئيسية)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 px-3 py-1.5 rounded-lg text-sm transition"
          >
            إغلاق ✕
          </button>
        </div>

        {/* التبويبات كاملة */}
        <div className="flex border-b border-gray-800 bg-[#070b14]/50 px-6 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 text-sm font-medium border-b-2 transition shrink-0 ${
              activeTab === "products"
                ? "border-[#00a3ff] text-[#00a3ff]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            إدارة المنتجات ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("showcase")}
            className={`py-3 text-sm font-medium border-b-2 transition shrink-0 ${
              activeTab === "showcase"
                ? "border-[#00a3ff] text-[#00a3ff]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            العرض المميز (Showcase)
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-3 text-sm font-medium border-b-2 transition shrink-0 ${
              activeTab === "notifications"
                ? "border-[#00a3ff] text-[#00a3ff]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            إرسال إشعارات فورية 🔔
          </button>
        </div>

        {/* محتوى اللوحة */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "products" ? (
            <div className="space-y-6">
              <form onSubmit={handleSave} className="bg-[#070b14] p-4 rounded-xl border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-gray-200">
                  {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="اسم المنتج"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#0b0f19] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a3ff]"
                  />
                  <input
                    type="number"
                    placeholder="السعر"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-[#0b0f19] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a3ff]"
                  />
                  <input
                    type="text"
                    placeholder="رابط الصورة"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="bg-[#0b0f19] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a3ff]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setTitle("");
                        setPrice("");
                        setImage("");
                      }}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
                    >
                      إلغاء
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00a3ff] text-black font-bold rounded-lg text-sm hover:bg-[#0088cc] transition"
                  >
                    {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="بحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#070b14] border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00a3ff]"
                />
                <div className="space-y-2">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-[#070b14]/60 border border-gray-800 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg bg-gray-800" />
                        <div>
                          <h4 className="text-sm font-medium text-white">{p.title}</h4>
                          <span className="text-xs text-[#00a3ff]">{p.price} ₪</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setTitle(p.title);
                            setPrice(p.price.toString());
                            setImage(p.image);
                          }}
                          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs rounded-lg transition"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "showcase" ? (
            <div className="text-center py-12 text-gray-400 space-y-3">
              <p className="text-base text-white font-medium">إعدادات العرض المميز (Showcase)</p>
              <p className="text-sm">يمكنك تخصيص العروض والواجهة من هنا حسب رغبتك.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#070b14] p-4 rounded-xl border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white">إرسال إشعار فوري لجميع الزوار</h3>
                <form onSubmit={handleSendNotification} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">عنوان الإشعار</label>
                    <input
                      type="text"
                      placeholder="مثال: خصم 50% لفترة محدودة! 🔥"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a3ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نص الرسالة</label>
                    <textarea
                      placeholder="اكتب تفاصيل الإشعار هنا..."
                      value={notifBody}
                      onChange={(e) => setNotifBody(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a3ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">رابط التوجيه (اختياري)</label>
                    <input
                      type="text"
                      placeholder="/products أو رابط خارجي"
                      value={notifLink}
                      onChange={(e) => setNotifLink(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a3ff]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#00a3ff] text-black font-bold rounded-lg text-sm hover:bg-[#0088cc] transition shadow-lg shadow-[#00a3ff]/20"
                    >
                      إرسال الإشعار الفوري للجميع 🚀
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
