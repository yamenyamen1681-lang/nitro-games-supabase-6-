import React, { useState } from "react";
import Image from "next/image";
import { 
  X, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Music, 
  Save, 
  Edit, 
  Trash2,
  Bell,
  Send
} from "lucide-react";

export default function AdminDashboardModal({ 
  isOpen, 
  onClose, 
  showcaseProducts, 
  moveItem, 
  removeFromShowcase, 
  pickerQuery, 
  setPickerQuery, 
  pickerCat, 
  setPickerCat, 
  CATEGORIES_META, 
  pickerList, 
  sc, 
  togglePick, 
  tab, 
  siteAudioUrl, 
  setSiteAudioUrl, 
  isUploadingAudio, 
  handleAudioFileUpload, 
  saveSiteAudio, 
  audioUploadError, 
  editingProduct, 
  title, 
  setTitle, 
  category, 
  setCategory, 
  price, 
  setPrice, 
  originalPrice, 
  setOriginalPrice, 
  brand, 
  setBrand, 
  badge, 
  setBadge, 
  imageUrl, 
  setImageUrl, 
  isUploadingImage, 
  handleFileUpload, 
  uploadError, 
  PRESET_IMAGES, 
  gallery, 
  isUploadingGalleryItem, 
  handleGalleryFileUpload, 
  galleryUploadError, 
  removeGalleryItem, 
  description, 
  setDescription, 
  handleSaveProduct, 
  cancelEdit, 
  filteredList, 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory, 
  startEditProduct, 
  handleDeleteProduct,
  // خصائص نظام الإشعارات
  notificationTitle,
  setNotificationTitle,
  notificationBody,
  setNotificationBody,
  notificationLink,
  setNotificationLink,
  handleSendNotification,
  isSendingNotification
}: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b1120] border border-[#1c2942] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2942] bg-[#152034]">
          <h3 className="text-sm font-black text-white font-['Cairo']">لوحة تحكم متجر NITRO GAMES</h3>
          <button 
            type="button" 
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Tabs Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-right flex-1">
          {tab === "showcase" ? (
            /* ===================== SHOWCASE MANAGEMENT ===================== */
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#0b1120] border border-[#1c2942] space-y-4">
                <h4 className="text-sm font-black text-white font-['Cairo']">المنتجات المعروضة حالياً في واجهة المتجر</h4>
                
                {showcaseProducts.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">لم يتم اختيار منتجات للمربع المميز بعد.</p>
                ) : (
                  <div className="space-y-2">
                    {showcaseProducts.map((p: any, i: number) => (
                      <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#152034] border border-[#1c2942]">
                        <div className="relative w-10 h-10 rounded-lg bg-black/50 border border-[#1c2942] shrink-0">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <div className="text-xs font-bold text-white truncate">{p.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {p.price} ₪ • {CATEGORIES_META[p.category]?.label || p.category}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveItem(i, -1)}
                            disabled={i === 0}
                            className="p-1.5 rounded-lg bg-[#152034] text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="تحريك للأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(i, 1)}
                            disabled={i === showcaseProducts.length - 1}
                            className="p-1.5 rounded-lg bg-[#152034] text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="تحريك للأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromShowcase(p.id)}
                            className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 ml-1 cursor-pointer"
                            title="إزالة من المربع المميز"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Picker to Add to Showcase */}
              <div className="p-5 rounded-2xl bg-[#0b1120] border border-[#1c2942] space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <h4 className="text-sm font-black text-white font-['Cairo']">اختر منتجات لإضافتها للمربع المميز</h4>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={pickerQuery}
                        onChange={(e) => setPickerQuery(e.target.value)}
                        placeholder="بحث عن منتج..."
                        className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl pr-9 pl-3 py-2 focus:outline-none focus:border-[#00a3ff]"
                      />
                    </div>
                    <select
                      value={pickerCat}
                      onChange={(e) => setPickerCat(e.target.value)}
                      className="bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00a3ff]"
                    >
                      <option value="all">كل الأقسام</option>
                      {Object.entries(CATEGORIES_META).map(([key, meta]: [string, any]) => (
                        <option key={key} value={key}>
                          {meta.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
                  {pickerList.map((p: any) => {
                    const isSelected = sc.productIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePick(p.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-right transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#00a3ff]/15 border-[#00a3ff] shadow-[0_0_10px_rgba(0,163,255,0.2)]"
                            : "bg-[#101a2e] border-[#1c2942] hover:border-gray-600"
                        }`}
                      >
                        <div className="relative w-10 h-10 rounded-lg bg-black/50 border border-[#1c2942] shrink-0">
                          <Image src={p.image} alt={p.title} fill className="object-cover rounded-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{p.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{p.price} ₪</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-[#00a3ff] text-black font-bold text-xs" : "border border-gray-600"
                          }`}
                        >
                          {isSelected ? "✓" : "+"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : tab === "audio" ? (
            /* ===================== SITE AUDIO CONTROL PANEL ===================== */
            <div className="p-8 max-w-xl mx-auto space-y-6 text-right">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#1e170e] border border-[#00a3ff]/30 flex items-center justify-center mx-auto text-[#00a3ff]">
                  <Music className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-white font-['Cairo']">موسيقى الخلفية للموقع</h3>
                <p className="text-xs text-gray-400">
                  قم برفع ملف صوتي (MP3/WAV) ليعمل في خلفية المتجر لكل الزوار.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0b1120] border border-[#1c2942] space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">رابط ملف الصوت الحالي:</label>
                  <input
                    type="text"
                    value={siteAudioUrl}
                    onChange={(e) => setSiteAudioUrl(e.target.value)}
                    placeholder="https://..."
                    dir="ltr"
                    className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white font-mono rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label
                    className={`w-full sm:w-auto text-center text-xs font-bold px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                      isUploadingAudio
                        ? "bg-[#152034] text-gray-500 border-[#27405f] cursor-not-allowed"
                        : "bg-[#00a3ff] text-black border-[#00a3ff] hover:brightness-110"
                    }`}
                  >
                    {isUploadingAudio ? "جاري الرفع..." : "📁 رفع ملف صوتي من الجهاز"}
                    <input
                      type="file"
                      accept="audio/*"
                      disabled={isUploadingAudio}
                      onChange={(e) => {
                        handleAudioFileUpload(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => saveSiteAudio(siteAudioUrl)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    حفظ التغييرات 💾
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSiteAudioUrl("");
                      saveSiteAudio("");
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    إيقاف وحذف الموسيقى 🛑
                  </button>
                </div>

                {audioUploadError && <p className="text-xs text-rose-400">{audioUploadError}</p>}

                {siteAudioUrl && (
                  <div className="pt-3 border-t border-[#1c2942]">
                    <span className="text-xs text-gray-400 block mb-2">معاينة الصوت:</span>
                    <audio controls src={siteAudioUrl} className="w-full" />
                  </div>
                )}
              </div>
            </div>
          ) : tab === "notifications" ? (
            /* ===================== NOTIFICATIONS CONTROL PANEL ===================== */
            <div className="p-8 max-w-xl mx-auto space-y-6 text-right">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#152034] border border-[#00a3ff]/30 flex items-center justify-center mx-auto text-[#00a3ff]">
                  <Bell className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-white font-['Cairo']">إرسال إشعار للعملاء</h3>
                <p className="text-xs text-gray-400">
                  قم بإرسال إشعار فوري يظهر لجميع زوار وعملاء متجر Nitro Games.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0b1120] border border-[#1c2942] space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">عنوان الإشعار:</label>
                  <input
                    type="text"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder="مثال: خصومات حارقة بمناسبة نهاية السيزون! 🔥"
                    className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">نص الرسالة / التفاصيل:</label>
                  <textarea
                    rows={3}
                    value={notificationBody}
                    onChange={(e) => setNotificationBody(e.target.value)}
                    placeholder="اكتب تفاصيل العرض أو الإشعار هنا..."
                    className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">رابط توجيه العميل (اختياري):</label>
                  <input
                    type="text"
                    value={notificationLink}
                    onChange={(e) => setNotificationLink(e.target.value)}
                    placeholder="/products أو رابط قسم معين..."
                    dir="ltr"
                    className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff] font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendNotification}
                  disabled={isSendingNotification}
                  className="w-full py-3 bg-[#00a3ff] hover:brightness-110 disabled:opacity-50 text-black font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingNotification ? "جاري الإرسال..." : "إرسال الإشعار الفوري للجميع 🚀"}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ===================== PRODUCTS MANAGEMENT TAB ===================== */
            <div className="space-y-6">
              {/* Add / Edit Product Form */}
              <div id="admin-product-form" className="p-5 rounded-2xl bg-[#0b1120] border border-[#1c2942] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1c2942] pb-3">
                  <div className="flex items-center gap-2">
                    {editingProduct ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        وضع التعديل
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#00a3ff]/15 text-[#00a3ff] border border-[#00a3ff]/30">
                        إضافة منتج جديد
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white font-['Cairo']">
                    {editingProduct ? `تعديل المنتج: ${editingProduct.title}` : "إضافة منتج جديد لمتجر NITRO GAMES"}
                  </h4>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">اسم المنتج:</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="مثال: كيبورد ميكانيكي مخصص..."
                        className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">القسم:</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                      >
                        {Object.entries(CATEGORIES_META).map(([key, meta]: [string, any]) => (
                          <option key={key} value={key}>
                            {meta.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">السعر الحالي (بالشيكل ₪):</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="299"
                        className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">السعر القديم قبل الخصم (اختياري):</label>
                      <input
                        type="number"
                        min={0}
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="399"
                        className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">الماركة / الشركة:</label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Nitro Games"
                        className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">شارة مميزة (اختياري):</label>
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="مثال: الأكثر مبيعاً 🔥"
                        className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">رابط صورة المنتج الرئيسي:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="/images/..."
                          dir="ltr"
                          className="flex-1 bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff] font-mono"
                        />
                        <label className="px-3.5 py-2.5 rounded-xl bg-[#00a3ff] text-black font-bold text-xs cursor-pointer hover:brightness-110 shrink-0 flex items-center justify-center">
                          {isUploadingImage ? "جاري الرفع..." : "رفع صورة"}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingImage}
                            onChange={(e) => {
                              handleFileUpload(e.target.files?.[0]);
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {uploadError && <p className="text-[11px] text-rose-400 mt-1">{uploadError}</p>}
                    </div>
                  </div>

                  {/* Preset Images Quick Selector */}
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1.5">أو اختر صورة جاهزة من مكتبة المتجر:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((preset: any, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            imageUrl === preset.url
                              ? "bg-[#00a3ff]/20 border-[#00a3ff] text-[#00a3ff] font-bold"
                              : "bg-[#152034] border-[#1c2942] text-gray-300 hover:text-white"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gallery Items Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-300">معرض الصور / الفيديوهات الإضافية (اختياري):</label>
                      <label className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#00a3ff]/15 text-[#00a3ff] border border-[#00a3ff]/30 cursor-pointer hover:bg-[#00a3ff]/25 transition-all">
                        {isUploadingGalleryItem ? "جاري الرفع..." : "+ أضف صورة/فيديو للمعرض"}
                        <input
                          type="file"
                          accept="image/*,video/*"
                          disabled={isUploadingGalleryItem}
                          onChange={(e) => {
                            handleGalleryFileUpload(e.target.files?.[0]);
                            e.target.value = "";
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {galleryUploadError && <p className="text-[11px] text-rose-400 mb-2">{galleryUploadError}</p>}

                    {gallery.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
                        {gallery.map((item: any, idx: number) => (
                          <div key={idx} className="relative rounded-xl bg-[#152034] border border-[#1c2942] p-2 flex items-center gap-2">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black">
                              {item.type === "video" ? (
                                <video src={item.url} className="w-full h-full object-cover" />
                              ) : (
                                <Image src={item.url} alt={`Gallery ${idx}`} fill className="object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-gray-300 block uppercase font-mono">{item.type}</span>
                              <span className="text-[10px] text-gray-500 truncate block" dir="ltr">{item.url}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeGalleryItem(idx)}
                              className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">وصف المنتج والمواصفات:</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="اكتب تفاصيل ومواصفات المنتج هنا..."
                      className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#00a3ff] hover:brightness-110 text-black font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProduct ? "حفظ التعديلات والتحديث الفوري" : "إضافة المنتج للمتجر"}</span>
                    </button>

                    {editingProduct && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-5 py-3 bg-[#152034] text-gray-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        إلغاء التعديل
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Products List & Filter */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <h4 className="text-sm font-black text-white font-['Cairo']">
                    منتجات المتجر الحالية ({filteredList.length})
                  </h4>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-56">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ابحث عن منتج..."
                        className="w-full bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl pr-9 pl-3 py-2 focus:outline-none focus:border-[#00a3ff]"
                      />
                    </div>

                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-[#152034] border border-[#1c2942] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00a3ff]"
                    >
                      <option value="all">كل الأقسام</option>
                      {Object.entries(CATEGORIES_META).map(([key, meta]: [string, any]) => (
                        <option key={key} value={key}>
                          {meta.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredList.length === 0 ? (
                    <p className="p-8 text-center text-xs text-gray-400 bg-[#0b1120] rounded-2xl border border-[#1c2942]">
                      لا توجد منتجات مطابقة للبحث.
                    </p>
                  ) : (
                    filteredList.map((prod: any) => (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#0b1120] border border-[#1c2942] hover:border-[#00a3ff]/40 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl bg-black/50 border border-[#1c2942] shrink-0">
                            <Image src={prod.image} alt={prod.title} fill className="object-cover rounded-xl" />
                          </div>
                          <div className="min-w-0 text-right">
                            <div className="text-xs font-bold text-white truncate">{prod.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-[#152034] text-[#00a3ff] font-mono border border-[#27405f]">
                                {CATEGORIES_META[prod.category]?.label || prod.category}
                              </span>
                              <span className="text-xs font-bold text-emerald-400 font-mono">{prod.price} ₪</span>
                              {prod.originalPrice && (
                                <span className="text-[10px] text-gray-500 line-through font-mono">
                                  {prod.originalPrice} ₪
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditProduct(prod)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 hover:bg-amber-500/25 transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 hover:bg-rose-500/25 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
