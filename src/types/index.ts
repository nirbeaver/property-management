export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'tenant';
}

export interface Property {
  id: string;
  name: string;
  address: string;
  units: Unit[];
  images: string[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Unit {
  id: string;
  propertyId: string;
  number: string;
  type: string;
  size: number;
  rent: number;
  status: 'vacant' | 'occupied' | 'maintenance';
  currentLeaseId?: string;
}

export interface Lease {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  rent: number;
  deposit: number;
  documents: Document[];
  status: 'active' | 'expired' | 'terminated';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  size: number;
}

export interface Transaction {
  id: string;
  propertyId: string;
  unitId?: string;
  leaseId?: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date;
  description: string;
  attachments: Document[];
}
