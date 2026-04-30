import Link from "next/link";
import { Agent, SiteContent } from "@/lib/types";

export default function Footer({ agent, content }: { agent?: Agent; content?: SiteContent }) {
  // Guard — never crash if props missing
  if (!agent || !content) return null;

  const waLink = agent.whatsapp
    ? `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hello ${agent.name}, I found your website and I'm interested in a property.`
      )}`
    : "#";

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "#080C14" }}>
      <div className="container" style={{ padding: "4rem 1.5rem 2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "3rem", marginBottom: "3rem",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#C9A646" strokeWidth="1.5" fill="none"/>
                <text x="18" y="22" textAnchor="middle" fill="#C9A646" fontSize="10" fontFamily="serif" fontWeight="600">LR</text>
              </svg>
              <span style={{ fontFamily: "Zodiak, Georgia, serif", color: "#FFFFFF", fontSize: "1rem" }}>
                Luxury RE
              </span>
            </div>
            <p style={{ color: "#6B7280", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "260px" }}>
              {content.seo?.siteDescription}
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9A646", marginBottom: "1.25rem" }}>
              Navigation
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {([
                ["/",           "Home"        ],
                ["/properties", "Properties"  ],
                ["/about",      "About Agent" ],
              ] as [string, string][]).map(([href, label]) => (
                <Link key={href} href={href} style={{
                  color: "#9CA3AF", fontSize: "0.875rem",
                  textDecoration: "none", transition: "color 0.2s",
                }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div id="contact">
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9A646", marginBottom: "1.25rem" }}>
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {agent.city  && <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>{agent.city}, UAE</p>}
              {agent.phone && <a href={`tel:${agent.phone}`}     style={{ color: "#9CA3AF", fontSize: "0.875rem", textDecoration: "none" }}>{agent.phone}</a>}
              {agent.email && <a href={`mailto:${agent.email}`}  style={{ color: "#9CA3AF", fontSize: "0.875rem", textDecoration: "none" }}>{agent.email}</a>}
            </div>
            <a
              href={waLink} target="_blank" rel="noopener noreferrer"
              className="btn-gold-hover"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minHeight: "2.75rem", borderRadius: "9999px", padding: "0 1.5rem",
                background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
                color: "#0B0F19", fontWeight: 700, fontSize: "0.8rem",
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem",
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", gap: "0.5rem",
        }}>
          <p style={{ color: "#4B5563", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} {content.seo?.siteName}. All rights reserved.
          </p>
          <p style={{ color: "#4B5563", fontSize: "0.8rem" }}>
            {agent.name} · {agent.specialization}
          </p>
        </div>
      </div>
    </footer>
  );
}