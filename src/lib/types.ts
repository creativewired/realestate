export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  type: 'Villa' | 'Apartment' | 'Penthouse' | 'Townhouse' | 'Duplex' | 'Studio';
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  gallery: string[];
  status: 'available' | 'sold' | 'pending';
  featured: boolean;
  createdAt: string;
}

export interface Agent {
  name: string;
  photo: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  specialization: string;
  experience: string;
  city: string;
  instagram?: string;
  linkedin?: string;
}

export interface HomepageStat {
  label: string;
  value: string;
}

export interface AboutHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface AboutService {
  title: string;
  description: string;
}

export interface AboutCredential {
  label: string;
  value: string;
}

export interface AboutPage {
  headline: string;
  subheadline: string;
  story: string;
  highlights: AboutHighlight[];
  services: AboutService[];
  credentials: AboutCredential[];
}

export interface SiteContent {
  agent: Agent;
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    heroBackground?: string;
    aboutTitle?: string;
    aboutText?: string;
    stats: HomepageStat[];
  };
  about: AboutPage;
  seo: {
    siteName: string;
    siteDescription: string;
    keywords?: string;
  };
}