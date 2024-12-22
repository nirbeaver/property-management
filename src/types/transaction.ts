export interface Transaction {
  id: string;
  propertyId: string;
  tenantId: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  paymentType: 'RENT' | 'DEPOSIT' | 'OTHER';
  description: string;
  createdAt: string;
  updatedAt: string;
}
