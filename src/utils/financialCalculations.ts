import { Transaction } from '../types/transaction';

export type TimeFilter = 'This Year' | 'Last Year' | 'This Month' | 'Last Month' | 'All Time';
export type PortfolioFilter = 'Entire Portfolio' | string; // string will be property name

export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeChange: number;
  expensesChange: number;
  profitChange: number;
}

export const calculateFinancialStats = (
  transactions: Transaction[],
  timeFilter: TimeFilter,
  portfolioFilter: PortfolioFilter
): FinancialStats => {
  // Filter transactions based on time period
  const currentDate = new Date();
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    
    // Apply portfolio filter
    if (portfolioFilter !== 'Entire Portfolio' && transaction.propertyName !== portfolioFilter) {
      return false;
    }

    // Apply time filter
    switch (timeFilter) {
      case 'This Year':
        return transactionDate.getFullYear() === currentDate.getFullYear();
      case 'Last Year':
        return transactionDate.getFullYear() === currentDate.getFullYear() - 1;
      case 'This Month':
        return transactionDate.getMonth() === currentDate.getMonth() &&
               transactionDate.getFullYear() === currentDate.getFullYear();
      case 'Last Month':
        const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
        const lastMonthYear = currentDate.getMonth() === 0 ? 
          currentDate.getFullYear() - 1 : currentDate.getFullYear();
        return transactionDate.getMonth() === lastMonth &&
               transactionDate.getFullYear() === lastMonthYear;
      case 'All Time':
        return true;
      default:
        return true;
    }
  });

  // Calculate current period stats
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Calculate previous period stats for comparison
  const getPreviousPeriodTransactions = () => {
    switch (timeFilter) {
      case 'This Year':
        return transactions.filter(t => {
          const date = new Date(t.date);
          return date.getFullYear() === currentDate.getFullYear() - 1;
        });
      case 'Last Year':
        return transactions.filter(t => {
          const date = new Date(t.date);
          return date.getFullYear() === currentDate.getFullYear() - 2;
        });
      case 'This Month':
        const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
        const lastMonthYear = currentDate.getMonth() === 0 ? 
          currentDate.getFullYear() - 1 : currentDate.getFullYear();
        return transactions.filter(t => {
          const date = new Date(t.date);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });
      default:
        return [];
    }
  };

  const previousTransactions = getPreviousPeriodTransactions();
  const previousIncome = previousTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  const previousExpenses = previousTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const previousProfit = previousIncome - previousExpenses;

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    incomeChange: calculateChange(totalIncome, previousIncome),
    expensesChange: calculateChange(totalExpenses, previousExpenses),
    profitChange: calculateChange(netProfit, previousProfit)
  };
};
