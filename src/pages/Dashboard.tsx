import React, { useMemo, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Flex,
  Select,
} from '@chakra-ui/react';
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useTransactions } from '../hooks/useTransactions';
import { useProperties } from '../hooks/useProperties';
import { useFinancialData } from '../hooks/useFinancialData';
import { CustomerSupport } from '../components/CustomerSupport';

const Dashboard = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { transactions } = useTransactions();
  const { properties } = useProperties();
  const [timeframe, setTimeframe] = useState<string>('year');
  const { propertySummaries, isLoading } = useFinancialData(properties, transactions, timeframe);

  const financialData = useMemo(() => {
    if (!propertySummaries.length) return [];

    // Combine monthly trends from all properties
    const combinedTrends = propertySummaries.reduce((acc, property) => {
      property.monthlyTrend.forEach((trend, index) => {
        if (!acc[index]) {
          acc[index] = {
            month: trend.month,
            income: 0,
            expenses: 0,
          };
        }
        acc[index].income += trend.income;
        acc[index].expenses += trend.expenses;
      });
      return acc;
    }, [] as Array<{ month: string; income: number; expenses: number; }>);

    // Calculate profit for each month
    return combinedTrends.map(data => ({
      ...data,
      profit: data.income - data.expenses,
    }));
  }, [propertySummaries]);

  const totalStats = useMemo(() => {
    if (!propertySummaries.length) return {
      totalIncome: 0,
      totalExpenses: 0,
      totalProfit: 0,
      profitMargin: 0,
    };

    const totalIncome = propertySummaries.reduce((sum, prop) => sum + prop.income, 0);
    const totalExpenses = propertySummaries.reduce((sum, prop) => sum + prop.expenses, 0);
    const totalProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome ? (totalProfit / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      totalProfit,
      profitMargin,
    };
  }, [propertySummaries]);

  const stats = useMemo(() => {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    
    // Calculate property changes
    const lastMonthProperties = properties.filter(p => 
      new Date(p.createdAt) <= lastMonth
    ).length;
    const propertyChange = lastMonthProperties ? 
      ((properties.length - lastMonthProperties) / lastMonthProperties) * 100 : 0;

    return [
      {
        label: 'Total Properties',
        value: properties.length.toString(),
        icon: Building2,
        change: propertyChange,
        changeType: propertyChange >= 0 ? 'increase' : 'decrease' as const,
        color: 'blue',
      },
      {
        label: 'Total Income',
        value: `$${totalStats.totalIncome.toLocaleString()}`,
        icon: TrendingUp,
        change: totalStats.profitMargin,
        changeType: totalStats.profitMargin >= 0 ? 'increase' : 'decrease' as const,
        color: 'green',
      },
      {
        label: 'Total Expenses',
        value: `$${totalStats.totalExpenses.toLocaleString()}`,
        icon: TrendingDown,
        change: totalStats.profitMargin,
        changeType: totalStats.profitMargin >= 0 ? 'decrease' : 'increase' as const,
        color: 'red',
      },
      {
        label: 'Net Profit',
        value: `$${totalStats.totalProfit.toLocaleString()}`,
        icon: DollarSign,
        change: totalStats.profitMargin,
        changeType: totalStats.profitMargin >= 0 ? 'increase' : 'decrease' as const,
        color: 'purple',
      },
    ];
  }, [properties, totalStats]);

  if (isLoading) {
    return <Box p={4}>Loading...</Box>;
  }

  return (
    <Box>
      <Box mb={6}>
        <Heading size="lg">Dashboard</Heading>
        <Text color="gray.600" mt={1}>
          Welcome back! Here's what's happening with your properties
        </Text>
      </Box>

      {/* Financial Overview */}
      <Card mb={6}>
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="md">Financial Overview</Heading>
            <Select
              width="200px"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </Select>
          </HStack>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Revenue vs Expenses Chart */}
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => ['$' + value.toLocaleString(), '']}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#48BB78" />
                  <Bar dataKey="expenses" name="Expenses" fill="#F56565" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Profit Trend Chart */}
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => ['$' + value.toLocaleString(), '']}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Net Profit"
                    stroke="#805AD5"
                    fill="#805AD5"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardBody>
              <HStack spacing={4}>
                <Box
                  p={2}
                  bg={`${stat.color}.50`}
                  borderRadius="lg"
                  color={`${stat.color}.500`}
                >
                  <Icon as={stat.icon} boxSize={6} />
                </Box>
                <Stat>
                  <StatLabel color="gray.500">{stat.label}</StatLabel>
                  <StatNumber>{stat.value}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={stat.changeType} />
                    {stat.change.toFixed(1)}% from last month
                  </StatHelpText>
                </Stat>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mt={6}>
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {transactions
                ?.sort((a, b) => {
                  // First compare by date
                  const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
                  if (dateCompare !== 0) return dateCompare;
                  // If same date, compare by creation time
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .slice(0, 5)
                .map((transaction) => {
                  const property = properties?.find(p => p.id === transaction.propertyId);
                  const isIncome = transaction.type.toUpperCase() === 'INCOME' || transaction.type === 'Income';
                  
                  return (
                    <HStack key={transaction.id} justify="space-between" p={2} borderWidth="1px" borderRadius="md">
                      <Box p={2} bg="gray.100" borderRadius="full">
                        <Icon
                          as={isIncome ? TrendingUp : TrendingDown}
                          boxSize={4}
                          color={isIncome ? 'green.500' : 'red.500'}
                        />
                      </Box>
                      <VStack flex={1} align="start" spacing={0}>
                        <Text fontWeight="medium">
                          {property?.name} - {transaction.description}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.category || 'Uncategorized'} • <Text as="span" color={isIncome ? 'green.500' : 'red.500'}>{isIncome ? 'Income' : 'Expense'}</Text>
                        </Text>
                      </VStack>
                      <Text
                        fontWeight="bold"
                        color={isIncome ? 'green.500' : 'red.500'}
                      >
                        {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                      </Text>
                    </HStack>
                  );
                })}
              {(!transactions || transactions.length === 0) && (
                <Text color="gray.500" textAlign="center">No recent activity</Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Property Overview */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Property Overview</Heading>
            <Box>
              {properties.map((property, index) => {
                const propertyTransactions = transactions
                  .filter(t => 
                    t.propertyId === property.id && 
                    t.type === 'Income' &&
                    t.category === 'Rent' &&
                    new Date(t.date).getMonth() === new Date().getMonth()
                  );
                const occupiedUnits = propertyTransactions.length;
                const totalUnits = property.totalUnits || occupiedUnits;
                const monthlyRevenue = propertyTransactions.reduce((sum, t) => sum + t.amount, 0);

                return (
                  <HStack
                    key={property.id}
                    spacing={4}
                    py={3}
                    borderBottomWidth={index !== properties.length - 1 ? 1 : 0}
                    borderColor={borderColor}
                  >
                    <Box
                      p={2}
                      bg="blue.50"
                      borderRadius="lg"
                    >
                      <Icon as={Building2} boxSize={4} color="blue.500" />
                    </Box>
                    <Box flex={1}>
                      <Text fontWeight="medium">{property.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {occupiedUnits}/{totalUnits} occupied
                      </Text>
                    </Box>
                    <Text color="green.500" fontWeight="medium">
                      ${monthlyRevenue.toLocaleString()}
                      <Text as="span" fontSize="sm" color="gray.500"> Monthly</Text>
                    </Text>
                  </HStack>
                );
              })}
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Customer Support */}
      <CustomerSupport />
    </Box>
  );
};

export default Dashboard;