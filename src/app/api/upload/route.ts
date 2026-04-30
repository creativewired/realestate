import { NextResponse } from "next/server";

// Images are now uploaded directly to Cloudinary from the browser.
// This route is kept as a stub.
export async function POST() {
  return NextResponse.json(
    { error: "Use direct Cloudinary upload instead" },
    { status: 400 }
  );
}