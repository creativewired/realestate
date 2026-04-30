'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [show, setShow]         = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "1.5rem",
      background: "radial-gradient(ellipse at 50% 0%, rgba(201,166,70,0.08) 0%, transparent 60%), #080C14",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px",
        borderRadius: "1.5rem",
        border: "1px solid rgba(201,166,70,0.22)",
        background: "linear-gradient(160deg,#1e2636 0%,#151b27 60%,#12171f 100%)",
        padding: "2.5rem",
        boxShadow: "0 2px 0 0 rgba(201,166,70,0.35) inset, 0 32px 64px rgba(0,0,0,0.6)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Gold top line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg,rgba(201,166,70,0.9),rgba(255,220,120,1),rgba(201,166,70,0.9))",
        }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none" style={{ margin: "0 auto 1rem" }}>
            <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#C9A646" strokeWidth="1.5" fill="none"/>
            <text x="18" y="22" textAnchor="middle" fill="#C9A646" fontSize="10" fontFamily="serif" fontWeight="600">LR</text>
          </svg>
          <h1 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.5rem", fontWeight: 400, color: "#FFFFFF" }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "4px" }}>
            Sign in to manage your listings
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
          {/* Username */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#C9A646" }}>
              Username
            </label>
            <input
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              required placeholder="Enter username"
              style={{
                height: "2.75rem", padding: "0 1rem", borderRadius: "0.75rem",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "#FFFFFF",
                fontSize: "0.9rem", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e  => (e.target.style.borderColor = "rgba(201,166,70,0.6)")}
              onBlur={e   => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#C9A646" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="Enter password"
                style={{
                  width: "100%", height: "2.75rem", padding: "0 2.75rem 0 1rem",
                  borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)", color: "#FFFFFF",
                  fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e  => (e.target.style.borderColor = "rgba(201,166,70,0.6)")}
                onBlur={e   => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button type="button" onClick={() => setShow(!show)} style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: "4px",
              }}>
                {show
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "0.75rem 1rem", borderRadius: "0.75rem",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171", fontSize: "0.85rem",
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="btn-gold-hover"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: "3rem", borderRadius: "9999px", marginTop: "0.5rem",
              background: "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
              color: "#0B0F19", fontWeight: 700, fontSize: "0.9rem",
              opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}