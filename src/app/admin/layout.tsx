import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Luxury RE" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100dvh", background: "#080C14", color: "#FFFFFF" }}>
      {children}
    </div>
  );
}