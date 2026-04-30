export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);
  fd.append("folder", "luxury-re/properties");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: fd }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cloudinary upload failed: ${err}`);
  }

  const data = await res.json();
  // Use the optimized auto-format URL
  return data.secure_url as string;
}