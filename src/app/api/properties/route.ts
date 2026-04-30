import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "public", "data", "properties.json");

function read(): unknown[] {
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

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const properties = read();
  const newProp = {
    ...body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  properties.push(newProp);
  write(properties);
  return NextResponse.json(newProp, { status: 201 });
}