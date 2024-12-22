import { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { Transaction } from '../types/transaction';

interface PropertySummary {
  id: string;
  name: string;
  income: number;
  expenses: number;
  netProfit: number;
  occupancyRate: number;
  topExpenses: {
    category: string;
    amount: number;
  }[];
  monthlyTrend: {
    month: string;
    income: number;
    expenses: number;
  }[];
}

interface UseFinancialDataResult {
  propertySummaries: PropertySummary[];
  isLoading: boolean;
  error: Error | null;
}

export const useFinancialData = (
  properties: Property[],
  transactions: Transaction[],
  timeframe: string
): UseFinancialDataResult => {
  const [propertySummaries, setPropertySummaries] = useState<PropertySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Get start date based on timeframe
      const getStartDate = () => {
        const now = new Date();
        switch (timeframe) {
          case 'month':
            return new Date(now.getFullYear(), now.getMonth(), 1);
          case 'quarter':
            return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          case 'year':
            return new Date(now.getFullYear(), 0, 1);
          default:
            return new Date(0); // Beginning of time
        }
      };

      const startDate = getStartDate();

      // Filter transactions by date
      const filteredTransactions = transactions.filter(
        (t) => new Date(t.date) >= startDate
      );

      // Calculate summaries for each property
      const summaries = properties.map((property) => {
        // Get transactions for this property
        const propertyTransactions = filteredTransactions.filter(
          (t) => t.property === property.id
        );

        // Calculate income and expenses
        const income = propertyTransactions
          .filter((t) => t.type === 'Income')
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = propertyTransactions
          .filter((t) => t.type === 'Expense')
          .reduce((sum, t) => sum + t.amount, 0);

        // Calculate top expenses by category
        const expensesByCategory = propertyTransactions
          .filter((t) => t.type === 'Expense')
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {} as Record<string, number>);

        const topExpenses = Object.entries(expensesByCategory)
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        // Calculate monthly trends
        const monthlyTrends = Array.from({ length: 12 }, (_, i) => {
          const month = new Date();
          month.setMonth(month.getMonth() - i);
          const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
          const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

          const monthTransactions = propertyTransactions.filter(
            (t) => {
              const date = new Date(t.date);
              return date >= monthStart && date <= monthEnd;
            }
          );

          const monthIncome = monthTransactions
            .filter((t) => t.type === 'Income')
            .reduce((sum, t) => sum + t.amount, 0);

          const monthExpenses = monthTransactions
            .filter((t) => t.type === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return {
            month: monthStart.toLocaleString('default', { month: 'short' }),
            income: monthIncome,
            expenses: monthExpenses,
          };
        }).reverse();

        // Calculate occupancy rate (assuming lease data would be used here)
        const occupancyRate = property.status === 'Rented' ? 100 : 0;

        return {
          id: property.id,
          name: property.name,
          income,
          expenses,
          netProfit: income - expenses,
          occupancyRate,
          topExpenses,
          monthlyTrend: monthlyTrends,
        };
      });

      setPropertySummaries(summaries);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [properties, transactions, timeframe]);

  return { propertySummaries, isLoading, error };
};
