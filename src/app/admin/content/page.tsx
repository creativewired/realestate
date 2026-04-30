'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary";


const FIELD = {
  width: "100%", height: "2.75rem", padding: "0 1rem",
  borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)", color: "#FFFFFF",
  fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s",
};
const LABEL = {
  fontSize: "0.68rem", fontWeight: 700 as const,
  textTransform: "uppercase" as const, letterSpacing: "0.15em",
  color: "#C9A646", marginBottom: "0.5rem", display: "block" as const,
};
const CARD = {
  borderRadius: "1.25rem",
  border: "1px solid rgba(255,255,255,0.07)",
  background: "linear-gradient(160deg,#1e2636 0%,#151b27 100%)",
  padding: "1.75rem",
};


export default function ContentEditorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [uploading, setUploading] = useState(false);

  // Agent fields
  const [name,           setName]           = useState("");
  const [photo,          setPhoto]          = useState("");
  const [bio,            setBio]            = useState("");
  const [phone,          setPhone]          = useState("");
  const [whatsapp,       setWhatsapp]       = useState("");
  const [email,          setEmail]          = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience,     setExperience]     = useState("");
  const [city,           setCity]           = useState("");

  // Homepage fields
  const [heroTitle,    setHeroTitle]    = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [stats, setStats] = useState([
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ]);
  const [aboutHeadline,    setAboutHeadline]    = useState("");
  const [aboutSubheadline, setAboutSubheadline] = useState("");
  const [aboutStory,       setAboutStory]       = useState("");
  const [aboutHighlights,  setAboutHighlights]  = useState([
    { icon: "🏆", title: "", description: "" },
    { icon: "🤝", title: "", description: "" },
    { icon: "📍", title: "", description: "" },
    { icon: "💼", title: "", description: "" },
  ]);
  const [aboutServices, setAboutServices] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);
  const [aboutCredentials, setAboutCredentials] = useState([
    { label: "", value: "" }, { label: "", value: "" },
    { label: "", value: "" }, { label: "", value: "" },
    { label: "", value: "" }, { label: "", value: "" },
  ]);

  // SEO
  const [siteName,        setSiteName]        = useState("");
  const [siteDescription, setSiteDescription] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then(r => r.json())
      .then(data => {
        const a = data.agent     ?? {};
        const h = data.homepage  ?? {};
        const s = data.seo       ?? {};
        const ab = data.about ?? {};
setAboutHeadline(ab.headline       ?? "");
setAboutSubheadline(ab.subheadline ?? "");
setAboutStory(ab.story             ?? "");
setAboutHighlights(ab.highlights   ?? aboutHighlights);
setAboutServices(ab.services       ?? aboutServices);
setAboutCredentials(ab.credentials ?? aboutCredentials);
        setName(a.name           ?? "");
        setPhoto(a.photo         ?? "");
        setBio(a.bio             ?? "");
        setPhone(a.phone         ?? "");
        setWhatsapp(a.whatsapp   ?? "");
        setEmail(a.email         ?? "");
        setSpecialization(a.specialization ?? "");
        setExperience(a.experience         ?? "");
        setCity(a.city           ?? "");
        setHeroTitle(h.heroTitle    ?? "");
        setHeroSubtitle(h.heroSubtitle ?? "");
        setStats(h.stats ?? [{ value:"",label:"" },{ value:"",label:"" },{ value:"",label:"" },{ value:"",label:"" }]);
        setSiteName(s.siteName          ?? "");
        setSiteDescription(s.siteDescription ?? "");
      });
  }, []);

 async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);
  try {
    const url = await uploadToCloudinary(file);
    setPhoto(url);
  } catch {
    alert("Photo upload failed. Check Cloudinary settings.");
  } finally {
    setUploading(false);
  }
}

  function updateStat(i: number, key: "value" | "label", val: string) {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  }
  function updateHighlight(i: number, key: keyof typeof aboutHighlights[0], val: string) {
  setAboutHighlights(prev => prev.map((h, idx) => idx === i ? { ...h, [key]: val } : h));
}
function updateService(i: number, key: keyof typeof aboutServices[0], val: string) {
  setAboutServices(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
}
function updateCredential(i: number, key: keyof typeof aboutCredentials[0], val: string) {
  setAboutCredentials(prev => prev.map((c, idx) => idx === i ? { ...c, [key]: val } : c));
}

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent: { name, photo, bio, phone, whatsapp, email, specialization, experience, city },
        homepage: { heroTitle, heroSubtitle, stats },
        about: {
    headline:    aboutHeadline,
    subheadline: aboutSubheadline,
    story:       aboutStory,
    highlights:  aboutHighlights,
    services:    aboutServices,
    credentials: aboutCredentials,
  },
        seo: { siteName, siteDescription },
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
  }

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(201,166,70,0.6)");
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  return (
    <div style={{ minHeight: "100dvh" }}>

      {/* Top bar */}
      <header style={{
        height: "64px", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(11,15,25,0.95)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <Link href="/admin/dashboard" style={{
          display: "flex", alignItems: "center", gap: "8px",
          color: "#6B7280", fontSize: "0.85rem",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Dashboard
        </Link>
        <span style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1rem", color: "#FFFFFF" }}>
          Edit Site Content
        </span>
        <div style={{ width: "80px" }} />
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* ── Agent Profile ── */}
          <div style={CARD}>
            <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", color: "#FFFFFF", paddingBottom: "0.875rem", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.25rem" }}>
              Agent Profile
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>

              {/* Name + City */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={LABEL}>Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah Al Mansoori" style={FIELD} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={LABEL}>City</label>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Dubai" style={FIELD} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              {/* Specialization + Experience */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={LABEL}>Specialization</label>
                  <input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="e.g. Luxury Real Estate" style={FIELD} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={LABEL}>Years of Experience</label>
                  <input value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 10" style={FIELD} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              {/* Phone + WhatsApp */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={LABEL}>Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971500000000" style={FIELD} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={LABEL}>WhatsApp Number</label>
                  <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+971500000000" style={FIELD} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={LABEL}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="agent@example.com" style={FIELD} onFocus={focus} onBlur={blur} />
              </div>

              {/* Bio */}
              <div>
                <label style={LABEL}>Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Agent bio shown on website…"
                  style={{ ...FIELD, height: "auto", padding: "0.875rem 1rem", resize: "vertical" }}
                  onFocus={focus} onBlur={blur} />
              </div>

              {/* Photo */}
              <div>
                <label style={LABEL}>Agent Photo</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <label style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: "2.75rem", borderRadius: "0.75rem",
                    border: "1px dashed rgba(201,166,70,0.4)",
                    background: "rgba(201,166,70,0.05)", cursor: "pointer",
                    fontSize: "0.85rem", color: "#C9A646", fontWeight: 600,
                  }}>
                    {uploading ? "Uploading…" : "📷 Upload Photo"}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                  </label>
                  <input value={photo} onChange={e => setPhoto(e.target.value)} placeholder="Or paste photo URL" style={FIELD} onFocus={focus} onBlur={blur} />
                  {photo && (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="Agent" style={{ width: "64px", height: "64px", borderRadius: "9999px", objectFit: "cover", border: "2px solid rgba(201,166,70,0.4)" }} />
                      <button type="button" onClick={() => setPhoto("")} style={{ color: "#f87171", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}>
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Homepage Content ── */}
          <div style={CARD}>
            <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", color: "#FFFFFF", paddingBottom: "0.875rem", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.25rem" }}>
              Homepage Content
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>

              <div>
                <label style={LABEL}>Hero Title</label>
                <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="e.g. Premium Properties. Direct Access." style={FIELD} onFocus={focus} onBlur={blur} />
              </div>

              <div>
                <label style={LABEL}>Hero Subtitle</label>
                <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} rows={2} placeholder="Short tagline under the hero title…"
                  style={{ ...FIELD, height: "auto", padding: "0.875rem 1rem", resize: "vertical" }}
                  onFocus={focus} onBlur={blur} />
              </div>

              {/* Stats */}
              <div>
                <label style={LABEL}>Stats (4 items)</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {stats.map((stat, i) => (
                    <div key={i} style={{
                      borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.03)", padding: "0.875rem",
                      display: "flex", flexDirection: "column", gap: "0.5rem",
                    }}>
                      <input
                        value={stat.value} onChange={e => updateStat(i, "value", e.target.value)}
                        placeholder={`Value (e.g. ${["10+","200+","AED 2B+","Dubai"][i]})`}
                        style={{ ...FIELD, fontSize: "0.8rem" }} onFocus={focus} onBlur={blur}
                      />
                      <input
                        value={stat.label} onChange={e => updateStat(i, "label", e.target.value)}
                        placeholder={`Label (e.g. ${["Years Experience","Properties Sold","In Sales","Based In"][i]})`}
                        style={{ ...FIELD, fontSize: "0.8rem" }} onFocus={focus} onBlur={blur}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* ── About Page ── */}
<div style={CARD}>
  <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", color: "#FFFFFF", paddingBottom: "0.875rem", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.25rem" }}>
    About Page
  </h3>
  <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>

    <div>
      <label style={LABEL}>Headline</label>
      <input value={aboutHeadline} onChange={e => setAboutHeadline(e.target.value)}
        placeholder="e.g. A Trusted Name in Dubai Luxury Real Estate"
        style={FIELD} onFocus={focus} onBlur={blur} />
    </div>

    <div>
      <label style={LABEL}>Subheadline</label>
      <input value={aboutSubheadline} onChange={e => setAboutSubheadline(e.target.value)}
        placeholder="Short tagline under the headline"
        style={FIELD} onFocus={focus} onBlur={blur} />
    </div>

    <div>
      <label style={LABEL}>Story (separate paragraphs with a blank line)</label>
      <textarea value={aboutStory} onChange={e => setAboutStory(e.target.value)}
        rows={8} placeholder="Your story here…"
        style={{ ...FIELD, height: "auto", padding: "0.875rem 1rem", resize: "vertical" }}
        onFocus={focus} onBlur={blur} />
    </div>

    {/* Highlights */}
    <div>
      <label style={LABEL}>Highlights (4 items)</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {aboutHighlights.map((h, i) => (
          <div key={i} style={{
            borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.03)", padding: "0.875rem",
            display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: "0.5rem",
          }}>
            <input value={h.icon} onChange={e => updateHighlight(i, "icon", e.target.value)}
              placeholder="🏆" style={{ ...FIELD, fontSize: "1.1rem", textAlign: "center" }} onFocus={focus} onBlur={blur} />
            <input value={h.title} onChange={e => updateHighlight(i, "title", e.target.value)}
              placeholder="Title" style={{ ...FIELD, fontSize: "0.8rem" }} onFocus={focus} onBlur={blur} />
            <input value={h.description} onChange={e => updateHighlight(i, "description", e.target.value)}
              placeholder="Description" style={{ ...FIELD, fontSize: "0.8rem" }} onFocus={focus} onBlur={blur} />
          </div>
        ))}
      </div>
    </div>

    {/* Services */}
    <div>
      <label style={LABEL}>Services (4 items)</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {aboutServices.map((s, i) => (
          <div key={i} style={{
            borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.03)", padding: "0.875rem",
            display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem",
          }}>
            <input value={s.title} onChange={e => updateService(i, "title", e.target.value)}
              placeholder="Service name" style={{ ...FIELD, fontSize: "0.8rem" }} onFocus={focus} onBlur={blur} />
            <input value={s.description} onChange={e => updateService(i, "description", e.target.value)}
              placeholder="Short description" style={{ ...FIELD, fontSize: "0.8rem" }} onFocus={focus} onBlur={blur} />
          </div>
        ))}
      </div>
    </div>

    {/* Credentials */}
    <div>
      <label style={LABEL}>Credentials (6 items)</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
        {aboutCredentials.map((c, i) => (
          <div key={i} style={{
            borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.03)", padding: "0.875rem",
            display: "flex", flexDirection: "column", gap: "0.5rem",
          }}>
            <input value={c.label} onChange={e => updateCredential(i, "label", e.target.value)}
              placeholder="Label (e.g. Experience)" style={{ ...FIELD, fontSize: "0.8rem" }} onFocus={focus} onBlur={blur} />
            <input value={c.value} onChange={e => updateCredential(i, "value", e.target.value)}
              placeholder="Value (e.g. 10+ Years)" style={{ ...FIELD, fontSize: "0.8rem" }} onFocus={focus} onBlur={blur} />
          </div>
        ))}
      </div>
    </div>

  </div>
</div>

          {/* ── SEO ── */}
          <div style={CARD}>
            <h3 style={{ fontFamily: "Zodiak,Georgia,serif", fontSize: "1.1rem", color: "#FFFFFF", paddingBottom: "0.875rem", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "1.25rem" }}>
              SEO & Site Info
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
              <div>
                <label style={LABEL}>Site Name</label>
                <input value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="e.g. Swaraj N S" style={FIELD} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={LABEL}>Site Description (SEO)</label>
                <textarea value={siteDescription} onChange={e => setSiteDescription(e.target.value)} rows={2} placeholder="Short description for search engines…"
                  style={{ ...FIELD, height: "auto", padding: "0.875rem 1rem", resize: "vertical" }}
                  onFocus={focus} onBlur={blur} />
              </div>
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: "flex", gap: "0.875rem" }}>
            <button
              type="submit" disabled={saving}
              className="btn-gold-hover"
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "3rem", borderRadius: "9999px",
                background: saved
                  ? "linear-gradient(135deg,#4ade80,#22c55e)"
                  : "linear-gradient(135deg,#d4aa4a,#C9A646,#b8922e)",
                color: "#0B0F19", fontWeight: 700, fontSize: "0.9rem",
                opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer",
                transition: "background 0.4s",
              }}
            >
              {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
            </button>
            <Link href="/admin/dashboard" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minHeight: "3rem", borderRadius: "9999px", padding: "0 1.75rem",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#FFFFFF", fontWeight: 600, fontSize: "0.875rem",
            }}>
              Cancel
            </Link>
          </div>

        </form>
      </main>
    </div>
  );
}