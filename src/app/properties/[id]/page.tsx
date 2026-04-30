import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPropertyById, getAllProperties, getSiteContent } from "@/lib/data";

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

export async function generateStaticParams() {
  const properties = getAllProperties();
  return properties.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.title} — Luxury RE`,
    description: property.shortDescription,
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  const content = getSiteContent();
  const { agent } = content;
  const s = STATUS_STYLE[property.status] ?? STATUS_STYLE.available;

  const waMsg = encodeURIComponent(
    `Hello ${agent.name}, I'm interested in "${property.title}" (${formatPrice(property.price, property.currency)}). Could you provide more details?`
  );
  const waLink = `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}?text=${waMsg}`;

  const allImages = [
    ...(property.mainImage ? [property.mainImage] : []),
    ...(property.gallery ?? []),
  ];

  const specs = [
    { icon: "🛏", label: "Bedrooms",  value: property.bedrooms > 0 ? `${property.bedrooms}` : "—" },
    { icon: "🚿", label: "Bathrooms", value: `${property.bathrooms}` },
    { icon: "📐", label: "Area",      value: `${property.area.toLocaleString()} ${property.areaUnit}` },
    { icon: "🏷", label: "Type",      value: property.type },
    { icon: "📍", label: "Location",  value: property.location },
    { icon: "💰", label: "Price",     value: formatPrice(property.price, property.currency) },
  ];

  return (
    <>
      {/* ── Main content ────────────────────────────── */}
      <section className="section-pad">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
          }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Main image */}
              <div style={{
                position: "relative",
                borderRadius: "1.375rem",
                overflow: "hidden",
                border: "1px solid rgba(201,166,70,0.2)",
                boxShadow: "0 2px 0 0 rgba(201,166,70,0.3) inset, 0 24px 64px rgba(0,0,0,0.5)",
              }}>
                {/* Gold top line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 2,
                  background: "linear-gradient(90deg,rgba(201,166,70,0.9),rgba(255,220,120,1),rgba(201,166,70,0.9))",
                }} />

                {property.mainImage ? (
                  <Image
                    src={property.mainImage}
                    alt={property.title}
                    width={1200} height={700}
                    priority
                    style={{ width: "100%", height: "clamp(260px, 45vw, 560px)", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{ height: "420px", background: "#1a2030", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2a3448" strokeWidth="0.8">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                )}

                {/* Overlay badges */}
                <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem", display: "flex", gap: "0.5rem", zIndex: 3 }}>
                  <span style={{
                    borderRadius: "9999px", backdropFilter: "blur(8px)",
                    backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.color,
                    fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", padding: "0.35rem 0.875rem",
                  }}>
                    {property.status}
                  </span>
                  <span style={{
                    borderRadius: "9999px", backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(11,15,25,0.8)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "#D1D5DB", fontSize: "0.7rem", fontWeight: 600,
                    letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.35rem 0.875rem",
                  }}>
                    {property.type}
                  </span>
                </div>
              </div>

              {/* Gallery thumbnails */}
              {allImages.length > 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.625rem" }}>
                  {allImages.map((img, i) => (
                    <div key={i} style={{
                      borderRadius: "0.75rem", overflow: "hidden",
                      border: i === 0 ? "2px solid rgba(201,166,70,0.6)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                    }}>
                      <Image
                        src={img} alt={`${property.title} photo ${i + 1}`}
                        width={200} height={140}
                        style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div style={{
                borderRadius: "1.375rem",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
                padding: "2rem",
              }}>
                <h2 style={{
                  fontFamily: "Zodiak,Georgia,serif",
                  fontSize: "1.375rem", fontWeight: 400,
                  color: "#FFFFFF", marginBottom: "1.25rem",
                }}>
                  About this property
                </h2>
                <div style={{ color: "#9CA3AF", lineHeight: 1.85, fontSize: "0.9375rem", whiteSpace: "pre-wrap" }}>
                  {property.fullDescription || property.shortDescription}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (sidebar) ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Price + title card */}
              <div style={{
                borderRadius: "1.375rem",
                border: "1px solid rgba(201,166,70,0.22)",
                background: "linear-gradient(160deg,#1e2636 0%,#151b27 60%,#12171f 100%)",
                padding: "1.75rem 2rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 2px 0 0 rgba(201,166,70,0.35) inset,0 16px 48px rgba(0,0,0,0.4)",
              }}>
                {/* Gold top line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                  background: "linear-gradient(90deg,rgba(201,166,70,0.9),rgba(255,220,120,1),rgba(201,166,70,0.9))",
                }} />

                <span className="section-label" style={{ marginBottom: "0.5rem" }}>
                  {property.location}
                </span>
                <h1 style={{
                  fontFamily: "Zodiak,Georgia,serif",
                  fontSize: "clamp(1.6rem,3vw,2.25rem)",
                  fontWeight: 400, color: "#FFFFFF",
                  lineHeight: 1.15, marginBottom: "1.25rem",
                }}>
                  {property.title}
                </h1>

                {/* Price */}
                <div style={{
                  borderRadius: "0.875rem",
                  border: "1px solid rgba(201,166,70,0.25)",
                  background: "rgba(201,166,70,0.07)",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9A646", marginBottom: "4px" }}>
                    Asking Price
                  </p>
                  <p style={{
                    fontFamily: "Zodiak,Georgia,serif",
                    fontSize: "2rem", fontWeight: 400, color: "#C9A646",
                  }}>
                    {formatPrice(property.price, property.currency)}
                  </p>
                </div>

                {/* CTA buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="btn-gold-hover"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      minHeight: "3rem", borderRadius: "9999px",
                      background: "linear-gradient(135deg,#d4aa4a 0%,#C9A646 50%,#b8922e 100%)",
                      color: "#0B0F19", fontWeight: 700, fontSize: "0.875rem",
                      boxShadow: "0 4px 16px rgba(201,166,70,0.3)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Enquire on WhatsApp
                  </a>
                  <a href={`tel:${agent.phone}`}
                    className="btn-outline-hover"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      minHeight: "3rem", borderRadius: "9999px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#FFFFFF", fontWeight: 600, fontSize: "0.875rem",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                    </svg>
                    Call Agent
                  </a>
                </div>
              </div>

              {/* Specs grid */}
              <div style={{
                borderRadius: "1.375rem",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
                padding: "1.75rem",
              }}>
                <h3 style={{
                  fontFamily: "Zodiak,Georgia,serif",
                  fontSize: "1.125rem", fontWeight: 400,
                  color: "#FFFFFF", marginBottom: "1.25rem",
                }}>
                  Property Details
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                  {specs.map(({ icon, label, value }) => (
                    <div key={label} style={{
                      borderRadius: "0.875rem",
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.03)",
                      padding: "0.875rem 1rem",
                    }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#C9A646", marginBottom: "0.35rem" }}>
                        {icon} {label}
                      </p>
                      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#FFFFFF" }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent card */}
              <div style={{
                borderRadius: "1.375rem",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
                padding: "1.75rem",
              }}>
                <h3 style={{
                  fontFamily: "Zodiak,Georgia,serif",
                  fontSize: "1.125rem", fontWeight: 400,
                  color: "#FFFFFF", marginBottom: "1.25rem",
                }}>
                  Listed by
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "9999px", flexShrink: 0,
                    overflow: "hidden", border: "2px solid rgba(201,166,70,0.35)",
                    background: "#1a2030",
                  }}>
                    {agent.photo ? (
                      <Image src={agent.photo} alt={agent.name} width={56} height={56}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a4458" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.05rem", fontWeight: 400, color: "#FFFFFF" }}>
                      {agent.name}
                    </p>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C9A646", marginTop: "2px" }}>
                      {agent.specialization}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#9CA3AF", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  {agent.bio.slice(0, 120)}…
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="btn-gold-hover"
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                      minHeight: "2.5rem", borderRadius: "9999px",
                      background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
                      color: "#0B0F19", fontSize: "0.78rem", fontWeight: 700,
                    }}
                  >
                    WhatsApp
                  </a>
                  <a href={`tel:${agent.phone}`}
                    className="btn-outline-hover"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      minHeight: "2.5rem", borderRadius: "9999px", padding: "0 1.25rem",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 600,
                    }}
                  >
                    Call
                  </a>
                </div>
              </div>

              {/* Back link */}
              <Link href="/properties" className="back-link">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
  Back to all properties
</Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Two-column layout on desktop ── */}
      <style>{`
        @media (min-width: 960px) {
          .detail-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
          }
        }
      `}</style>
    </>
  );
}