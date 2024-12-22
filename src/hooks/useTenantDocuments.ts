import { useState, useEffect } from 'react';

export interface TenantDocument {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  size?: number;
}

// Sample data
const sampleDocuments: TenantDocument[] = [
  {
    id: '1',
    tenantId: '1',
    name: 'Lease Agreement.pdf',
    type: 'application/pdf',
    url: '#',
    uploadDate: '2024-01-01',
    size: 1024 * 1024, // 1MB
  },
  {
    id: '2',
    tenantId: '1',
    name: 'ID Document.jpg',
    type: 'image/jpeg',
    url: '#',
    uploadDate: '2024-01-01',
    size: 500 * 1024, // 500KB
  },
];

export const useTenantDocuments = () => {
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Try to get documents from localStorage
      const storedDocs = localStorage.getItem('tenantDocuments');
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      } else {
        // If no stored documents, use sample data
        setDocuments(sampleDocuments);
        localStorage.setItem('tenantDocuments', JSON.stringify(sampleDocuments));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addDocument = async (tenantId: string, file: File): Promise<TenantDocument> => {
    try {
      // In a real app, you would upload the file to a server here
      // For now, we'll just create a document object
      const newDoc: TenantDocument = {
        id: Math.random().toString(36).substr(2, 9),
        tenantId,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file), // Create a temporary URL
        uploadDate: new Date().toISOString(),
        size: file.size,
      };

      const updatedDocs = [...documents, newDoc];
      setDocuments(updatedDocs);
      localStorage.setItem('tenantDocuments', JSON.stringify(updatedDocs));
      return newDoc;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const updatedDocs = documents.filter(doc => doc.id !== id);
      setDocuments(updatedDocs);
      localStorage.setItem('tenantDocuments', JSON.stringify(updatedDocs));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getDocumentsForTenant = (tenantId: string) => {
    return documents.filter(doc => doc.tenantId === tenantId);
  };

  return {
    documents,
    isLoading,
    error,
    addDocument,
    deleteDocument,
    getDocumentsForTenant,
  };
};
