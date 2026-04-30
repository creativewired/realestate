import Image from "next/image";
import Link from "next/link";
import { getAllProperties, getSiteContent } from "@/lib/data";
import { Property } from "@/lib/types";

function formatPrice(price: number, currency: string) {
  if (price >= 1_000_000) return `${currency} ${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${currency} ${(price / 1_000).toFixed(0)}K`;
  return `${currency} ${price.toLocaleString()}`;
}

function PropertyCard({ property, agentName, agentPhone }: {
  property: Property;
  agentName: string;
  agentPhone: string;
}) {
  const waMsg = encodeURIComponent(`Hello ${agentName}, I'm interested in "${property.title}". Could you share more details?`);
  const waLink = `https://wa.me/${agentPhone.replace(/[^0-9]/g, "")}?text=${waMsg}`;

  return (
    <article
      className="card-hover property-card"
      style={{
        overflow: "hidden",
        borderRadius: "1.375rem",
        border: "1px solid rgba(201,166,70,0.22)",
        background: "linear-gradient(160deg, #1e2636 0%, #151b27 60%, #12171f 100%)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        boxShadow: "0 2px 0 0 rgba(201,166,70,0.35) inset, 0 16px 48px rgba(0,0,0,0.5), 0 4px 16px rgba(201,166,70,0.06)",
      }}
    >
      {/* Gold top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 2,
        background: "linear-gradient(90deg, rgba(201,166,70,0.9), rgba(255,220,120,1), rgba(201,166,70,0.9))",
        borderRadius: "9999px",
      }} />

      {/* Image */}
      <Link href={`/properties/${property.id}`} style={{ display: "block", overflow: "hidden", position: "relative", flexShrink: 0 }}>
        {property.mainImage ? (
          <Image
            src={property.mainImage}
            alt={property.title}
            width={900} height={600}
            className="property-card-img"
            style={{ height: "230px", width: "100%", objectFit: "cover", transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)", display: "block" }}
            loading="lazy"
          />
        ) : (
          <div style={{ height: "230px", background: "#1a2030", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a3448" strokeWidth="1">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        )}

        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,15,22,0.65) 0%, transparent 50%)", pointerEvents: "none" }} />

        {/* Status badge */}
        <div style={{
          position: "absolute", top: "0.875rem", left: "0.875rem",
          borderRadius: "9999px", backdropFilter: "blur(8px)",
          backgroundColor: property.status === "available" ? "rgba(74,222,128,0.15)" : property.status === "sold" ? "rgba(239,68,68,0.15)" : "rgba(201,166,70,0.15)",
          border: property.status === "available" ? "1px solid rgba(74,222,128,0.4)" : property.status === "sold" ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(201,166,70,0.4)",
          color: property.status === "available" ? "#4ade80" : property.status === "sold" ? "#f87171" : "#C9A646",
          fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", padding: "0.3rem 0.75rem",
        }}>
          {property.status}
        </div>

        {/* Type badge */}
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

      {/* Content */}
      <div style={{ padding: "1.375rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        {/* Title + price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
          <div style={{ flex: 1 }}>
            <Link href={`/properties/${property.id}`} style={{
              display: "block", fontFamily: "Zodiak, Georgia, serif",
              fontSize: "1.1875rem", fontWeight: 400, color: "#FFFFFF",
              lineHeight: 1.25, letterSpacing: "0.01em", textDecoration: "none",
            }}>
              {property.title}
            </Link>
            <p style={{ marginTop: "0.375rem", fontSize: "0.78rem", color: "#9CA3AF", letterSpacing: "0.03em" }}>
              {property.location}
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <span style={{
              display: "inline-block", borderRadius: "0.5rem",
              border: "1px solid rgba(201,166,70,0.35)",
              background: "linear-gradient(135deg, rgba(201,166,70,0.12), rgba(201,166,70,0.05))",
              color: "#C9A646", fontWeight: 700, fontSize: "0.8rem",
              letterSpacing: "0.03em", padding: "0.4rem 0.875rem",
              boxShadow: "0 2px 8px rgba(201,166,70,0.12)",
            }}>
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
        </div>

        {/* Specs pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            property.bedrooms > 0 ? `${property.bedrooms} Bed` : null,
            `${property.bathrooms} Bath`,
            `${property.area.toLocaleString()} ${property.areaUnit}`,
          ].filter(Boolean).map((d) => (
            <span key={d!} style={{
              display: "inline-flex", alignItems: "center",
              padding: "0.3rem 0.75rem", borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.04)",
              fontSize: "0.72rem", fontWeight: 500, color: "#D1D5DB", letterSpacing: "0.03em",
            }}>
              {d}
            </span>
          ))}
        </div>

        {/* Description */}
        <p style={{
          fontSize: "0.875rem", color: "#9CA3AF", lineHeight: 1.7, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {property.shortDescription}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,166,70,0.2) 30%, rgba(201,166,70,0.2) 70%, transparent)" }} />

       {/* Buttons */}
<div style={{ display: "flex", gap: "0.625rem" }}>
  <a
    href={waLink}
    target="_blank"
    rel="noopener noreferrer"
    className="btn-gold-hover"
    style={{
      flex: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "2.75rem",
      borderRadius: "9999px",
      background: "linear-gradient(135deg, #d4aa4a 0%, #C9A646 50%, #b8922e 100%)",
      color: "#0B0F19",
      fontSize: "0.78rem",
      fontWeight: 700,
      letterSpacing: "0.05em",
      boxShadow: "0 4px 16px rgba(201,166,70,0.25)",
    }}
  >
    Enquire on WhatsApp
  </a>
  <Link
    href={`/properties/${property.id}`}
    className="btn-outline-hover"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "2.75rem",
      borderRadius: "9999px",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(255,255,255,0.04)",
      color: "#FFFFFF",
      fontSize: "0.78rem",
      fontWeight: 600,
      padding: "0 1.25rem",
      letterSpacing: "0.03em",
    }}
  >
    Details
  </Link>
</div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const content = getSiteContent();
const allProperties: Property[] = getAllProperties() ?? [];
const featured = allProperties.filter((p) => p.featured);
  const availableCount = allProperties.filter((p) => p.status === "available").length;
  const soldCount = allProperties.filter((p) => p.status === "sold").length;
  const { agent, homepage } = content;

  const waLink = `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello ${agent.name}, I found your website and I'm interested in a property.`
  )}`;

  return (
    <>
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="section-pad" id="home" style={{ paddingTop: "7rem" }}>
        <div className="container">
          <div className="hero-grid">

            {/* Image */}
            <div className="hero-image anim-scale-in delay-1" style={{ position: "relative", width: "100%", maxWidth: "420px", margin: "0 auto" }}>
              {/* Glow */}
              <div style={{
                position: "absolute", inset: "-2rem", zIndex: 0, borderRadius: "50%", pointerEvents: "none",
                background: "radial-gradient(ellipse at center, rgba(201,166,70,0.18) 0%, transparent 70%)",
              }} />
              {/* Card */}
              <div style={{
                position: "relative", zIndex: 1, overflow: "hidden",
                borderRadius: "1.75rem", border: "1px solid rgba(201,166,70,0.25)",
                backgroundColor: "#1F2937", padding: "0.625rem",
                boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
              }}>
                {agent.photo ? (
                  <Image
                    src={agent.photo} alt={agent.name} width={900} height={1100} priority
                    style={{ height: "520px", width: "100%", objectFit: "cover", objectPosition: "top center", borderRadius: "1.25rem", display: "block" }}
                  />
                ) : (
                  <div style={{ height: "520px", background: "#1a2030", borderRadius: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2a3448" strokeWidth="0.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
                {/* Name badge */}
                <div style={{
                  position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem",
                  borderRadius: "1rem", border: "1px solid rgba(201,166,70,0.25)",
                  backgroundColor: "rgba(11,15,25,0.9)", padding: "1.25rem 1.5rem", backdropFilter: "blur(20px)",
                }}>
                  <p style={{ fontFamily: "Zodiak, Georgia, serif", fontSize: "1.5rem", fontWeight: 400, color: "#FFFFFF" }}>
                    {agent.name}
                  </p>
                  <p style={{ marginTop: "0.3rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A646" }}>
                    {agent.specialization}
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="hero-text" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="anim-fade-up delay-1">
                <span className="section-label">{agent.specialization}</span>
              </div>

              <h1 className="anim-fade-up delay-2" style={{
                fontFamily: "Zodiak, Georgia, serif",
                fontSize: "clamp(2.6rem, 5vw, 4.25rem)",
                lineHeight: 1.05, color: "#FFFFFF", fontWeight: 400,
              }}>
                {homepage.heroTitle.split(" ").slice(0, 3).join(" ")}.{" "}
                <span style={{ color: "#C9A646" }}>{homepage.heroTitle.split(" ").slice(3).join(" ")}.</span>
              </h1>

              <p className="anim-fade-up delay-3" style={{ fontSize: "1.0625rem", color: "#D1D5DB", maxWidth: "480px", lineHeight: 1.75 }}>
                {homepage.heroSubtitle}
              </p>

             <div className="anim-fade-up delay-4" style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
  <a
    href={waLink}
    target="_blank"
    rel="noopener noreferrer"
    className="btn-gold-hover"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "3rem",
      borderRadius: "9999px",
      padding: "0 1.75rem",
      background: "linear-gradient(135deg, #d4aa4a 0%, #C9A646 50%, #b8922e 100%)",
      color: "#0B0F19",
      fontWeight: 700,
      fontSize: "0.9rem",
      boxShadow: "0 4px 16px rgba(201,166,70,0.3)",
    }}
  >
    Chat on WhatsApp
  </a>
  <Link
    href="/properties"
    className="btn-outline-hover"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "3rem",
      borderRadius: "9999px",
      padding: "0 1.75rem",
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.04)",
      color: "#FFFFFF",
      fontWeight: 600,
      fontSize: "0.9rem",
    }}
  >
    Browse listings
  </Link>
</div>

              {/* Stats */}
              <div className="anim-fade-up delay-5" style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem",
                paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)",
              }}>
                {[
                  { value: homepage.stats[3]?.value ?? "2B+", label: "In Sales" },
                  { value: `${availableCount}`,               label: "Active Listings" },
                  { value: agent.city,                        label: "Based in" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p style={{ fontFamily: "Zodiak, Georgia, serif", fontSize: "2rem", fontWeight: 400, color: "#C9A646" }}>{value}</p>
                    <p style={{ fontSize: "0.75rem", color: "#D1D5DB", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "0.25rem" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ──────────────────────── */}
      <section id="properties" className="section-pad" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          <div className="reveal">
            <span className="section-label">Featured listings</span>
            <h2 style={{ fontFamily: "Zodiak, Georgia, serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: "#FFFFFF", maxWidth: "24ch" }}>
              Curated properties, ready for direct enquiry.
            </h2>
          </div>

          {featured.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "1rem", borderRadius: "1.5rem", border: "1px dashed rgba(255,255,255,0.12)",
              padding: "5rem 2rem", textAlign: "center", color: "#D1D5DB",
            }}>
              <p style={{ fontWeight: 600 }}>No featured properties yet.</p>
              <p style={{ fontSize: "0.875rem", opacity: 0.6 }}>Mark properties as featured from the admin dashboard.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {featured.map((p, i) => (
                <div key={p.id} className="reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                  <PropertyCard property={p} agentName={agent.name} agentPhone={agent.whatsapp} />
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center" }}>
  <Link
    href="/properties"
    className="btn-outline-hover"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "3rem",
      borderRadius: "9999px",
      border: "1px solid rgba(255,255,255,0.15)",
      background: "transparent",
      color: "#FFFFFF",
      fontWeight: 600,
      fontSize: "0.875rem",
      letterSpacing: "0.04em",
      padding: "0 2rem",
    }}
  >
    View all {allProperties.length} listings
  </Link>
</div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────── */}
      <section id="about" className="section-pad" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div className="about-grid">
            <div className="reveal">
              <span className="section-label">About the agent</span>
              <h2 style={{ fontFamily: "Zodiak, Georgia, serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: "#FFFFFF", maxWidth: "16ch" }}>
                Honest guidance.{" "}
                <span style={{ color: "#C9A646" }}>Direct access.</span>
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <p className="reveal" style={{ color: "#D1D5DB", maxWidth: "600px", lineHeight: 1.8 }}>{agent.bio}</p>

              <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {[
                  { label: "Location",       value: `${agent.city}, UAE` },
                  { label: "Experience",     value: `${agent.experience}+ Years` },
                  { label: "Phone",          value: agent.phone },
                  { label: "Specialization", value: agent.specialization },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#1F2937", padding: "1.25rem 1.5rem" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9A646", marginBottom: "0.5rem" }}>{label}</p>
                    <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#FFFFFF" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="section-pad" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{
            borderRadius: "1.5rem", border: "1px solid rgba(201,166,70,0.2)",
            background: "linear-gradient(135deg, #1F2937 0%, #0B0F19 60%, rgba(201,166,70,0.06) 100%)",
            padding: "4rem 3rem", boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            display: "flex", flexDirection: "column", gap: "2rem",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <span className="section-label">Get in touch</span>
              <h2 style={{ fontFamily: "Zodiak, Georgia, serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: "#FFFFFF", maxWidth: "22ch" }}>
                Ready to find your next property?
              </h2>
              <p style={{ fontSize: "1rem", color: "#D1D5DB", maxWidth: "480px", lineHeight: 1.75 }}>
                Connect with {agent.name} directly on WhatsApp for fast responses, property details, and viewing arrangements.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  minHeight: "3rem", borderRadius: "9999px", padding: "0 2rem",
                  background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
                  color: "#0B0F19", fontWeight: 700, fontSize: "0.9rem",
                }}
              >
                WhatsApp Me
              </a>
              <Link href="/properties"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  minHeight: "3rem", borderRadius: "9999px", padding: "0 2rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#FFFFFF", fontWeight: 600, fontSize: "0.9rem",
                }}
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}