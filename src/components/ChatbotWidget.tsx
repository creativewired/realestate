'use client';

import { useState, useRef, useEffect } from "react";
import { Agent } from "@/lib/types";

const STEPS = {
  welcome: {
    message: "Hello! I can help you find the perfect property in Dubai. Ready to get started?",
    options: [{ label: "Let's find my property →", next: "type" }],
  },
  type: {
    message: "What type of property are you looking for?",
    options: [
      { label: "Villa",       next: "area" },
      { label: "Apartment",   next: "area" },
      { label: "Penthouse",   next: "area" },
      { label: "Townhouse",   next: "area" },
      { label: "Any type",    next: "area" },
    ],
  },
  area: {
    message: "Which area in Dubai interests you?",
    options: [
      { label: "Palm Jumeirah",    next: "budget" },
      { label: "Downtown Dubai",   next: "budget" },
      { label: "Dubai Marina",     next: "budget" },
      { label: "Business Bay",     next: "budget" },
      { label: "Arabian Ranches",  next: "budget" },
      { label: "Any area",         next: "budget" },
    ],
  },
  budget: {
    message: "What is your budget range?",
    options: [
      { label: "Under 2M AED",   next: "done" },
      { label: "2M – 5M AED",    next: "done" },
      { label: "5M – 10M AED",   next: "done" },
      { label: "10M – 20M AED",  next: "done" },
      { label: "20M+ AED",       next: "done" },
    ],
  },
};

interface Message {
  from: "bot" | "user";
  text: string;
}

export default function ChatbotWidget({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<keyof typeof STEPS | "done">("welcome");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: STEPS.welcome.message },
  ]);
  const [selections, setSelections] = useState({ type: "", area: "", budget: "" });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function pick(label: string, next: string) {
    const newSelections = { ...selections };
    if (step === "type")   newSelections.type   = label;
    if (step === "area")   newSelections.area   = label;
    if (step === "budget") newSelections.budget = label;
    setSelections(newSelections);

    const msgs: Message[] = [...messages, { from: "user", text: label }];

    if (next === "done") {
      msgs.push({
        from: "bot",
        text: `Perfect! I'll connect you with ${agent.name} who can show you ${newSelections.type.toLowerCase()} options in ${newSelections.area} within ${label}. Tap below to chat now!`,
      });
      setMessages(msgs);
      setStep("done");
    } else {
      const nextStep = next as keyof typeof STEPS;
      msgs.push({ from: "bot", text: STEPS[nextStep].message });
      setMessages(msgs);
      setStep(nextStep);
    }
  }

  function reset() {
    setStep("welcome");
    setSelections({ type: "", area: "", budget: "" });
    setMessages([{ from: "bot", text: STEPS.welcome.message }]);
  }

  const waText = step === "done"
    ? `Hello ${agent.name}! I'm looking for a ${selections.type} in ${selections.area} with a budget of ${selections.budget}. I found your website and would love to know more.`
    : `Hello ${agent.name}, I found your website and I'm interested in a property.`;

  const waLink = `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(waText)}`;

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open property finder"}
        style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50,
          width: "56px", height: "56px", borderRadius: "9999px",
          background: "linear-gradient(135deg, #d4aa4a 0%, #C9A646 60%, #b8922e 100%)",
          color: "#0B0F19", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(201,166,70,0.35), 0 2px 8px rgba(0,0,0,0.4)",
          transition: "transform 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(201,166,70,0.45), 0 2px 8px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(201,166,70,0.35), 0 2px 8px rgba(0,0,0,0.4)";
        }}
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>

      {/* ── Chat window ── */}
      {open && (
        <div style={{
          position: "fixed", bottom: "5.5rem", right: "1.5rem", zIndex: 50,
          width: "340px", maxWidth: "calc(100vw - 2rem)",
          borderRadius: "1.375rem",
          border: "1px solid rgba(201,166,70,0.22)",
          background: "linear-gradient(160deg, #1e2636 0%, #151b27 60%, #12171f 100%)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 2px 0 rgba(201,166,70,0.3) inset",
          display: "flex", flexDirection: "column", overflow: "hidden",
          maxHeight: "520px",
        }}>
          {/* Gold top line */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, rgba(201,166,70,0.9), rgba(255,220,120,1), rgba(201,166,70,0.9))",
          }} />

          {/* Header */}
          <div style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "9999px",
                background: "linear-gradient(135deg, #d4aa4a, #C9A646)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0F19" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#FFFFFF", lineHeight: 1 }}>Property Finder</p>
                <p style={{ fontSize: "0.7rem", color: "#C9A646", marginTop: "2px", letterSpacing: "0.05em" }}>● Online now</p>
              </div>
            </div>
            <button onClick={reset} style={{
              fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#6B7280", padding: "4px 8px",
              borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)",
              transition: "color 0.2s",
            }}>
              Reset
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "0.625rem 0.875rem",
                  borderRadius: msg.from === "user" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                  fontSize: "0.85rem",
                  lineHeight: 1.55,
                  ...(msg.from === "user"
                    ? {
                        background: "linear-gradient(135deg, #d4aa4a, #C9A646)",
                        color: "#0B0F19",
                        fontWeight: 600,
                      }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#D1D5DB",
                      }
                  ),
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Options */}
          <div style={{ padding: "0.875rem 1.25rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {step !== "done" && step in STEPS && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {STEPS[step as keyof typeof STEPS].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => pick(opt.label, opt.next)}
                    style={{
                      padding: "0.4rem 0.875rem",
                      borderRadius: "9999px",
                      border: "1px solid rgba(201,166,70,0.35)",
                      background: "rgba(201,166,70,0.07)",
                      color: "#C9A646",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                      cursor: "pointer",
                      transition: "background 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(201,166,70,0.18)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,166,70,0.7)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(201,166,70,0.07)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,166,70,0.35)";
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {step === "done" && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  padding: "0.75rem 1.25rem", borderRadius: "9999px",
                  background: "#25D366", color: "#FFFFFF",
                  fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.03em",
                  transition: "filter 0.2s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Connect on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}