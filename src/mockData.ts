import { Property } from './types/property';
import { Transaction } from './types/transaction';
import { Lease } from './types/lease';

export const mockData: {
  properties: Property[];
  transactions: Transaction[];
  leases: Lease[];
} = {
  properties: [
    {
      id: '1',
      name: 'Tiara',
      address: '4557 Camellia Ave, North Hollywood, CA 91602-1907',
      type: 'Apartment',
      status: 'Rented',
      monthlyRent: 3000,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      description: 'Modern apartment in North Hollywood',
      units: 10,
      occupiedUnits: 8,
      monthlyRevenue: 24000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'kghj',
      address: '12626 tiara st',
      type: 'House',
      status: 'Rented',
      monthlyRent: 3500,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      description: 'Beautiful house in Valley Village',
      units: 15,
      occupiedUnits: 12,
      monthlyRevenue: 42000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: '1',
      property: '1',
      type: 'Income',
      category: 'Rent',
      amount: 3000,
      date: '2024-12-19',
      description: 'Monthly rent payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      property: '1',
      type: 'Expense',
      category: 'Maintenance',
      amount: 150,
      date: '2024-12-19',
      description: 'Pool Maintenance',
      vendor: 'Pool Service Co',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      property: '1',
      type: 'Expense',
      category: 'Landscaping',
      amount: 200,
      date: '2024-12-19',
      description: 'Garden/Landscaping',
      vendor: 'Green Thumb Inc',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      property: '2',
      type: 'Income',
      category: 'Rent',
      amount: 3500,
      date: '2024-12-19',
      description: 'Monthly rent payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  leases: [
    {
      id: '1',
      propertyName: 'Tiara',
      unit: 'A1',
      tenantName: 'John Doe',
      startDate: '2023-01-01',
      endDate: '2024-01-15',
      expiryDate: '2024-01-15',
      rentAmount: 3000,
      securityDeposit: 3000,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      propertyName: 'kghj',
      unit: 'B1',
      tenantName: 'Jane Smith',
      startDate: '2023-06-01',
      endDate: '2024-01-10',
      expiryDate: '2024-01-10',
      rentAmount: 3500,
      securityDeposit: 3500,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};
