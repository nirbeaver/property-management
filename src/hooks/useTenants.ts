import { useState, useEffect } from 'react';
import { Tenant } from '../types/tenant';

// Sample data
const sampleTenants: Tenant[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    status: 'Active',
    leaseId: '1',
    propertyId: '1',
    unitNumber: 'A1',
    moveInDate: '2023-01-01',
    moveOutDate: '2024-01-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 987-6543',
    status: 'Active',
    leaseId: '2',
    propertyId: '2',
    unitNumber: 'B1',
    moveInDate: '2023-06-01',
    moveOutDate: '2024-01-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@email.com',
    phone: '(555) 246-8135',
    status: 'Inactive',
    leaseId: '3',
    propertyId: '1',
    unitNumber: 'A2',
    moveInDate: '2022-01-01',
    moveOutDate: '2023-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Try to get tenants from localStorage
      const storedTenants = localStorage.getItem('tenants');
      if (storedTenants) {
        setTenants(JSON.parse(storedTenants));
      } else {
        // If no stored tenants, use sample data
        setTenants(sampleTenants);
        localStorage.setItem('tenants', JSON.stringify(sampleTenants));
      }
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, []);

  const addTenant = (newTenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const tenant: Tenant = {
        ...newTenant,
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTenants = [...tenants, tenant];
      setTenants(updatedTenants);
      localStorage.setItem('tenants', JSON.stringify(updatedTenants));
      return tenant;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    try {
      const updatedTenants = tenants.map(tenant => 
        tenant.id === id 
          ? { 
              ...tenant, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            }
          : tenant
      );
      setTenants(updatedTenants);
      localStorage.setItem('tenants', JSON.stringify(updatedTenants));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteTenant = (id: string) => {
    try {
      const updatedTenants = tenants.filter(tenant => tenant.id !== id);
      setTenants(updatedTenants);
      localStorage.setItem('tenants', JSON.stringify(updatedTenants));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { 
    tenants, 
    isLoading, 
    error, 
    addTenant,
    updateTenant,
    deleteTenant
  };
};
