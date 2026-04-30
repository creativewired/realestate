'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Property } from "@/lib/types";

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{
      borderRadius: "1.25rem",
      border: "1px solid rgba(255,255,255,0.07)",
      background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
      padding: "1.75rem",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: color,
      }} />
      <p style={{
        fontFamily: "Zodiak,Georgia,serif",
        fontSize: "2.5rem", fontWeight: 400, color,
        lineHeight: 1, marginBottom: "0.5rem",
      }}>{value}</p>
      <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#6B7280" }}>
        {label}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("/api/properties")
    .then((r) => r.json())
    .then((data) => {
      // handle both array and {properties: [...]} shapes
      const list = Array.isArray(data) ? data : data.properties ?? [];
      setProperties(list);
      setLoading(false);
    })
    .catch(() => {
      setProperties([]);
      setLoading(false);
    });
}, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  const total     = properties.length;
  const available = properties.filter((p) => p.status === "available").length;
  const sold      = properties.filter((p) => p.status === "sold").length;
  const pending   = properties.filter((p) => p.status === "pending").length;

  const STATUS_COLOR: Record<string, { bg: string; color: string; border: string }> = {
    available: { bg: "rgba(74,222,128,0.12)",  color: "#4ade80", border: "rgba(74,222,128,0.35)" },
    sold:      { bg: "rgba(239,68,68,0.12)",   color: "#f87171", border: "rgba(239,68,68,0.35)" },
    pending:   { bg: "rgba(201,166,70,0.12)",  color: "#C9A646", border: "rgba(201,166,70,0.35)" },
  };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ── */}
      <header style={{
        height: "64px", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(11,15,25,0.95)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#C9A646" strokeWidth="1.5" fill="none"/>
            <text x="18" y="22" textAnchor="middle" fill="#C9A646" fontSize="10" fontFamily="serif" fontWeight="600">LR</text>
          </svg>
          <span style={{ fontFamily: "Zodiak,Georgia,serif", color: "#FFFFFF", fontSize: "1rem" }}>
            Admin <span style={{ color: "#C9A646" }}>Dashboard</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" target="_blank" style={{
            fontSize: "0.78rem", color: "#6B7280", padding: "6px 12px",
            borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.08)",
            transition: "color 0.2s",
          }}>
            View Site ↗
          </Link>
          <button onClick={handleLogout} style={{
            fontSize: "0.78rem", color: "#f87171", padding: "6px 12px",
            borderRadius: "9999px", border: "1px solid rgba(239,68,68,0.25)",
            background: "rgba(239,68,68,0.08)", cursor: "pointer",
            transition: "background 0.2s",
          }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          <StatCard value={total}     label="Total Listings"     color="#C9A646" />
          <StatCard value={available} label="Available"          color="#4ade80" />
          <StatCard value={sold}      label="Sold"               color="#f87171" />
          <StatCard value={pending}   label="Pending"            color="#fb923c" />
        </div>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.5rem", fontWeight: 400, color: "#FFFFFF" }}>
            All Properties
          </h2>
          <Link
            href="/admin/properties/new"
            className="btn-gold-hover"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              minHeight: "2.75rem", borderRadius: "9999px", padding: "0 1.5rem",
              background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
              color: "#0B0F19", fontWeight: 700, fontSize: "0.85rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Property
          </Link>
          <Link
  href="/admin/content"
  className="btn-outline-hover"
  style={{
    display: "inline-flex", alignItems: "center", gap: "6px",
    minHeight: "2.75rem", borderRadius: "9999px", padding: "0 1.5rem",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#FFFFFF", fontWeight: 600, fontSize: "0.85rem",
  }}
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
  Edit Site Content
</Link>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#6B7280" }}>Loading…</div>
        ) : properties.length === 0 ? (
          <div style={{
            borderRadius: "1.25rem", border: "1px dashed rgba(255,255,255,0.1)",
            padding: "4rem 2rem", textAlign: "center", color: "#6B7280",
          }}>
            <p style={{ fontWeight: 600, color: "#FFFFFF", marginBottom: "0.5rem" }}>No properties yet</p>
            <p style={{ fontSize: "0.875rem" }}>Click "Add Property" to create your first listing.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {properties.map((p) => {
              const sc = STATUS_COLOR[p.status] ?? STATUS_COLOR.available;
              return (
                <div key={p.id} style={{
                  borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "linear-gradient(160deg,#1a2030 0%,#141a24 100%)",
                  padding: "1rem 1.25rem",
                  display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
                  transition: "border-color 0.2s",
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: "60px", height: "48px", borderRadius: "0.625rem",
                    overflow: "hidden", background: "#1a2030", flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    {p.mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.mainImage} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a3448" strokeWidth="1.5">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <p style={{ fontFamily: "Zodiak,Georgia,serif", fontWeight: 400, color: "#FFFFFF", fontSize: "0.95rem", marginBottom: "2px" }}>
                      {p.title}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      {p.location} · {p.type}
                    </p>
                  </div>

                  {/* Price */}
                  <div style={{ flexShrink: 0 }}>
                    <span style={{
                      fontSize: "0.85rem", fontWeight: 700, color: "#C9A646",
                      border: "1px solid rgba(201,166,70,0.3)",
                      background: "rgba(201,166,70,0.07)",
                      borderRadius: "0.5rem", padding: "0.25rem 0.75rem",
                    }}>
                      {p.currency} {(p.price / 1_000_000).toFixed(1)}M
                    </span>
                  </div>

                  {/* Status */}
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", padding: "0.3rem 0.875rem",
                    borderRadius: "9999px", flexShrink: 0,
                    background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
                  }}>
                    {p.status}
                  </span>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <Link href={`/admin/properties/${p.id}/edit`} style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      padding: "6px 12px", borderRadius: "9999px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#D1D5DB", fontSize: "0.75rem", fontWeight: 600,
                      transition: "all 0.2s",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.title)} style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      padding: "6px 12px", borderRadius: "9999px",
                      border: "1px solid rgba(239,68,68,0.25)",
                      background: "rgba(239,68,68,0.08)",
                      color: "#f87171", fontSize: "0.75rem", fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}