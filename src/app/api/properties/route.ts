import { NextRequest, NextResponse } from "next/server";
import { getAllProperties } from "@/lib/data";
import { writeFileToGitHub } from "@/lib/github";

export async function GET() {
  return NextResponse.json(getAllProperties());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const properties = getAllProperties();
    const newProp = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    properties.push(newProp);
    await writeFileToGitHub(
      "public/data/properties.json",
      JSON.stringify(properties, null, 2),
      `Add property: ${newProp.title}`
    );
    return NextResponse.json(newProp, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}