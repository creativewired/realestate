import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPropertyById, getAllProperties, getSiteContent } from "@/lib/data";
import PropertyGallery from "@/components/PropertyGallery";

function formatPrice(price: number, currency: string) {
  if (price >= 1_000_000) return `${currency} ${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000)     return `${currency} ${(price / 1_000).toFixed(0)}K`;
  return `${currency} ${price.toLocaleString()}`;
}

const STATUS_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  available: { bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.35)",  color: "#4ade80" },
  sold:      { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.35)",   color: "#f87171" },
  pending:   { bg: "rgba(201,166,70,0.12)",  border: "rgba(201,166,70,0.35)",  color: "#C9A646" },
};

const ICONS = {
  bed: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M2 14h20"/><path d="M7 14v-3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3"/><path d="M2 20h20"/></svg>),
  bath: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>),
  area: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>),
  type: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  location: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  price: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
  whatsapp: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>),
  phone: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>),
  user: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a4458" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
};

export async function generateStaticParams() {
  return getAllProperties().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.title} — Luxury Real Estate`,
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
    { icon: ICONS.bed,      label: "Bedrooms",  value: property.bedrooms > 0 ? `${property.bedrooms}` : "Studio" },
    { icon: ICONS.bath,     label: "Bathrooms", value: `${property.bathrooms}` },
    { icon: ICONS.area,     label: "Area",      value: `${property.area.toLocaleString()} ${property.areaUnit}` },
    { icon: ICONS.type,     label: "Type",      value: property.type },
    { icon: ICONS.location, label: "Location",  value: property.location },
    { icon: ICONS.price,    label: "Price",     value: formatPrice(property.price, property.currency) },
  ];

  return (
    <>
      <style>{`
        /* ── Mobile: flat flex, ordered ── */
        .detail-outer   { display: flex; flex-direction: column; gap: 1.75rem; }
        /* display:contents makes wrapper divs transparent — children join the outer flex */
        .left-col, .right-col { display: contents; }
        .d-gallery    { order: 1; }
        .d-status     { order: 2; }
        .d-specs-grid { order: 3; }
        .d-desc       { order: 4; }
        .d-quick      { display: none; } /* hidden on mobile — specs-grid covers it */
        .d-price-cta  { order: 5; }
        .d-agent      { order: 6; }
        .d-back       { order: 7; }

        /* ── Desktop: restore two-column grid ── */
        @media (min-width: 960px) {
          .detail-outer {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 2.5rem;
            align-items: start;
          }
          .left-col {
            display: flex;
            flex-direction: column;
            gap: 1.75rem;
            grid-column: 1;
          }
          .right-col {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            grid-column: 2;
            position: sticky;
            top: 96px;
          }
          /* Reset all order values on desktop */
          .d-gallery, .d-status, .d-desc, .d-quick,
          .d-price-cta, .d-specs-grid, .d-agent, .d-back {
            order: unset;
          }
          .d-quick { display: grid; } /* show quick specs on desktop */
        }

        .spec-card { transition: background 0.2s, border-color 0.2s; }
        .spec-card:hover { background: rgba(201,166,70,0.06) !important; border-color: rgba(201,166,70,0.2) !important; }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{ paddingTop: "6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ paddingBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#6B7280" }}>
            <Link href="/"           style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#3a4458" }}>/</span>
            <Link href="/properties" style={{ color: "#6B7280", textDecoration: "none" }}>Properties</Link>
            <span style={{ color: "#3a4458" }}>/</span>
            <span style={{ color: "#9CA3AF", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {property.title}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="section-pad" style={{ paddingTop: "2.5rem" }}>
        <div className="container">
          <div className="detail-outer">

            {/* ════ LEFT COLUMN ════ */}
            <div className="left-col">

              {/* 1 — Gallery */}
              <div className="d-gallery">
                <PropertyGallery images={allImages} title={property.title} />
              </div>

              {/* 2 — Status + type row */}
              <div className="d-status" style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                <span style={{
                  borderRadius: "9999px", backdropFilter: "blur(8px)",
                  backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.color,
                  fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", padding: "0.35rem 0.875rem",
                }}>
                  {property.status}
                </span>
                <span style={{
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#9CA3AF", fontSize: "0.65rem", fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.35rem 0.875rem",
                }}>
                  {property.type}
                </span>
                <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "#6B7280" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {property.location}
                </span>
              </div>

              {/* 3 — Description */}
              <div className="d-desc" style={{
                borderRadius: "1.375rem",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(160deg,#1a2030 0%,#13182200 100%)",
                padding: "2rem 2.25rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.25rem", fontWeight: 400, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                    About this property
                  </h2>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,rgba(201,166,70,0.3),transparent)" }} />
                </div>
                <div style={{ color: "#9CA3AF", lineHeight: 1.9, fontSize: "0.9375rem", whiteSpace: "pre-wrap", letterSpacing: "0.01em" }}>
                  {property.fullDescription || property.shortDescription}
                </div>
              </div>

              {/* 4 — Quick 3-col icon specs (desktop only) */}
              <div className="d-quick" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: "0.625rem" }}>
                {[
                  { label: "Bedrooms",  value: property.bedrooms > 0 ? `${property.bedrooms}` : "Studio", icon: ICONS.bed },
                  { label: "Bathrooms", value: `${property.bathrooms}`,                                    icon: ICONS.bath },
                  { label: "Area",      value: `${property.area.toLocaleString()} ${property.areaUnit}`,   icon: ICONS.area },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{
                    borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.03)", padding: "1rem",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", textAlign: "center",
                  }}>
                    <span style={{ color: "#C9A646" }}>{icon}</span>
                    <p style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF" }}>{value}</p>
                    <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6B7280" }}>{label}</p>
                  </div>
                ))}
              </div>

            </div>
            {/* ════ end LEFT COLUMN ════ */}

            {/* ════ RIGHT COLUMN ════ */}
            <div className="right-col">

              {/* 5 — Price + Title + CTA */}
              <div className="d-price-cta" style={{
                borderRadius: "1.375rem",
                border: "1px solid rgba(201,166,70,0.22)",
                background: "linear-gradient(160deg,#1e2636 0%,#151b27 60%,#12171f 100%)",
                padding: "2rem",
                position: "relative", overflow: "hidden",
                boxShadow: "0 2px 0 0 rgba(201,166,70,0.35) inset, 0 24px 64px rgba(0,0,0,0.5)",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,rgba(201,166,70,0.9),rgba(255,220,120,1),rgba(201,166,70,0.9))" }} />
                <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "180px", height: "180px", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(201,166,70,0.08) 0%,transparent 70%)" }} />

                <span className="section-label" style={{ marginBottom: "0.625rem", display: "block" }}>
                  {property.location}
                </span>
                <h1 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.2, marginBottom: "1.5rem" }}>
                  {property.title}
                </h1>

                <div style={{
                  borderRadius: "1rem", border: "1px solid rgba(201,166,70,0.2)",
                  background: "linear-gradient(135deg,rgba(201,166,70,0.1),rgba(201,166,70,0.04))",
                  padding: "1.25rem 1.5rem", marginBottom: "1.75rem",
                }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A646", marginBottom: "6px" }}>
                    Asking Price
                  </p>
                  <p style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "clamp(1.75rem,3vw,2.25rem)", fontWeight: 400, color: "#C9A646", lineHeight: 1 }}>
                    {formatPrice(property.price, property.currency)}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-gold-hover"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      minHeight: "3.125rem", borderRadius: "9999px",
                      background: "linear-gradient(135deg,#d4aa4a 0%,#C9A646 50%,#b8922e 100%)",
                      color: "#0B0F19", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.04em",
                      boxShadow: "0 4px 20px rgba(201,166,70,0.3), 0 1px 0 rgba(255,220,100,0.4) inset",
                    }}>
                    {ICONS.whatsapp} Enquire on WhatsApp
                  </a>
                  <a href={`tel:${agent.phone}`} className="btn-outline-hover"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      minHeight: "3.125rem", borderRadius: "9999px",
                      border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)",
                      color: "#FFFFFF", fontWeight: 600, fontSize: "0.875rem",
                    }}>
                    {ICONS.phone} Call Agent
                  </a>
                </div>
              </div>

              {/* 6 — Specs grid */}
              <div className="d-specs-grid" style={{
                borderRadius: "1.375rem",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
                padding: "1.75rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", fontWeight: 400, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                    Property Details
                  </h3>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,rgba(255,255,255,0.08),transparent)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {specs.map(({ icon, label, value }) => (
                    <div key={label} className="spec-card" style={{
                      borderRadius: "0.875rem", border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.03)", padding: "1rem 1.125rem",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.5rem", color: "#C9A646" }}>
                        {icon}
                        <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#C9A646" }}>{label}</p>
                      </div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#FFFFFF" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7 — Agent card */}
              <div className="d-agent" style={{
                borderRadius: "1.375rem",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
                padding: "1.75rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", fontWeight: 400, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                    Listed by
                  </h3>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,rgba(255,255,255,0.08),transparent)" }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "9999px", flexShrink: 0, overflow: "hidden", border: "2px solid rgba(201,166,70,0.35)", background: "#1a2030", position: "relative" }}>
                    {agent.photo
                      ? <Image src={agent.photo} alt={agent.name} width={60} height={60} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{ICONS.user}</div>
                    }
                    <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "10px", height: "10px", borderRadius: "9999px", background: "#4ade80", border: "2px solid #151b27" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.05rem", fontWeight: 400, color: "#FFFFFF" }}>{agent.name}</p>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C9A646", marginTop: "3px" }}>{agent.specialization}</p>
                    <p style={{ fontSize: "0.72rem", color: "#6B7280", marginTop: "2px" }}>{agent.city}, UAE</p>
                  </div>
                </div>

                <p style={{ fontSize: "0.85rem", color: "#9CA3AF", lineHeight: 1.75, marginBottom: "1.5rem", borderLeft: "2px solid rgba(201,166,70,0.3)", paddingLeft: "0.875rem" }}>
                  {agent.bio.slice(0, 130)}…
                </p>

                <div style={{ display: "flex", gap: "0.625rem" }}>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-gold-hover"
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      minHeight: "2.625rem", borderRadius: "9999px",
                      background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
                      color: "#0B0F19", fontSize: "0.8rem", fontWeight: 700,
                    }}>
                    {ICONS.whatsapp} WhatsApp
                  </a>
                  <a href={`tel:${agent.phone}`} className="btn-outline-hover"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      minHeight: "2.625rem", borderRadius: "9999px", padding: "0 1.25rem",
                      border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)",
                      color: "#FFFFFF", fontSize: "0.8rem", fontWeight: 600,
                    }}>
                    {ICONS.phone} Call
                  </a>
                </div>
              </div>

              {/* 8 — Back link */}
              <div className="d-back">
                <Link href="/properties" style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "0.8rem", color: "#6B7280", textDecoration: "none", letterSpacing: "0.04em",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back to all properties
                </Link>
              </div>

            </div>
            {/* ════ end RIGHT COLUMN ════ */}

          </div>
        </div>
      </section>
    </>
  );
}