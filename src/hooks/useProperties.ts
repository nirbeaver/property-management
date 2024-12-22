import { useState, useEffect } from 'react';
import { Property } from '../types/property';

// Sample data
const sampleProperties: Property[] = [
  {
    id: '1',
    name: 'Tiara',
    address: '123 Main St',
    type: 'Apartment',
    status: 'Rented',
    monthlyRent: 2500,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: 'Modern apartment in downtown',
    units: 10,
    occupiedUnits: 8,
    monthlyRevenue: 25000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ocean View',
    address: '456 Beach Rd',
    type: 'House',
    status: 'Rented',
    monthlyRent: 3500,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    description: 'Beautiful beach house',
    units: 15,
    occupiedUnits: 12,
    monthlyRevenue: 42000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Try to get properties from localStorage
      const storedProperties = localStorage.getItem('properties');
      if (storedProperties) {
        setProperties(JSON.parse(storedProperties));
      } else {
        // If no stored properties, use sample data
        setProperties(sampleProperties);
        localStorage.setItem('properties', JSON.stringify(sampleProperties));
      }
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, []);

  const addProperty = (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProperty = {
        ...property,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedProperties = [...properties, newProperty];
      setProperties(updatedProperties);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      return newProperty;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    try {
      const updatedProperties = properties.map(property =>
        property.id === id
          ? { ...property, ...updates, updatedAt: new Date().toISOString() }
          : property
      );
      setProperties(updatedProperties);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteProperty = (id: string) => {
    try {
      const updatedProperties = properties.filter(property => property.id !== id);
      setProperties(updatedProperties);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { 
    properties, 
    isLoading, 
    error, 
    addProperty, 
    updateProperty, 
    deleteProperty 
  };
};
