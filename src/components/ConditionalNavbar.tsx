'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Agent, SiteContent } from "@/lib/types";

export default function ConditionalNavbar({
  children,
  agent,
  content,
}: {
  children: React.ReactNode;
  agent: Agent;
  content: SiteContent;
}) {
  const pathname = usePathname();
  const isAdmin  = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar agent={agent} />}
      {children}
      {!isAdmin && <Footer agent={agent} content={content} />}
    </>
  );
}