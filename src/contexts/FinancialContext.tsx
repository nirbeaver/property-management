import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '../types/transaction';
import { Property } from '../types/property';
import { TimeFilter, PortfolioFilter, FinancialStats, calculateFinancialStats } from '../utils/financialCalculations';
import { mockData } from '../mockData';

interface FinancialContextType {
  transactions: Transaction[];
  properties: Property[];
  timeFilter: TimeFilter;
  portfolioFilter: PortfolioFilter;
  financialStats: FinancialStats;
  setTimeFilter: (filter: TimeFilter) => void;
  setPortfolioFilter: (filter: PortfolioFilter) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockData.transactions);
  const [properties] = useState<Property[]>(mockData.properties);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('This Year');
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioFilter>('Entire Portfolio');
  const [financialStats, setFinancialStats] = useState<FinancialStats>(() => 
    calculateFinancialStats(transactions, timeFilter, portfolioFilter)
  );

  // Update financial stats whenever filters or transactions change
  useEffect(() => {
    const stats = calculateFinancialStats(transactions, timeFilter, portfolioFilter);
    setFinancialStats(stats);
  }, [transactions, timeFilter, portfolioFilter]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === transaction.id ? transaction : t)
    );
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  return (
    <FinancialContext.Provider
      value={{
        transactions,
        properties,
        timeFilter,
        portfolioFilter,
        financialStats,
        setTimeFilter,
        setPortfolioFilter,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
