export interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  status: 'Vacant' | 'Rented' | 'Maintenance';
  monthlyRent?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  description?: string;
  images?: string[];
  amenities?: string[];
  units: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  createdAt: string;
  updatedAt: string;
}
