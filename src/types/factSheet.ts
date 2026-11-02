import { ProjectId } from './booking';

export interface ApartmentConfiguration {
  type: '2 BHK' | '3 BHK';
  carpetAreaSqFt: string; // e.g. "1,450 - 1,850 sq.ft."
  superBuiltUpSqFt: string;
  priceRange: string; // e.g. "₹95 Lakh to ₹1.2 Crore"
  minPriceLakhs: number;
  maxPriceLakhs: number;
  balconies: number;
  bathrooms: number;
  parkingAllotment: string;
  facingOptions: string[];
}

export interface ProjectFactSheet {
  projectId: ProjectId;
  commercialName: string; // e.g. "The Grand Orchid"
  tagline: string;
  reraNumber: string; // GujRERA: PR/GJ/AHMEDABAD/...
  reraValidUntil: string;
  location: {
    address: string;
    locality: string;
    city: 'Ahmedabad';
    coordinates: {
      lat: number;
      lng: number;
    };
    nearbyLandmarks: string[];
  };
  totalLandArea: string;
  totalTowers: number;
  totalFloors: string;
  totalUnitsInProject: number;
  configurations: ApartmentConfiguration[];
  possessionDate: string; // e.g. "December 2026"
  constructionStage: string; // e.g. "Superstructure 80% complete, finishing in progress"
  keySpecifications: {
    flooring: string;
    sanitary: string;
    electrical: string;
    doorsWindows: string;
    security: string;
  };
  amenities: string[];
  pricingGuardrails: {
    minPriceOverall: string;
    maxPriceOverall: string;
    strictNoNegotiation: boolean;
    authorizedDiscountPolicy: string;
  };
  salesHeadNotes: string;
}
