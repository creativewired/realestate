import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "public", "data", "properties.json");

function read(): Record<string, unknown>[] {
  try {
    const raw = JSON.parse(readFileSync(FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function write(data: unknown) {
  writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const properties = read();
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  properties[idx] = { ...properties[idx], ...body };
  write(properties);
  return NextResponse.json(properties[idx]);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const properties = read();
  const filtered = properties.filter((p) => p.id !== id);
  write(filtered);
  return NextResponse.json({ ok: true });
}