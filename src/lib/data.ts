import fs from 'fs';
import path from 'path';
import { Property, SiteContent } from './types';

const PROPS_FILE    = path.join(process.cwd(), 'public', 'data', 'properties.json');
const CONTENT_FILE  = path.join(process.cwd(), 'public', 'data', 'content.json');

function readProperties(): Property[] {
  try {
    const raw = JSON.parse(fs.readFileSync(PROPS_FILE, 'utf-8'));
    if (Array.isArray(raw))             return raw as Property[];
    if (Array.isArray(raw?.properties)) return raw.properties as Property[];
    return [];
  } catch {
    return [];
  }
}

// ── Properties ───────────────────────────────────────────────

export function getAllProperties(): Property[] {
  return readProperties();
}

export function getPropertyById(id: string): Property | undefined {
  const list = readProperties();
  return list.find((p) => p.id === id);
}

export function saveAllProperties(properties: Property[]): void {
  // always write plain array — never the { properties: [] } wrapper
  fs.writeFileSync(PROPS_FILE, JSON.stringify(properties, null, 2), 'utf-8');
}

// ── Site Content ─────────────────────────────────────────────

const FALLBACK_CONTENT: SiteContent = {
  agent: {
    name: 'Agent Name',
    photo: '',
    bio: 'Luxury real estate specialist in Dubai.',
    phone: '+971500000000',
    whatsapp: '+971500000000',
    email: 'agent@example.com',
    specialization: 'Luxury Real Estate',
    experience: '10',
    city: 'Dubai',
  },
  homepage: {
    heroTitle: 'Premium Properties. Direct Access.',
    heroSubtitle: "Exclusive luxury real estate across Dubai's finest locations.",
    stats: [
      { value: '10+',     label: 'Years Experience' },
      { value: '200+',    label: 'Properties Sold'  },
      { value: 'AED 2B+', label: 'In Sales'         },
      { value: 'Dubai',   label: 'Based In'         },
    ],
  },
  seo: {
    siteName: 'Luxury RE',
    siteDescription: 'Exclusive luxury real estate in Dubai.',
  },
} as SiteContent;

export function getSiteContent(): SiteContent {
  try {
    return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8')) as SiteContent;
  } catch {
    return FALLBACK_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
}