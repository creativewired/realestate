import { NextRequest, NextResponse } from "next/server";
import { getSiteContent } from "@/lib/data";
import { writeFileToGitHub } from "@/lib/github";

export async function GET() {
  return NextResponse.json(getSiteContent());
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await writeFileToGitHub(
      "public/data/content.json",
      JSON.stringify(body, null, 2),
      "Update site content"
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}