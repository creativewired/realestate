import { getAllProperties, getSiteContent } from "@/lib/data";
import PropertiesClient from "./PropertiesClient";

export default function PropertiesPage() {
  const properties = getAllProperties();
  const content = getSiteContent();
  return <PropertiesClient properties={properties} agent={content.agent} />;
}