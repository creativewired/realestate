import { NextRequest, NextResponse } from "next/server";
import { getAllProperties } from "@/lib/data";
import { writeFileToGitHub } from "@/lib/github";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const properties = getAllProperties();
    const idx = properties.findIndex((p) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    properties[idx] = { ...properties[idx], ...body };
    await writeFileToGitHub(
      "public/data/properties.json",
      JSON.stringify(properties, null, 2),
      `Update property: ${properties[idx].title}`
    );
    return NextResponse.json(properties[idx]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const properties = getAllProperties();
    const filtered = properties.filter((p) => p.id !== id);
    await writeFileToGitHub(
      "public/data/properties.json",
      JSON.stringify(filtered, null, 2),
      `Delete property: ${id}`
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}