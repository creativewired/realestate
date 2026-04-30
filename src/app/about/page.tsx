import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/data";

export async function generateMetadata() {
  const { agent, seo } = getSiteContent();
  return {
    title: `About ${agent.name} — ${seo.siteName}`,
    description: agent.bio,
  };
}

export default function AboutPage() {
  const content  = getSiteContent();
  const { agent, about } = content;

  const waMsg  = encodeURIComponent(`Hello ${agent.name}, I'd like to get in touch regarding a property.`);
  const waLink = agent.whatsapp
    ? `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}?text=${waMsg}`
    : "#";

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        paddingTop: "8rem", paddingBottom: "5rem",
        background: "radial-gradient(ellipse at 60% 0%, rgba(201,166,70,0.07) 0%, transparent 60%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="container">
          <div style={{
            display: "grid", gap: "3rem", alignItems: "center",
            gridTemplateColumns: "1fr",
          }} className="about-hero-grid">

            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <span className="section-label">About the Agent</span>
              <h1 style={{
                fontFamily: "Zodiak,Georgia,serif",
                fontSize: "clamp(2rem,4vw,3.25rem)",
                fontWeight: 400, color: "#FFFFFF",
                lineHeight: 1.15,
              }}>
                {about?.headline ?? `About ${agent.name}`}
              </h1>
              <p style={{ color: "#9CA3AF", fontSize: "1rem", lineHeight: 1.8, maxWidth: "52ch" }}>
                {about?.subheadline ?? agent.bio}
              </p>
              <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    minHeight: "3rem", borderRadius: "9999px", padding: "0 1.75rem",
                    background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
                    color: "#0B0F19", fontWeight: 700, fontSize: "0.875rem",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Me
                </a>
                <a href={`tel:${agent.phone}`}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minHeight: "3rem", borderRadius: "9999px", padding: "0 1.75rem",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#FFFFFF", fontWeight: 600, fontSize: "0.875rem",
                  }}
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Photo + credentials */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Photo card */}
              <div style={{
                borderRadius: "1.5rem",
                border: "1px solid rgba(201,166,70,0.22)",
                overflow: "hidden", position: "relative",
                boxShadow: "0 2px 0 0 rgba(201,166,70,0.35) inset, 0 24px 64px rgba(0,0,0,0.5)",
              }}>
                {/* Gold top line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 2,
                  background: "linear-gradient(90deg,rgba(201,166,70,0.9),rgba(255,220,120,1),rgba(201,166,70,0.9))",
                }} />
                {agent.photo ? (
                  <Image
                    src={agent.photo} alt={agent.name}
                    width={600} height={500}
                    style={{ width: "100%", height: "clamp(300px,40vw,460px)", objectFit: "cover", objectPosition: "top", display: "block" }}
                  />
                ) : (
                  <div style={{
                    height: "360px", background: "linear-gradient(160deg,#1e2636,#151b27)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2a3448" strokeWidth="0.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
                {/* Name overlay */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2,
                  padding: "2rem 1.5rem 1.5rem",
                  background: "linear-gradient(to top, rgba(8,12,20,0.95) 0%, transparent 100%)",
                }}>
                  <p style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.25rem", color: "#FFFFFF", fontWeight: 400 }}>
                    {agent.name}
                  </p>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9A646", marginTop: "4px" }}>
                    {agent.specialization}
                  </p>
                </div>
              </div>

              {/* Credentials grid */}
              {about?.credentials && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                  {about.credentials.map(({ label, value }) => (
                    <div key={label} style={{
                      borderRadius: "0.875rem",
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "linear-gradient(160deg,#1e2636,#151b27)",
                      padding: "0.875rem 1rem",
                    }}>
                      <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#C9A646", marginBottom: "3px" }}>
                        {label}
                      </p>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#FFFFFF" }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      {about?.story && (
        <section className="section-pad" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container">
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              <span className="section-label" style={{ marginBottom: "1rem" }}>My Story</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {about.story.split("\n\n").map((para, i) => (
                  <p key={i} style={{ color: "#9CA3AF", lineHeight: 1.9, fontSize: "0.9875rem" }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Highlights ── */}
      {about?.highlights && (
        <section className="section-pad" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <div>
              <span className="section-label">Why Work With Me</span>
              <h2 style={{
                fontFamily: "Zodiak,Georgia,serif",
                fontSize: "clamp(1.75rem,3vw,2.5rem)",
                fontWeight: 400, color: "#FFFFFF", maxWidth: "28ch",
              }}>
                The difference is in the details.
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.25rem" }}>
              {about.highlights.map(({ icon, title, description }) => (
                <div key={title} style={{
                  borderRadius: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
                  padding: "1.75rem",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                    background: "linear-gradient(90deg,transparent,rgba(201,166,70,0.5),transparent)",
                  }} />
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{icon}</div>
                  <h3 style={{
                    fontFamily: "Zodiak,Georgia,serif",
                    fontSize: "1.1rem", fontWeight: 400,
                    color: "#FFFFFF", marginBottom: "0.625rem",
                  }}>
                    {title}
                  </h3>
                  <p style={{ color: "#9CA3AF", fontSize: "0.875rem", lineHeight: 1.75 }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Services ── */}
      {about?.services && (
        <section className="section-pad" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <div>
              <span className="section-label">What I Offer</span>
              <h2 style={{
                fontFamily: "Zodiak,Georgia,serif",
                fontSize: "clamp(1.75rem,3vw,2.5rem)",
                fontWeight: 400, color: "#FFFFFF",
              }}>
                Services
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
              {about.services.map(({ title, description }, i) => (
                <div key={title} style={{
                  borderRadius: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
                  padding: "1.75rem",
                  display: "flex", gap: "1.25rem",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "9999px", flexShrink: 0,
                    background: "rgba(201,166,70,0.12)", border: "1px solid rgba(201,166,70,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Zodiak,Georgia,serif", color: "#C9A646", fontSize: "0.9rem", fontWeight: 600,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "Zodiak,Georgia,serif",
                      fontSize: "1rem", fontWeight: 400,
                      color: "#FFFFFF", marginBottom: "0.5rem",
                    }}>
                      {title}
                    </h3>
                    <p style={{ color: "#9CA3AF", fontSize: "0.85rem", lineHeight: 1.75 }}>
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section-pad">
        <div className="container">
          <div style={{
            borderRadius: "1.5rem",
            border: "1px solid rgba(201,166,70,0.22)",
            background: "linear-gradient(160deg,#1e2636 0%,#151b27 60%,#12171f 100%)",
            padding: "clamp(2rem,5vw,4rem)",
            textAlign: "center", position: "relative", overflow: "hidden",
            boxShadow: "0 2px 0 0 rgba(201,166,70,0.35) inset",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: "linear-gradient(90deg,rgba(201,166,70,0.9),rgba(255,220,120,1),rgba(201,166,70,0.9))",
            }} />
            <span className="section-label" style={{ marginBottom: "1rem" }}>Let&apos;s Talk</span>
            <h2 style={{
              fontFamily: "Zodiak,Georgia,serif",
              fontSize: "clamp(1.75rem,3vw,2.75rem)",
              fontWeight: 400, color: "#FFFFFF",
              marginBottom: "1rem", maxWidth: "28ch", margin: "0 auto 1rem",
            }}>
              Ready to find your next property?
            </h2>
            <p style={{ color: "#9CA3AF", fontSize: "0.9375rem", marginBottom: "2rem", maxWidth: "40ch", margin: "0 auto 2rem" }}>
              Reach out directly — I respond to every enquiry personally.
            </p>
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

      <style>{`
        @media (min-width: 900px) {
          .about-hero-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
      `}</style>
    </>
  );
}