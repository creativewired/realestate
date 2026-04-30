'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Agent } from "@/lib/types";

export default function Navbar({ agent }: { agent?: Agent }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Safe fallbacks — never crash if agent is undefined
  const agentName = agent?.name    ?? "Agent";
  const agentWa   = agent?.whatsapp ?? "";
  const agentPhone = agent?.phone  ?? "#";

  const waLink = agentWa
    ? `https://wa.me/${agentWa.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hello ${agentName}, I'd like to enquire about a property.`
      )}`
    : "#";

  const navLinks: [string, string][] = [
    ["/",           "Home"      ],
    ["/properties", "Properties"],
    ["/about",      "About"     ],

  ];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "background 0.4s ease, border-color 0.4s ease",
      background: scrolled ? "rgba(11,15,25,0.92)" : "transparent",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
    }}>
      <div className="container" style={{
        height: "72px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#C9A646" strokeWidth="1.5" fill="none"/>
            <text x="18" y="22" textAnchor="middle" fill="#C9A646" fontSize="10" fontFamily="serif" fontWeight="600">LR</text>
          </svg>
          <span style={{ fontFamily: "Zodiak, Georgia, serif", color: "#FFFFFF", fontSize: "1.1rem", fontWeight: 400 }}>
            Luxury<span style={{ color: "#C9A646" }}> RE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          {navLinks.map(([href, label]) => (
            <Link
              key={href} href={href}
              style={{
                color: "#D1D5DB", fontSize: "0.875rem", fontWeight: 500,
                textDecoration: "none", letterSpacing: "0.03em", transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A646")}
              onMouseLeave={e => (e.currentTarget.style.color = "#D1D5DB")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={waLink} target="_blank" rel="noopener noreferrer"
          className="desktop-nav btn-gold-hover"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minHeight: "2.5rem", borderRadius: "9999px", padding: "0 1.5rem",
            background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
            color: "#0B0F19", fontWeight: 700, fontSize: "0.8rem",
          }}
        >
          WhatsApp
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="mobile-menu-btn"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#FFFFFF", padding: "8px" }}
          aria-label="Toggle menu"
        >
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "rgba(11,15,25,0.98)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "1.5rem",
        }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {navLinks.map(([href, label]) => (
              <Link
                key={href} href={href}
                onClick={() => setOpen(false)}
                style={{ color: "#D1D5DB", fontSize: "0.95rem", fontWeight: 500, textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
            <a
              href={waLink} target="_blank" rel="noopener noreferrer"
              className="btn-gold-hover"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minHeight: "2.75rem", borderRadius: "9999px", marginTop: "0.5rem",
                background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
                color: "#0B0F19", fontWeight: 700, fontSize: "0.875rem",
              }}
            >
              Chat on WhatsApp
            </a>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
      `}</style>
    </header>
  );
}