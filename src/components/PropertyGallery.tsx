'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  // Keyboard nav
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  if (images.length === 0) return (
    <div style={{ height: "420px", background: "#1a2030", borderRadius: "1.375rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2a3448" strokeWidth="0.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>
  );

  return (
    <>
      {/* ── Main viewer ── */}
      <div style={{
        position: "relative", borderRadius: "1.375rem", overflow: "hidden",
        border: "1px solid rgba(201,166,70,0.2)",
        boxShadow: "0 2px 0 0 rgba(201,166,70,0.3) inset, 0 24px 64px rgba(0,0,0,0.5)",
      }}>
        {/* Gold top line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 2,
          background: "linear-gradient(90deg,rgba(201,166,70,0.9),rgba(255,220,120,1),rgba(201,166,70,0.9))",
        }} />

        {/* Main image — clickable to open lightbox */}
        <div onClick={() => setLightbox(true)} style={{ cursor: "zoom-in" }}>
          <Image
            src={images[active]}
            alt={`${title} photo ${active + 1}`}
            width={1200} height={700}
            priority={active === 0}
            style={{ width: "100%", height: "clamp(260px,45vw,560px)", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(12,15,22,0.5) 0%,transparent 40%)", pointerEvents: "none" }} />

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous image" style={arrowStyle("left")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button onClick={next} aria-label="Next image" style={arrowStyle("right")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div style={{
            position: "absolute", bottom: "1rem", right: "1rem", zIndex: 3,
            borderRadius: "9999px", backdropFilter: "blur(8px)",
            background: "rgba(11,15,25,0.75)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#D1D5DB", fontSize: "0.7rem", fontWeight: 600,
            letterSpacing: "0.08em", padding: "0.3rem 0.75rem",
          }}>
            {active + 1} / {images.length}
          </div>
        )}

        {/* Expand icon */}
        <button onClick={() => setLightbox(true)} aria-label="Open fullscreen" style={{
          position: "absolute", bottom: "1rem", left: "1rem", zIndex: 3,
          borderRadius: "9999px", backdropFilter: "blur(8px)",
          background: "rgba(11,15,25,0.75)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#D1D5DB", cursor: "pointer", padding: "0.4rem",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </button>
      </div>

      {/* ── Thumbnails ── */}
      {images.length > 1 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
          gap: "0.625rem",
          marginTop: "0.75rem",
        }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              style={{
                borderRadius: "0.75rem", overflow: "hidden", cursor: "pointer",
                border: i === active
                  ? "2px solid rgba(201,166,70,0.8)"
                  : "2px solid transparent",
                outline: "none", padding: 0, background: "none",
                opacity: i === active ? 1 : 0.55,
                transition: "opacity 0.2s, border-color 0.2s",
                boxShadow: i === active ? "0 0 0 1px rgba(201,166,70,0.3)" : "none",
              }}
            >
              <Image
                src={img} alt={`${title} thumbnail ${i + 1}`}
                width={200} height={140}
                style={{ width: "100%", height: "72px", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.95)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Stop click-through on image */}
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <Image
              src={images[active]}
              alt={`${title} fullscreen ${active + 1}`}
              width={1600} height={1000}
              style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: "0.75rem" }}
            />

            {/* Prev */}
            {images.length > 1 && (
              <button onClick={prev} aria-label="Previous" style={lightboxArrow("left")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button onClick={next} aria-label="Next" style={lightboxArrow("right")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            )}

            {/* Close */}
            <button onClick={() => setLightbox(false)} aria-label="Close" style={{
              position: "absolute", top: "-2.5rem", right: 0,
              background: "none", border: "none", color: "#FFFFFF",
              cursor: "pointer", fontSize: "1.5rem", lineHeight: 1,
            }}>
              ✕
            </button>

            {/* Counter */}
            <div style={{
              position: "absolute", bottom: "-2rem", left: "50%", transform: "translateX(-50%)",
              color: "#9CA3AF", fontSize: "0.8rem",
            }}>
              {active + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Style helpers ──────────────────────────────────────────────────────────────

function arrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 3,
    [side]: "0.875rem",
    width: "2.5rem", height: "2.5rem", borderRadius: "9999px",
    backdropFilter: "blur(8px)",
    background: "rgba(11,15,25,0.75)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#FFFFFF", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s",
  };
}

function lightboxArrow(side: "left" | "right"): React.CSSProperties {
  return {
    position: "fixed", top: "50%", transform: "translateY(-50%)",
    [side]: "1.5rem",
    width: "3rem", height: "3rem", borderRadius: "9999px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#FFFFFF", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
}