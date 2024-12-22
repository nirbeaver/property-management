import { useState, useEffect } from 'react';
import { Transaction } from '../types/transaction';

// Sample data
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    property: '1', // Tiara
    type: 'Income',
    category: 'Rent',
    amount: 2500,
    date: '2024-12-01',
    description: 'Monthly rent payment',
    tenantId: '1', // John Doe
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    property: '1', // Tiara
    type: 'Expense',
    category: 'Maintenance',
    amount: 500,
    date: '2024-12-05',
    description: 'Plumbing repair',
    vendor: 'ABC Plumbing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    property: '2', // Ocean View
    type: 'Income',
    category: 'Rent',
    amount: 3500,
    date: '2024-12-01',
    description: 'Monthly rent payment',
    tenantId: '2', // Jane Smith
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    property: '2', // Ocean View
    type: 'Expense',
    category: 'Utilities',
    amount: 300,
    date: '2024-12-10',
    description: 'Water and electricity',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add more sample transactions for previous months
  {
    id: '5',
    property: '1',
    type: 'Income',
    category: 'Rent',
    amount: 2500,
    date: '2024-11-01',
    description: 'Monthly rent payment',
    tenantId: '1', // John Doe
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    property: '2',
    type: 'Income',
    category: 'Rent',
    amount: 3500,
    date: '2024-11-01',
    description: 'Monthly rent payment',
    tenantId: '2', // Jane Smith
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTransactions = () => {
    try {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        setTransactions(sampleTransactions);
        localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTransactions();

    // Listen for transaction updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'transactions') {
        loadTransactions();
      }
    };

    // Listen for custom event for same-window updates
    const handleTransactionUpdate = () => {
      loadTransactions();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('transactionUpdate', handleTransactionUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('transactionUpdate', handleTransactionUpdate);
    };
  }, []);

  return { transactions, isLoading, error, reloadTransactions: loadTransactions };
};
