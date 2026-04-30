'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Property } from "@/lib/types";
import { uploadToCloudinary } from "@/lib/cloudinary";


const FIELD_STYLE = {
  width: "100%", height: "2.75rem", padding: "0 1rem",
  borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)", color: "#FFFFFF",
  fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s",
};

const LABEL_STYLE = {
  fontSize: "0.68rem", fontWeight: 700 as const,
  textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "#C9A646",
  marginBottom: "0.5rem", display: "block" as const,
};

type FormData = {
  title: string; price: string; currency: string; location: string;
  type: string; bedrooms: string; bathrooms: string;
  area: string; areaUnit: string; status: string;
  shortDescription: string; fullDescription: string;
  mainImage: string; gallery: string; featured: boolean;
};

// Pending file + its local preview URL
type PendingFile = { file: File; preview: string };

export default function PropertyForm({
  mode,
  property,
}: {
  mode: "new" | "edit";
  property?: Property;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  // Pending uploads — held in memory, NOT uploaded yet
  const [pendingMain,    setPendingMain]    = useState<PendingFile | null>(null);
  const [pendingGallery, setPendingGallery] = useState<PendingFile[]>([]);

  const [form, setForm] = useState<FormData>({
    title:            property?.title               ?? "",
    price:            property?.price?.toString()   ?? "",
    currency:         property?.currency            ?? "AED",
    location:         property?.location            ?? "",
    type:             property?.type                ?? "Apartment",
    bedrooms:         property?.bedrooms?.toString() ?? "0",
    bathrooms:        property?.bathrooms?.toString() ?? "1",
    area:             property?.area?.toString()    ?? "",
    areaUnit:         property?.areaUnit            ?? "sqft",
    status:           property?.status              ?? "available",
    shortDescription: property?.shortDescription    ?? "",
    fullDescription:  property?.fullDescription     ?? "",
    mainImage:        property?.mainImage           ?? "",
    gallery:          property?.gallery?.join("\n") ?? "",
    featured:         property?.featured            ?? false,
  });

  function set(key: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // ── Select main image — preview only, no upload ──
  function handleMainImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPendingMain({ file, preview });
    // Clear any manual URL so preview takes over
    set("mainImage", "");
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  // ── Select gallery images — preview only, no upload ──
  function handleGallerySelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newPending = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPendingGallery((prev) => [...prev, ...newPending]);
    e.target.value = "";
  }


// Image Upload
  async function uploadFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}

  // ── Submit — upload pending files first, then save ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // 1. Upload main image if a new file was selected
      let mainImageUrl = form.mainImage;
      if (pendingMain) {
        mainImageUrl = await uploadFile(pendingMain.file);
      }

      // 2. Upload new gallery files
      const existingGalleryUrls = form.gallery
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const newGalleryUrls: string[] = [];
      for (const { file } of pendingGallery) {
        const url = await uploadFile(file);
        newGalleryUrls.push(url);
      }

      const allGalleryUrls = [...existingGalleryUrls, ...newGalleryUrls];

      // 3. Save property JSON
      const payload = {
        title:            form.title,
        price:            parseFloat(form.price),
        currency:         form.currency,
        location:         form.location,
        type:             form.type,
        bedrooms:         parseInt(form.bedrooms),
        bathrooms:        parseInt(form.bathrooms),
        area:             parseFloat(form.area),
        areaUnit:         form.areaUnit,
        status:           form.status,
        shortDescription: form.shortDescription,
        fullDescription:  form.fullDescription,
        mainImage:        mainImageUrl,
        gallery:          allGalleryUrls,
        featured:         form.featured,
      };

      const res = await fetch(
        mode === "new" ? "/api/properties" : `/api/properties/${property!.id}`,
        {
          method: mode === "new" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save. Check your GitHub token and try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "rgba(201,166,70,0.6)");
  const inputBlur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  // Derived display values
  const mainImageDisplay = pendingMain?.preview || form.mainImage;

  const galleryPreviews: { src: string; isPending: boolean; idx: number }[] = [
    ...form.gallery.split("\n").map((s) => s.trim()).filter(Boolean).map((src, idx) => ({
      src, isPending: false, idx,
    })),
    ...pendingGallery.map(({ preview }, idx) => ({
      src: preview, isPending: true, idx,
    })),
  ];

  return (
    <div style={{ minHeight: "100dvh" }}>

      {/* Top bar */}
      <header style={{
        height: "64px", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(11,15,25,0.95)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <Link href="/admin/dashboard" style={{
          display: "flex", alignItems: "center", gap: "8px",
          color: "#6B7280", fontSize: "0.85rem", transition: "color 0.2s",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Dashboard
        </Link>
        <span style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1rem", color: "#FFFFFF" }}>
          {mode === "new" ? "Add New Property" : "Edit Property"}
        </span>
        <div style={{ width: "80px" }} />
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {[
            /* ── Basic Info ── */
            <div key="basic" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", color: "#FFFFFF", paddingBottom: "0.875rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                Basic Information
              </h3>

              <div>
                <label style={LABEL_STYLE}>Property Title *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)}
                  required placeholder="e.g. Luxury Villa in Palm Jumeirah"
                  style={FIELD_STYLE} onFocus={inputFocus} onBlur={inputBlur} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "1rem" }}>
                <div>
                  <label style={LABEL_STYLE}>Price *</label>
                  <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
                    required placeholder="e.g. 5000000"
                    style={FIELD_STYLE} onFocus={inputFocus} onBlur={inputBlur} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Currency</label>
                  <select value={form.currency} onChange={(e) => set("currency", e.target.value)}
                    style={{ ...FIELD_STYLE, cursor: "pointer" }} onFocus={inputFocus} onBlur={inputBlur}>
                    {["AED","USD","EUR","GBP"].map((c) => (
                      <option key={c} value={c} style={{ background: "#151b27" }}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>Location *</label>
                <input value={form.location} onChange={(e) => set("location", e.target.value)}
                  required placeholder="e.g. Palm Jumeirah, Dubai"
                  style={FIELD_STYLE} onFocus={inputFocus} onBlur={inputBlur} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={LABEL_STYLE}>Type *</label>
                  <select value={form.type} onChange={(e) => set("type", e.target.value)}
                    style={{ ...FIELD_STYLE, cursor: "pointer" }} onFocus={inputFocus} onBlur={inputBlur}>
                    {["Apartment","Villa","Penthouse","Townhouse","Duplex","Studio"].map((t) => (
                      <option key={t} value={t} style={{ background: "#151b27" }}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={LABEL_STYLE}>Status *</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)}
                    style={{ ...FIELD_STYLE, cursor: "pointer" }} onFocus={inputFocus} onBlur={inputBlur}>
                    {["available","sold","pending"].map((s) => (
                      <option key={s} value={s} style={{ background: "#151b27" }}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px", gap: "1rem" }}>
                <div>
                  <label style={LABEL_STYLE}>Bedrooms</label>
                  <input type="number" min="0" value={form.bedrooms}
                    onChange={(e) => set("bedrooms", e.target.value)}
                    style={FIELD_STYLE} onFocus={inputFocus} onBlur={inputBlur} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Bathrooms *</label>
                  <input type="number" min="1" value={form.bathrooms}
                    onChange={(e) => set("bathrooms", e.target.value)}
                    required style={FIELD_STYLE} onFocus={inputFocus} onBlur={inputBlur} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Area *</label>
                  <input type="number" value={form.area}
                    onChange={(e) => set("area", e.target.value)}
                    required placeholder="e.g. 3500"
                    style={FIELD_STYLE} onFocus={inputFocus} onBlur={inputBlur} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Unit</label>
                  <select value={form.areaUnit} onChange={(e) => set("areaUnit", e.target.value)}
                    style={{ ...FIELD_STYLE, cursor: "pointer" }} onFocus={inputFocus} onBlur={inputBlur}>
                    {["sqft","sqm"].map((u) => (
                      <option key={u} value={u} style={{ background: "#151b27" }}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured toggle */}
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <div onClick={() => set("featured", !form.featured)} style={{
                  width: "44px", height: "24px", borderRadius: "9999px",
                  background: form.featured ? "#C9A646" : "rgba(255,255,255,0.1)",
                  position: "relative", transition: "background 0.25s",
                  flexShrink: 0, cursor: "pointer",
                }}>
                  <div style={{
                    position: "absolute", top: "3px",
                    left: form.featured ? "23px" : "3px",
                    width: "18px", height: "18px", borderRadius: "9999px",
                    background: "#FFFFFF", transition: "left 0.25s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }} />
                </div>
                <span style={{ fontSize: "0.875rem", color: "#D1D5DB" }}>Featured on homepage</span>
              </label>
            </div>,

            /* ── Descriptions ── */
            <div key="desc" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", color: "#FFFFFF", paddingBottom: "0.875rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                Descriptions
              </h3>

              <div>
                <label style={LABEL_STYLE}>Short Description * (shown on cards)</label>
                <textarea value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  required rows={3} placeholder="Brief summary shown on listing cards…"
                  style={{ ...FIELD_STYLE, height: "auto", padding: "0.875rem 1rem", resize: "vertical" }}
                  onFocus={inputFocus} onBlur={inputBlur} />
              </div>

              <div>
                <label style={LABEL_STYLE}>Full Description (shown on detail page)</label>
                <textarea value={form.fullDescription}
                  onChange={(e) => set("fullDescription", e.target.value)}
                  rows={8} placeholder="Full property description with all details…"
                  style={{ ...FIELD_STYLE, height: "auto", padding: "0.875rem 1rem", resize: "vertical" }}
                  onFocus={inputFocus} onBlur={inputBlur} />
              </div>
            </div>,

            /* ── Images ── */
            <div key="images" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", color: "#FFFFFF", paddingBottom: "0.875rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                Images
                <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#6B7280", marginLeft: "0.75rem", letterSpacing: "0.05em", textTransform: "none", fontFamily: "inherit" }}>
                  — previews shown locally, uploaded only when you click Save
                </span>
              </h3>

              {/* Main image */}
              <div>
                <label style={LABEL_STYLE}>Main Image</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                  <label style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: "2.75rem", borderRadius: "0.75rem",
                    border: "1px dashed rgba(201,166,70,0.4)",
                    background: "rgba(201,166,70,0.05)", cursor: "pointer",
                    fontSize: "0.85rem", color: "#C9A646", fontWeight: 600,
                    transition: "background 0.2s",
                  }}>
                    {pendingMain ? "✓ Image selected — will upload on Save" : "📷 Select Main Image"}
                    <input type="file" accept="image/*" onChange={handleMainImageSelect} style={{ display: "none" }} />
                  </label>

                  <input value={form.mainImage} onChange={(e) => { set("mainImage", e.target.value); setPendingMain(null); }}
                    placeholder="Or paste image URL here"
                    style={FIELD_STYLE} onFocus={inputFocus} onBlur={inputBlur} />

                  {mainImageDisplay && (
                    <div style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", height: "160px", border: "1px solid rgba(201,166,70,0.2)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mainImageDisplay} alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {pendingMain && (
                        <div style={{
                          position: "absolute", top: "8px", left: "8px",
                          background: "rgba(201,166,70,0.9)", color: "#0B0F19",
                          fontSize: "0.65rem", fontWeight: 700,
                          padding: "2px 8px", borderRadius: "9999px", letterSpacing: "0.08em",
                        }}>
                          PENDING UPLOAD
                        </div>
                      )}
                      <button type="button" onClick={() => { setPendingMain(null); set("mainImage", ""); }}
                        style={{
                          position: "absolute", top: "8px", right: "8px",
                          width: "28px", height: "28px", borderRadius: "9999px",
                          background: "rgba(0,0,0,0.7)", color: "#FFFFFF",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", border: "none", fontSize: "14px",
                        }}>✕</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <label style={LABEL_STYLE}>Gallery Images</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                  <label style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: "2.75rem", borderRadius: "0.75rem",
                    border: "1px dashed rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.03)", cursor: "pointer",
                    fontSize: "0.85rem", color: "#9CA3AF", fontWeight: 600,
                  }}>
                    {pendingGallery.length > 0
                      ? `✓ ${pendingGallery.length} image${pendingGallery.length > 1 ? "s" : ""} selected — will upload on Save`
                      : "🖼 Select Gallery Images (multiple)"}
                    <input type="file" accept="image/*" multiple onChange={handleGallerySelect} style={{ display: "none" }} />
                  </label>

                  <textarea value={form.gallery} onChange={(e) => set("gallery", e.target.value)}
                    rows={3} placeholder="Or paste image URLs, one per line…"
                    style={{ ...FIELD_STYLE, height: "auto", padding: "0.875rem 1rem", resize: "vertical", fontSize: "0.8rem" }}
                    onFocus={inputFocus} onBlur={inputBlur} />

                  {/* Gallery previews */}
                  {galleryPreviews.length > 0 && (
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {galleryPreviews.map(({ src, isPending, idx }) => (
                        <div key={`${isPending ? "p" : "e"}-${idx}`} style={{
                          position: "relative", width: "80px", height: "64px",
                          borderRadius: "0.5rem", overflow: "hidden",
                          border: isPending
                            ? "1px solid rgba(201,166,70,0.5)"
                            : "1px solid rgba(255,255,255,0.08)",
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {isPending && (
                            <div style={{
                              position: "absolute", bottom: 0, left: 0, right: 0,
                              background: "rgba(201,166,70,0.85)", fontSize: "0.55rem",
                              fontWeight: 700, color: "#0B0F19", textAlign: "center",
                              padding: "1px 0", letterSpacing: "0.04em",
                            }}>NEW</div>
                          )}
                          <button type="button" onClick={() => {
                            if (isPending) {
                              setPendingGallery((prev) => prev.filter((_, i) => i !== idx));
                            } else {
                              const lines = form.gallery.split("\n").filter(Boolean);
                              lines.splice(idx, 1);
                              set("gallery", lines.join("\n"));
                            }
                          }} style={{
                            position: "absolute", top: "3px", right: "3px",
                            width: "18px", height: "18px", borderRadius: "9999px",
                            background: "rgba(0,0,0,0.75)", color: "#FFFFFF",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", border: "none", fontSize: "10px",
                          }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>,
          ].map((section, i) => (
            <div key={i} style={{
              borderRadius: "1.25rem",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
              padding: "1.75rem",
            }}>
              {section}
            </div>
          ))}

          {/* Error */}
          {error && (
            <div style={{
              padding: "0.875rem 1rem", borderRadius: "0.75rem",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171", fontSize: "0.875rem",
            }}>
              {error}
            </div>
          )}

          {/* Pending upload notice */}
          {(pendingMain || pendingGallery.length > 0) && !saving && (
            <div style={{
              padding: "0.875rem 1rem", borderRadius: "0.75rem",
              background: "rgba(201,166,70,0.08)", border: "1px solid rgba(201,166,70,0.25)",
              color: "#C9A646", fontSize: "0.85rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <span>⏳</span>
              <span>
                {[
                  pendingMain && "1 main image",
                  pendingGallery.length > 0 && `${pendingGallery.length} gallery image${pendingGallery.length > 1 ? "s" : ""}`,
                ].filter(Boolean).join(" + ")} ready — will be uploaded when you click Save.
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.875rem" }}>
            <button
              type="submit" disabled={saving}
              className="btn-gold-hover"
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem",
                minHeight: "3rem", borderRadius: "9999px",
                background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
                color: "#0B0F19", fontWeight: 700, fontSize: "0.9rem",
                opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Uploading & Saving…
                </>
              ) : mode === "new" ? "Create Property" : "Save Changes"}
            </button>
            <Link href="/admin/dashboard" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minHeight: "3rem", borderRadius: "9999px", padding: "0 1.75rem",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#FFFFFF", fontWeight: 600, fontSize: "0.875rem",
            }}>
              Cancel
            </Link>
          </div>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>

        </form>
      </main>
    </div>
  );
}