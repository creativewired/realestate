import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getSiteContent());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  saveSiteContent(body);
  return NextResponse.json({ ok: true });
}