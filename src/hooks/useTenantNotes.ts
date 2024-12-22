import { useState, useEffect } from 'react';

export interface TenantNote {
  id: string;
  tenantId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Sample data
const sampleNotes: TenantNote[] = [
  {
    id: '1',
    tenantId: '1',
    content: 'Tenant requested maintenance for the kitchen sink.',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    tenantId: '1',
    content: 'Rent payment consistently on time for the past 6 months.',
    createdAt: '2024-01-02T14:30:00Z',
    updatedAt: '2024-01-02T14:30:00Z',
  },
];

export const useTenantNotes = () => {
  const [notes, setNotes] = useState<TenantNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Try to get notes from localStorage
      const storedNotes = localStorage.getItem('tenantNotes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        // If no stored notes, use sample data
        setNotes(sampleNotes);
        localStorage.setItem('tenantNotes', JSON.stringify(sampleNotes));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNote = async (tenantId: string, content: string): Promise<TenantNote> => {
    try {
      const now = new Date().toISOString();
      const newNote: TenantNote = {
        id: Math.random().toString(36).substr(2, 9),
        tenantId,
        content,
        createdAt: now,
        updatedAt: now,
      };

      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem('tenantNotes', JSON.stringify(updatedNotes));
      return newNote;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateNote = async (id: string, content: string): Promise<TenantNote> => {
    try {
      const updatedNotes = notes.map(note => {
        if (note.id === id) {
          return {
            ...note,
            content,
            updatedAt: new Date().toISOString(),
          };
        }
        return note;
      });

      setNotes(updatedNotes);
      localStorage.setItem('tenantNotes', JSON.stringify(updatedNotes));
      return updatedNotes.find(note => note.id === id)!;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem('tenantNotes', JSON.stringify(updatedNotes));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getNotesForTenant = (tenantId: string) => {
    return notes
      .filter(note => note.tenantId === tenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return {
    notes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    getNotesForTenant,
  };
};
