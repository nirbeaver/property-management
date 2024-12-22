export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  leaseId?: string;
  propertyId?: string;
  unitNumber?: string;
  moveInDate?: string;
  moveOutDate?: string;
  leaseType?: 'Month-to-Month' | 'One Year';
  monthlyRent?: number;
  deposit?: number;
  createdAt: string;
  updatedAt: string;
}
