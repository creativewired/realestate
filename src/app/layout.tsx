import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ChatbotWidget from "@/components/ChatbotWidget";
import { getSiteContent } from "@/lib/data";

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const content = getSiteContent();
  return {
    title: content.seo.siteName,
    description: content.seo.siteDescription,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = getSiteContent();
  const { agent } = content;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=zodiak@400,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ConditionalNavbar agent={agent} content={content}>
          <main>{children}</main>
        </ConditionalNavbar>
        <ChatbotWidget agent={agent} />
      </body>
    </html>
  );
}