import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  id: string;
  property: string;
  type: 'Expense' | 'Income';
  category: string;
  amount: number;
  date: string;
  description: string;
  vendor?: string;
  isRecurring?: string;
  recurringEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timeframe, setTimeframe] = useState('month');
  const [selectedProperty, setSelectedProperty] = useState('all');

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Calculate key metrics
  const calculateMetrics = () => {
    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalIncome - totalExpenses;

    const expensesByCategory = transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);

    return {
      totalExpenses,
      totalIncome,
      netIncome,
      expensesByCategory,
    };
  };

  // Filter transactions based on timeframe
  const filterTransactionsByTimeframe = (transactions: Transaction[]) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactions.filter(t => new Date(t.date) >= startDate && new Date(t.date) <= now);
  };

  const filteredTransactions = filterTransactionsByTimeframe(transactions);
  const metrics = calculateMetrics();

  // Prepare data for charts
  const categoryData = Object.entries(metrics.expensesByCategory)
    .map(([name, value]) => ({
      name,
      value: Math.abs(value), // Ensure positive values for the pie chart
    }))
    .sort((a, b) => b.value - a.value); // Sort by value descending

  const monthlyData = filteredTransactions
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, expenses: 0, income: 0 };
      }
      if (t.type === 'Expense') {
        acc[month].expenses += Math.abs(t.amount);
      } else {
        acc[month].income += t.amount;
      }
      return acc;
    }, {} as Record<string, { month: string; expenses: number; income: number }>);

  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Reports & Analytics</Text>
        <Flex gap={4}>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            w="200px"
            bg="white"
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </Select>
          <Button colorScheme="blue" leftIcon={<ArrowDownRight />}>
            Export Reports
          </Button>
        </Flex>
      </Flex>

      {/* Key Metrics */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat>
            <StatLabel>Total Expenses</StatLabel>
            <StatNumber color="red.500">${metrics.totalExpenses.toFixed(2)}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>
        </Box>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat>
            <StatLabel>Total Income</StatLabel>
            <StatNumber color="green.500">${metrics.totalIncome.toFixed(2)}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              12.45%
            </StatHelpText>
          </Stat>
        </Box>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat>
            <StatLabel>Net Income</StatLabel>
            <StatNumber color={metrics.netIncome >= 0 ? "green.500" : "red.500"}>
              ${metrics.netIncome.toFixed(2)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              8.15%
            </StatHelpText>
          </Stat>
        </Box>
      </Grid>

      {/* Charts */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={8}>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Text fontSize="lg" fontWeight="medium" mb={4}>Monthly Income vs Expenses</Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#48BB78" name="Income" />
                <Bar dataKey="expenses" fill="#F56565" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Text fontSize="lg" fontWeight="medium" mb={4}>Expenses by Category</Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Grid>

      {/* Expense Breakdown Table */}
      <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
        <Text fontSize="lg" fontWeight="medium" mb={4}>Expense Breakdown</Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Category</Th>
              <Th isNumeric>Total Amount</Th>
              <Th isNumeric>% of Total Expenses</Th>
              <Th>Trend</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categoryData.map(({ name, value }) => (
              <Tr key={name}>
                <Td>{name}</Td>
                <Td isNumeric>${value.toFixed(2)}</Td>
                <Td isNumeric>
                  {((value / metrics.totalExpenses) * 100).toFixed(1)}%
                </Td>
                <Td>
                  <StatArrow type="increase" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default ReportsPage;
