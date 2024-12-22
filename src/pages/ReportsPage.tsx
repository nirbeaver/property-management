import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  VStack,
  HStack,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { ChevronDownIcon, DownloadIcon, SearchIcon, CalendarIcon } from '@chakra-ui/icons';
import { useTransactions } from '../hooks/useTransactions';
import { useProperties } from '../hooks/useProperties';

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

interface Property {
  id: string;
  name: string;
  address: string;
}

interface Lease {
  id: string;
  propertyId: string;
  unit: string;
  tenant: string;
  monthlyRent: number;
  startDate: string;
  endDate: string;
}

interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  expensesByCategory: Record<string, { amount: number; percentage: number }>;
  incomeByCategory: Record<string, { amount: number; percentage: number }>;
}

interface PropertyMetrics {
  property: Property;
  income: number;
  expenses: number;
  netIncome: number;
  occupancyRate: number;
  leases: Lease[];
}

const ReportsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const { properties } = useProperties();
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    expensesByCategory: {},
    incomeByCategory: {},
  });
  const [propertyMetrics, setPropertyMetrics] = useState<PropertyMetrics[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [timeFrame, setTimeFrame] = useState<'monthly' | 'quarterly' | 'yearly' | 'lifetime'>('monthly');
  const [allLeases, setAllLeases] = useState<Lease[]>([]);
  const toast = useToast();

  useEffect(() => {
    // Load leases
    const savedLeases = localStorage.getItem('leases');
    if (savedLeases) {
      setAllLeases(JSON.parse(savedLeases));
    }
  }, []);

  useEffect(() => {
    updateDateRange(timeFrame);
  }, [timeFrame]);

  useEffect(() => {
    calculateMetrics();
  }, [dateRange, selectedProperty, transactions, properties]);

  const updateDateRange = (newTimeFrame: 'monthly' | 'quarterly' | 'yearly' | 'lifetime') => {
    const now = new Date();
    let start = new Date();

    switch (newTimeFrame) {
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'yearly':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'lifetime':
        start = new Date(2020, 0, 1); // Set a reasonable default start date
        break;
    }

    setDateRange({
      start: start.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0],
    });
  };

  const calculateMetrics = () => {
    try {
      if (!transactions.length || !properties.length) {
        return;
      }

      // Filter transactions by date range
      let filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      // Filter by selected property if not 'all'
      if (selectedProperty !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.property === selectedProperty);
      }

      // Calculate totals
      const totalExpenses = filteredTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalIncome = filteredTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate expenses by category
      const expensesByCategory = filteredTransactions
        .filter(t => t.type === 'Expense')
        .reduce((acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = { amount: 0, percentage: 0 };
          }
          acc[t.category].amount += t.amount;
          return acc;
        }, {} as Record<string, { amount: number; percentage: number }>);

      // Calculate percentages for expenses
      Object.values(expensesByCategory).forEach(category => {
        category.percentage = totalExpenses === 0 ? 0 : (category.amount / totalExpenses) * 100;
      });

      // Calculate property metrics
      const propertyMetricsData = properties
        .filter(p => selectedProperty === 'all' || p.id === selectedProperty)
        .map(property => {
          const propertyTransactions = filteredTransactions.filter(t => t.property === property.id);
          const propertyIncome = propertyTransactions
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + t.amount, 0);
          const propertyExpenses = propertyTransactions
            .filter(t => t.type === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);
          const propertyLeases = allLeases.filter(l => l.propertyId === property.id);
          
          // Calculate occupancy rate
          const totalUnits = new Set(propertyLeases.map(l => l.unit)).size;
          const occupiedUnits = propertyLeases.filter(l => {
            const now = new Date();
            return new Date(l.startDate) <= now && new Date(l.endDate) >= now;
          }).length;
          
          return {
            property,
            income: propertyIncome,
            expenses: propertyExpenses,
            netIncome: propertyIncome - propertyExpenses,
            occupancyRate: totalUnits ? (occupiedUnits / totalUnits) * 100 : 0,
            leases: propertyLeases,
          };
        });

      setMetrics({
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        expensesByCategory,
        incomeByCategory: {},
      });
      setPropertyMetrics(propertyMetricsData);

    } catch (error) {
      console.error('Error calculating metrics:', error);
      toast({
        title: 'Error calculating metrics',
        description: 'There was an error processing your data.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const generateExcelReport = () => {
    try {
      // Create detailed data for report
      const reportData = properties
        .filter(p => selectedProperty === 'all' || p.id === selectedProperty)
        .map(property => {
          const propertyTransactions = transactions
            .filter(t => t.property === property.id)
            .filter(t => {
              const transactionDate = new Date(t.date);
              const startDate = new Date(dateRange.start);
              const endDate = new Date(dateRange.end);
              return transactionDate >= startDate && transactionDate <= endDate;
            });

          const income = propertyTransactions
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + t.amount, 0);
          const expenses = propertyTransactions
            .filter(t => t.type === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return {
            propertyName: property.name,
            address: property.address,
            totalIncome: income,
            totalExpenses: expenses,
            netIncome: income - expenses,
            transactions: propertyTransactions.map(t => ({
              date: new Date(t.date).toLocaleDateString(),
              type: t.type,
              category: t.category,
              amount: t.amount.toFixed(2),
              description: t.description,
              vendor: t.vendor || ''
            }))
          };
        });

      // Create CSV content
      const csvRows = [];
      
      // Add summary section
      csvRows.push(['Financial Summary Report']);
      csvRows.push(['Date Range:', `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`]);
      csvRows.push([]);
      
      // Add property summaries
      csvRows.push(['Property Summaries']);
      csvRows.push(['Property Name', 'Address', 'Total Income', 'Total Expenses', 'Net Income']);
      reportData.forEach(property => {
        csvRows.push([
          property.propertyName,
          property.address,
          property.totalIncome.toFixed(2),
          property.totalExpenses.toFixed(2),
          property.netIncome.toFixed(2)
        ]);
      });
      csvRows.push([]);

      // Add expense categories
      csvRows.push(['Expense Categories']);
      csvRows.push(['Category', 'Amount', '% of Total']);
      Object.entries(metrics.expensesByCategory)
        .sort((a, b) => b[1].amount - a[1].amount)
        .forEach(([category, data]) => {
          csvRows.push([
            category,
            data.amount.toFixed(2),
            data.percentage.toFixed(1) + '%'
          ]);
        });
      csvRows.push([]);

      // Add detailed transactions
      csvRows.push(['Detailed Transactions']);
      csvRows.push(['Date', 'Property', 'Type', 'Category', 'Amount', 'Description', 'Vendor']);
      transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          return (selectedProperty === 'all' || t.property === selectedProperty) &&
                 transactionDate >= startDate && transactionDate <= endDate;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach(transaction => {
          csvRows.push([
            formatDate(transaction.date),
            properties.find(p => p.id === transaction.property)?.name || '',
            transaction.type,
            transaction.category,
            formatCurrency(transaction.amount),
            transaction.description,
            transaction.vendor || ''
          ]);
        });

      // Convert to CSV string
      const csvContent = csvRows.map(row => 
        row.map(cell => 
          typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
        ).join(',')
      ).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `financial_report_${timeFrame}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Report Generated',
        description: 'Financial report has been downloaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" maxW="1200px" mx="auto">
      {/* Header */}
      <Box bg="blue.500" p={4} borderRadius="md" color="white" mb={6}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="md">Financial Report</Heading>
            <Text fontSize="sm">
              {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
            </Text>
          </Box>
          <HStack spacing={4}>
            {/* Property Filter */}
            <Menu>
              <MenuButton 
                as={Button} 
                rightIcon={<ChevronDownIcon />} 
                bg="white" 
                color="gray.800"
                _hover={{ bg: 'gray.100' }}
                _active={{ bg: 'gray.200' }}
              >
                {selectedProperty === 'all' 
                  ? 'All Properties' 
                  : properties.find(p => p.id === selectedProperty)?.name || 'Select Property'}
              </MenuButton>
              <MenuList>
                <MenuItem 
                  onClick={() => setSelectedProperty('all')}
                  color="gray.800"
                >
                  All Properties
                </MenuItem>
                {properties.map(property => (
                  <MenuItem 
                    key={property.id} 
                    onClick={() => setSelectedProperty(property.id)}
                    color="gray.800"
                  >
                    {property.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Time Frame Filter */}
            <Select 
              bg="white" 
              color="gray.800"
              _hover={{ bg: 'gray.100' }}
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as 'monthly' | 'quarterly' | 'yearly' | 'lifetime')}
              w="150px"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </Select>

            {/* Download Excel Button */}
            <Button
              leftIcon={<DownloadIcon />}
              bg="white"
              color="gray.800"
              _hover={{ bg: 'gray.100' }}
              onClick={generateExcelReport}
            >
              Download Excel
            </Button>

            {/* Print Button */}
            <Button
              leftIcon={<DownloadIcon />}
              bg="white"
              color="gray.800"
              _hover={{ bg: 'gray.100' }}
              onClick={() => window.print()}
            >
              Print Report
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Executive Summary */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Executive Summary</Heading>
        <Flex gap={4}>
          <Box p={4} bg="green.50" borderRadius="md" flex={1}>
            <Text color="gray.600">Total Income</Text>
            <Text color="green.600" fontSize="xl" fontWeight="bold">
              {formatCurrency(metrics.totalIncome)}
            </Text>
          </Box>
          <Box p={4} bg="red.50" borderRadius="md" flex={1}>
            <Text color="gray.600">Total Expenses</Text>
            <Text color="red.600" fontSize="xl" fontWeight="bold">
              {formatCurrency(metrics.totalExpenses)}
            </Text>
          </Box>
          <Box p={4} bg="blue.50" borderRadius="md" flex={1}>
            <Text color="gray.600">Net Income</Text>
            <Text color={metrics.netIncome >= 0 ? "green.600" : "red.600"} fontSize="xl" fontWeight="bold">
              {formatCurrency(metrics.netIncome)}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Expense Analysis */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Expense Analysis</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>CATEGORY</Th>
              <Th isNumeric>AMOUNT</Th>
              <Th isNumeric>% OF TOTAL</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(metrics.expensesByCategory).map(([category, data]) => (
              <Tr key={category}>
                <Td>{category}</Td>
                <Td isNumeric>{formatCurrency(data.amount)}</Td>
                <Td isNumeric>{data.percentage.toFixed(1)}%</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Property Performance */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Property Performance</Heading>
        {propertyMetrics.map((property) => (
          <Box key={property.property.id} mb={6} borderWidth={1} borderRadius="md" p={4}>
            <Flex justify="space-between" align="center" mb={4}>
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">{property.property.name}</Text>
                <Text fontSize="sm" color="gray.600">{property.property.address}</Text>
              </VStack>
              <Text>
                Occupancy Rate: {property.occupancyRate.toFixed(0)}%
              </Text>
            </Flex>
            
            <Flex gap={4} mb={4}>
              <Box>
                <Text color="gray.600">Income</Text>
                <Text color="green.600">{formatCurrency(property.income)}</Text>
              </Box>
              <Box>
                <Text color="gray.600">Expenses</Text>
                <Text color="red.600">{formatCurrency(property.expenses)}</Text>
              </Box>
              <Box>
                <Text color="gray.600">Net Income</Text>
                <Text color={property.netIncome >= 0 ? "green.600" : "red.600"}>
                  {formatCurrency(property.netIncome)}
                </Text>
              </Box>
            </Flex>

            <Box>
              <Text fontWeight="bold" mb={2}>Active Leases</Text>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>UNIT</Th>
                    <Th>TENANT</Th>
                    <Th isNumeric>MONTHLY RENT</Th>
                    <Th>LEASE END</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {property.leases.map((lease) => (
                    <Tr key={lease.id}>
                      <Td>{lease.unit}</Td>
                      <Td>{lease.tenant}</Td>
                      <Td isNumeric>{formatCurrency(lease.monthlyRent)}</Td>
                      <Td>{formatDate(lease.endDate)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Transactions Table */}
      <Box mt={8}>
        <Heading size="md" mb={4}>All Transactions</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>DATE</Th>
              <Th>PROPERTY</Th>
              <Th>TYPE</Th>
              <Th>CATEGORY</Th>
              <Th isNumeric>AMOUNT</Th>
              <Th>DESCRIPTION</Th>
              <Th>VENDOR</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions
              .filter(t => {
                const transactionDate = new Date(t.date);
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);
                return (selectedProperty === 'all' || t.property === selectedProperty) &&
                       transactionDate >= startDate && transactionDate <= endDate;
              })
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>{formatDate(transaction.date)}</Td>
                  <Td>{properties.find(p => p.id === transaction.property)?.name}</Td>
                  <Td>{transaction.type}</Td>
                  <Td>{transaction.category}</Td>
                  <Td isNumeric color={transaction.type === 'Income' ? 'green.600' : 'red.600'}>
                    {formatCurrency(transaction.amount)}
                  </Td>
                  <Td>{transaction.description}</Td>
                  <Td>{transaction.vendor}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default ReportsPage;
