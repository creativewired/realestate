import { getPropertyById } from "@/lib/data";
import { notFound } from "next/navigation";
import PropertyForm from "../../PropertyForm";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();
  return <PropertyForm mode="edit" property={property} />;
}