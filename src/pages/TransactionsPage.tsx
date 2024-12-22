import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Badge,
  HStack,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Icon,
  SimpleGrid,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  Plus,
  Eye,
  Trash2,
  Search,
  SlidersHorizontal,
  X,
  DollarSign,
  Upload,
  FileText,
  Download,
} from 'lucide-react';

interface Transaction {
  id: string;
  property: string;
  type: 'Expense' | 'Income';
  category: string;
  amount: number;
  date: string;
  description: string;
  vendor?: string;
  documents?: Array<{
    name: string;
    type: string;
    data: string;
  }>;
  isRecurring?: string;
  recurringEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Property {
  id: string;
  name: string;
}

const expenseCategories = [
  'Pool Maintenance',
  'Garden/Landscaping',
  'Repairs',
  'Utilities',
  'Insurance',
  'Property Tax',
  'Mortgage',
  'HOA Fees',
  'Pest Control',
  'Cleaning',
  'Marketing',
  'Legal Fees',
  'Other'
];

const incomeCategories = [
  'Rent',
  'Late Fees',
  'Pet Rent',
  'Parking',
  'Storage',
  'Application Fees',
  'Security Deposit',
  'Other'
];

const useProperties = () => {
  const properties = JSON.parse(localStorage.getItem('properties') || '[]');
  return { properties };
};

const TransactionsPage = () => {
  const [searchParams] = useSearchParams();
  const propertyIdFromUrl = searchParams.get('propertyId');
  const { properties } = useProperties();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [newTransaction, setNewTransaction] = useState({
    property: '',
    type: 'expense',
    category: '',
    amount: '',
    date: '',
    description: '',
    vendor: '',
    documents: [] as Array<{
      name: string;
      type: string;
      data: string;
    }>,
    isRecurring: 'one-time',
    recurringEndDate: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  // Load transactions on component mount
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: 'Error',
        description: 'There was an error loading your transactions.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, []);

  useEffect(() => {
    if (propertyIdFromUrl) {
      setSelectedProperty(propertyIdFromUrl);
      setIsAddModalOpen(true);
    }
  }, [propertyIdFromUrl]);

  const handleCreateTransaction = () => {
    try {
      const transaction: Transaction = {
        id: Date.now().toString(),
        property: newTransaction.property,
        type: selectedType === 'expense' ? 'Expense' : 'Income',
        category: newTransaction.category,
        amount: Number(newTransaction.amount),
        date: newTransaction.date,
        description: newTransaction.description || '',
        vendor: newTransaction.vendor,
        documents: newTransaction.documents,
        isRecurring: newTransaction.isRecurring,
        recurringEndDate: newTransaction.recurringEndDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get existing transactions
      const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Add new transaction
      const updatedTransactions = [...existingTransactions, transaction];
      
      // Save to localStorage
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      // Update state
      setTransactions(updatedTransactions);

      // Notify other components
      window.dispatchEvent(new Event('transactionUpdate'));

      // Reset form
      setNewTransaction({
        property: '',
        type: 'expense',
        category: '',
        amount: '',
        date: '',
        description: '',
        vendor: '',
        documents: [],
        isRecurring: 'one-time',
        recurringEndDate: '',
      });
      setSelectedType('expense');

      // Close modal and show success message
      setIsAddModalOpen(false);
      toast({
        title: 'Transaction created',
        description: 'Your transaction has been recorded successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating your transaction.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteAlertOpen(true);
  };

  const onDeleteAlertClose = () => {
    setIsDeleteAlertOpen(false);
    setTransactionToDelete(null);
  };

  const confirmDelete = () => {
    if (!transactionToDelete) return;

    const updatedTransactions = transactions.filter(t => t.id !== transactionToDelete.id);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Notify other components about the deletion
    window.dispatchEvent(new Event('transactionUpdate'));
    
    toast({
      title: 'Transaction deleted',
      description: 'The transaction has been successfully deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    onDeleteAlertClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewTransaction(prev => ({
          ...prev,
          documents: [
            ...prev.documents,
            {
              name: file.name,
              type: file.type,
              data: base64String
            }
          ]
        }));

        toast({
          title: 'Document uploaded',
          description: `${file.name} has been added`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index: number) => {
    setNewTransaction(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const downloadDocument = (doc: { name: string; data: string }) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter transactions based on selected property
  const filteredTransactions = selectedProperty
    ? transactions.filter(t => t.property === selectedProperty)
    : transactions;

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Expenses & Income</Heading>
        <Button
          leftIcon={<Plus />}
          colorScheme="blue"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
        >
          New Transaction
        </Button>
      </Flex>
      
      <Box bg="white" rounded="lg" shadow="md" borderWidth="1px" borderColor="gray.200">
        <VStack spacing={6} align="stretch" p={6}>
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="gray.700">Expenses</Heading>
          </Flex>

          {/* Filters */}
          <Box bg="white" p={4} rounded="lg" shadow="sm" borderWidth="1px" borderColor="gray.200">
            <Flex gap={4} mb={6}>
              <InputGroup maxW="xl">
                <InputLeftElement>
                  <Search className="text-gray-400" size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Search by payee, description, or reference..."
                  bg="white"
                />
              </InputGroup>
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button
                    leftIcon={<SlidersHorizontal size={20} />}
                    variant="outline"
                  >
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent p={4} width="400px">
                  <PopoverBody>
                    <VStack spacing={4} align="stretch">
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="medium">Filters</Text>
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<X size={16} />}
                          onClick={() => {
                            setSelectedProperty('');
                          }}
                        >
                          Clear All
                        </Button>
                      </Flex>
                      <FormControl>
                        <FormLabel>Property</FormLabel>
                        <Select
                          placeholder="All Properties"
                          value={selectedProperty}
                          onChange={(e) => setSelectedProperty(e.target.value)}
                        >
                          {properties.map((property: Property) => (
                            <option key={property.id} value={property.id}>
                              {property.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          </Box>

          {/* Transactions List */}
          <Box bg="white" rounded="lg" shadow="sm" borderWidth="1px" borderColor="gray.200" overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.600">Date</Th>
                  <Th color="gray.600">Property</Th>
                  <Th color="gray.600">Type</Th>
                  <Th color="gray.600">Category</Th>
                  <Th color="gray.600">Amount</Th>
                  <Th color="gray.600">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((transaction) => (
                  <Tr key={transaction.id} _hover={{ bg: 'gray.50' }}>
                    <Td color="gray.700">{new Date(transaction.date).toLocaleDateString()}</Td>
                    <Td color="gray.700">{transaction.property}</Td>
                    <Td>
                      <Badge
                        colorScheme={transaction.type === 'Income' ? 'green' : 'red'}
                        rounded="full"
                        px={2}
                      >
                        {transaction.type}
                      </Badge>
                    </Td>
                    <Td color="gray.700">{transaction.category}</Td>
                    <Td color="gray.700">
                      ${Number(transaction.amount).toLocaleString()}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="View transaction"
                          icon={<Eye size={16} />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsViewModalOpen(true);
                          }}
                        />
                        <IconButton
                          aria-label="Delete transaction"
                          icon={<Trash2 size={16} />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteTransaction(transaction)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Box>

      {/* Add Transaction Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent bg="white">
          <ModalHeader color="gray.700">Add Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel color="gray.700">Property</FormLabel>
                <Select
                  placeholder="Select property"
                  value={newTransaction.property}
                  onChange={(e) => setNewTransaction({ ...newTransaction, property: e.target.value })}
                >
                  {properties.map((property: Property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.700">Type</FormLabel>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as 'expense' | 'income')}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.700">Category</FormLabel>
                <Select
                  placeholder="Select category"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                >
                  {selectedType === 'expense' 
                    ? expenseCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    : incomeCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                  }
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.700">Amount</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<DollarSign size={16} />} />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.700">Date</FormLabel>
                <Input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700">Description</FormLabel>
                <Textarea
                  placeholder="Enter description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700">{selectedType === 'income' ? 'Tenant' : 'Vendor'}</FormLabel>
                <Input
                  placeholder={`Enter ${selectedType === 'income' ? 'tenant' : 'vendor'} name`}
                  value={newTransaction.vendor}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, vendor: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700">Documents</FormLabel>
                <Box
                  borderWidth={2}
                  borderStyle="dashed"
                  borderColor="gray.300"
                  rounded="md"
                  p={4}
                  cursor="pointer"
                  bg="gray.50"
                  _hover={{ borderColor: 'blue.500', bg: 'blue.50' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <VStack spacing={2}>
                    <Icon as={Upload} boxSize={6} color="gray.500" />
                    <Text fontWeight="medium" color="gray.700">Upload Documents</Text>
                    <Text fontSize="sm" color="gray.600">
                      Click to upload or drag and drop
                    </Text>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      display="none"
                    />
                  </VStack>
                </Box>

                {/* Document List */}
                {newTransaction.documents.length > 0 && (
                  <VStack mt={4} align="stretch" spacing={2}>
                    <Text fontWeight="medium" fontSize="sm" color="gray.700">
                      Uploaded Documents ({newTransaction.documents.length})
                    </Text>
                    {newTransaction.documents.map((doc, index) => (
                      <Flex
                        key={index}
                        p={2}
                        bg="gray.100"
                        rounded="md"
                        align="center"
                        justify="space-between"
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <HStack>
                          <Icon as={FileText} color="blue.500" />
                          <Text fontSize="sm" color="gray.700" noOfLines={1}>
                            {doc.name}
                          </Text>
                        </HStack>
                        <HStack>
                          <IconButton
                            aria-label="Download document"
                            icon={<Download size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => downloadDocument(doc)}
                          />
                          <IconButton
                            aria-label="Remove document"
                            icon={<Trash2 size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => removeDocument(index)}
                          />
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700">Recurring</FormLabel>
                <Select
                  value={newTransaction.isRecurring}
                  onChange={(e) => setNewTransaction({ ...newTransaction, isRecurring: e.target.value })}
                >
                  <option value="one-time">One Time</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </Select>
              </FormControl>

              {newTransaction.isRecurring !== 'one-time' && (
                <FormControl>
                  <FormLabel color="gray.700">End Date</FormLabel>
                  <Input
                    type="date"
                    value={newTransaction.recurringEndDate}
                    onChange={(e) => setNewTransaction({ ...newTransaction, recurringEndDate: e.target.value })}
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter bg="gray.50" borderTopWidth={1} borderColor="gray.200">
            <Button variant="ghost" mr={3} onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateTransaction}>
              Create Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Transaction
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* View Transaction Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent bg="white">
          <ModalHeader color="gray.700">Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Property</Text>
                    <Text fontWeight="medium">
                      {properties.find(p => p.id === selectedTransaction.property)?.name || selectedTransaction.property}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Type</Text>
                    <Badge
                      colorScheme={selectedTransaction.type === 'Expense' ? 'red' : 'green'}
                      variant="subtle"
                      px={2}
                      py={1}
                      rounded="md"
                    >
                      {selectedTransaction.type}
                    </Badge>
                  </Box>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Category</Text>
                    <Text fontWeight="medium">{selectedTransaction.category}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Amount</Text>
                    <Text
                      fontWeight="medium"
                      color={selectedTransaction.amount < 0 ? 'red.500' : 'green.500'}
                    >
                      ${Math.abs(selectedTransaction.amount).toFixed(2)}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Date</Text>
                    <Text fontWeight="medium">{selectedTransaction.date}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.600" fontSize="sm">
                      {selectedTransaction.type === 'Income' ? 'Tenant' : 'Vendor'}
                    </Text>
                    <Text fontWeight="medium">{selectedTransaction.vendor || '-'}</Text>
                  </Box>
                  <Box gridColumn="span 2">
                    <Text color="gray.600" fontSize="sm">Description</Text>
                    <Text fontWeight="medium">{selectedTransaction.description || '-'}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Recurring</Text>
                    <Text fontWeight="medium" textTransform="capitalize">
                      {selectedTransaction.isRecurring || 'One Time'}
                    </Text>
                  </Box>
                  {selectedTransaction.isRecurring && selectedTransaction.isRecurring !== 'one-time' && (
                    <Box>
                      <Text color="gray.600" fontSize="sm">End Date</Text>
                      <Text fontWeight="medium">{selectedTransaction.recurringEndDate}</Text>
                    </Box>
                  )}
                  {selectedTransaction.documents && selectedTransaction.documents.length > 0 && (
                    <Box gridColumn="span 2">
                      <Text color="gray.600" fontSize="sm" mb={2}>Documents</Text>
                      <VStack align="stretch" spacing={2}>
                        {selectedTransaction.documents.map((doc, index) => (
                          <Flex
                            key={index}
                            p={2}
                            bg="gray.100"
                            rounded="md"
                            align="center"
                            justify="space-between"
                            borderWidth="1px"
                            borderColor="gray.200"
                          >
                            <HStack>
                              <Icon as={FileText} color="blue.500" />
                              <Text fontSize="sm" color="gray.700" noOfLines={1}>
                                {doc.name}
                              </Text>
                            </HStack>
                            <IconButton
                              aria-label="Download document"
                              icon={<Download size={16} />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => downloadDocument(doc)}
                            />
                          </Flex>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter bg="gray.50" borderTopWidth={1} borderColor="gray.200">
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionsPage;
