'use client';

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property, Agent } from "@/lib/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number, currency: string) {
  if (price >= 1_000_000) return `${currency} ${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${currency} ${(price / 1_000).toFixed(0)}K`;
  return `${currency} ${price.toLocaleString()}`;
}

const STATUS_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  available: { bg: "rgba(74,222,128,0.15)",  border: "rgba(74,222,128,0.4)",  color: "#4ade80" },
  sold:      { bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.4)",   color: "#f87171" },
  pending:   { bg: "rgba(201,166,70,0.15)",  border: "rgba(201,166,70,0.4)",  color: "#C9A646" },
};

// ── Property Card ─────────────────────────────────────────────────────────────

function PropertyCard({ property, agentName, agentPhone }: {
  property: Property;
  agentName: string;
  agentPhone: string;
}) {
  const waMsg = encodeURIComponent(
    `Hello ${agentName}, I'm interested in "${property.title}". Could you share more details?`
  );
  const waLink = `https://wa.me/${agentPhone.replace(/[^0-9]/g, "")}?text=${waMsg}`;
  const s = STATUS_STYLE[property.status] ?? STATUS_STYLE.available;

  return (
    <article
      className="card-hover property-card"
      style={{
        overflow: "hidden",
        borderRadius: "1.375rem",
        border: "1px solid rgba(201,166,70,0.22)",
        background: "linear-gradient(160deg,#1e2636 0%,#151b27 60%,#12171f 100%)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        boxShadow: "0 2px 0 0 rgba(201,166,70,0.35) inset,0 16px 48px rgba(0,0,0,0.5),0 4px 16px rgba(201,166,70,0.06)",
      }}
    >
      {/* Gold top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 2,
        background: "linear-gradient(90deg,rgba(201,166,70,0.9),rgba(255,220,120,1),rgba(201,166,70,0.9))",
      }} />

      {/* Image */}
      <Link href={`/properties/${property.id}`} style={{ display: "block", overflow: "hidden", position: "relative", flexShrink: 0 }}>
        {property.mainImage ? (
          <Image
            src={property.mainImage} alt={property.title}
            width={900} height={600}
            className="property-card-img"
            style={{ height: "220px", width: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
          />
        ) : (
          <div style={{ height: "220px", background: "#1a2030", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a3448" strokeWidth="1">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(12,15,22,0.65) 0%,transparent 50%)", pointerEvents: "none" }} />

        {/* Status */}
        <div style={{
          position: "absolute", top: "0.875rem", left: "0.875rem",
          borderRadius: "9999px", backdropFilter: "blur(8px)",
          backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.color,
          fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", padding: "0.3rem 0.75rem",
        }}>
          {property.status}
        </div>

        {/* Type */}
        <div style={{
          position: "absolute", top: "0.875rem", right: "0.875rem",
          borderRadius: "9999px", backdropFilter: "blur(8px)",
          backgroundColor: "rgba(11,15,25,0.75)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#D1D5DB", fontSize: "0.65rem", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3rem 0.75rem",
        }}>
          {property.type}
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: "1.375rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>

        {/* Title + price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
          <div style={{ flex: 1 }}>
            <Link href={`/properties/${property.id}`} style={{
              display: "block", fontFamily: "Zodiak,Georgia,serif",
              fontSize: "1.1875rem", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.25,
            }}>
              {property.title}
            </Link>
            <p style={{ marginTop: "0.375rem", fontSize: "0.78rem", color: "#9CA3AF", letterSpacing: "0.03em" }}>
              📍 {property.location}
            </p>
          </div>
          <span style={{
            flexShrink: 0, display: "inline-block", borderRadius: "0.5rem",
            border: "1px solid rgba(201,166,70,0.35)",
            background: "linear-gradient(135deg,rgba(201,166,70,0.12),rgba(201,166,70,0.05))",
            color: "#C9A646", fontWeight: 700, fontSize: "0.8rem",
            padding: "0.4rem 0.875rem", boxShadow: "0 2px 8px rgba(201,166,70,0.12)",
          }}>
            {formatPrice(property.price, property.currency)}
          </span>
        </div>

        {/* Spec pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            property.bedrooms > 0 ? `${property.bedrooms} Bed` : null,
            `${property.bathrooms} Bath`,
            `${property.area.toLocaleString()} ${property.areaUnit}`,
          ].filter(Boolean).map((d) => (
            <span key={d!} style={{
              padding: "0.3rem 0.75rem", borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              fontSize: "0.72rem", fontWeight: 500, color: "#D1D5DB",
            }}>
              {d}
            </span>
          ))}
        </div>

        {/* Description */}
        <p style={{
          fontSize: "0.875rem", color: "#9CA3AF", lineHeight: 1.7, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {property.shortDescription}
        </p>

        {/* Gold divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(201,166,70,0.2) 30%,rgba(201,166,70,0.2) 70%,transparent)" }} />

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="btn-gold-hover"
            style={{
              flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
              minHeight: "2.75rem", borderRadius: "9999px",
              background: "linear-gradient(135deg,#d4aa4a 0%,#C9A646 50%,#b8922e 100%)",
              color: "#0B0F19", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em",
              boxShadow: "0 4px 16px rgba(201,166,70,0.25),0 1px 0 rgba(255,220,100,0.4) inset",
            }}>
            Enquire
          </a>
          <Link href={`/properties/${property.id}`}
            className="btn-outline-hover"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minHeight: "2.75rem", borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)", color: "#FFFFFF",
              fontSize: "0.78rem", fontWeight: 600, padding: "0 1.25rem",
            }}>
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────────

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.45rem 1rem", borderRadius: "9999px", fontSize: "0.8rem",
        fontWeight: active ? 700 : 500, cursor: "pointer",
        transition: "all 180ms ease",
        border: active ? "1px solid rgba(201,166,70,0.7)" : "1px solid rgba(255,255,255,0.1)",
        background: active ? "rgba(201,166,70,0.15)" : "rgba(255,255,255,0.03)",
        color: active ? "#C9A646" : "#9CA3AF",
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const ALL_TYPES   = ["All", "Villa", "Apartment", "Penthouse", "Townhouse", "Office"];
const ALL_STATUS  = ["All", "Available", "Sold", "Pending"];
const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest",     label: "Newest First" },
];

export default function PropertiesClient({
  properties,
  agent,
}: {
  properties: Property[];
  agent: Agent;
}) {
  const [search,  setSearch]  = useState("");
  const [type,    setType]    = useState("All");
  const [status,  setStatus]  = useState("All");
  const [sort,    setSort]    = useState("default");

  const filtered = useMemo(() => {
    let list = [...properties];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }

    if (type !== "All")
      list = list.filter((p) => p.type.toLowerCase() === type.toLowerCase());

    if (status !== "All")
      list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());

    if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest")     list.reverse();

    return list;
  }, [properties, search, type, status, sort]);

  const availCount = properties.filter((p) => p.status === "available").length;
  const soldCount  = properties.filter((p) => p.status === "sold").length;

  return (
    <>
      {/* ── Hero banner ───────────────────────────────── */}
      <section style={{
        paddingTop: "8rem", paddingBottom: "4rem",
        background: "linear-gradient(180deg,rgba(201,166,70,0.05) 0%,transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="container">
          <span className="section-label anim-fade-up delay-1">All Listings</span>
          <h1
            className="anim-fade-up delay-2"
            style={{
              fontFamily: "Zodiak,Georgia,serif",
              fontSize: "clamp(2.5rem,5vw,4rem)",
              fontWeight: 400, color: "#FFFFFF", marginBottom: "1rem",
            }}
          >
            Property <span style={{ color: "#C9A646" }}>Portfolio</span>
          </h1>
          <p className="anim-fade-up delay-3" style={{ color: "#9CA3AF", fontSize: "1rem", maxWidth: "480px", lineHeight: 1.75 }}>
            Browse our complete collection of exclusive properties across Dubai's most prestigious locations.
          </p>

          {/* Quick stats */}
          <div className="anim-fade-up delay-4" style={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {[
              { value: properties.length, label: "Total Listings" },
              { value: availCount,        label: "Available" },
              { value: soldCount,         label: "Sold" },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  fontFamily: "Zodiak,Georgia,serif",
                  fontSize: "1.75rem", fontWeight: 400, color: "#C9A646",
                }}>
                  {value}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters ───────────────────────────────────── */}
      <section style={{
        position: "sticky", top: "72px", zIndex: 30,
        background: "rgba(11,15,25,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "1rem 0",
      }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem", alignItems: "center" }}>

            {/* Search */}
            <div style={{ position: "relative", flexGrow: 1, minWidth: "200px", maxWidth: "280px" }}>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#6B7280" strokeWidth="2"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties…"
                style={{
                  width: "100%", paddingLeft: "2.25rem", paddingRight: "0.875rem",
                  height: "2.5rem", borderRadius: "9999px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)", color: "#FFFFFF",
                  fontSize: "0.85rem", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e  => (e.target.style.borderColor = "rgba(201,166,70,0.5)")}
                onBlur={e   => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* Type chips */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {ALL_TYPES.map((t) => (
                <Chip key={t} label={t} active={type === t} onClick={() => setType(t)} />
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.08)" }} />

            {/* Status chips */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {ALL_STATUS.map((s) => (
                <Chip key={s} label={s} active={status === s} onClick={() => setStatus(s)} />
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                marginLeft: "auto", height: "2.5rem", padding: "0 1rem",
                borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "#D1D5DB",
                fontSize: "0.8rem", cursor: "pointer", outline: "none",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#151b27" }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container">

          {/* Results count */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
              Showing <span style={{ color: "#C9A646", fontWeight: 600 }}>{filtered.length}</span> {filtered.length === 1 ? "property" : "properties"}
              {type !== "All" && ` · ${type}`}
              {status !== "All" && ` · ${status}`}
            </p>
            {(search || type !== "All" || status !== "All") && (
              <button
                onClick={() => { setSearch(""); setType("All"); setStatus("All"); setSort("default"); }}
                style={{ fontSize: "0.8rem", color: "#C9A646", cursor: "pointer", background: "none", border: "none", letterSpacing: "0.05em" }}
              >
                Clear filters ✕
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "1rem",
              borderRadius: "1.5rem", border: "1px dashed rgba(255,255,255,0.1)",
              padding: "6rem 2rem", textAlign: "center",
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a3448" strokeWidth="1">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p style={{ fontWeight: 600, color: "#FFFFFF" }}>No properties found</p>
              <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>Try adjusting your filters or search term.</p>
              <button
                onClick={() => { setSearch(""); setType("All"); setStatus("All"); }}
                className="btn-outline-hover"
                style={{
                  marginTop: "0.5rem", padding: "0.6rem 1.5rem", borderRadius: "9999px",
                  border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF",
                  fontSize: "0.85rem", fontWeight: 600, background: "transparent",
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid", gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(320px,100%), 1fr))",
            }}>
              {filtered.map((p, i) => (
                <div key={p.id} className="reveal" style={{ animationDelay: `${(i % 6) * 0.07}s` }}>
                  <PropertyCard property={p} agentName={agent.name} agentPhone={agent.whatsapp} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "clamp(1.5rem,3vw,2.25rem)", color: "#FFFFFF", marginBottom: "0.75rem" }}>
            Can't find what you're looking for?
          </p>
          <p style={{ color: "#9CA3AF", marginBottom: "2rem", maxWidth: "420px", margin: "0 auto 2rem" }}>
            Speak directly with {agent.name} for off-market listings and personalised recommendations.
          </p>
          <a
            href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g,"")}?text=${encodeURIComponent(`Hello ${agent.name}, I'm looking for a property but couldn't find what I need on your website. Can you help?`)}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-gold-hover"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "0 2.5rem", minHeight: "3.25rem", borderRadius: "9999px",
              background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
              color: "#0B0F19", fontWeight: 700, fontSize: "0.9rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat with Agent
          </a>
        </div>
      </section>
    </>
  );
}