import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Image,
  Badge,
  Stack,
  Divider,
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
  NumberInput,
  NumberInputField,
  Textarea,
  Switch,
  FormHelperText,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Icon,
  IconButton,
  Tooltip,
  Link,
  SimpleGrid,
} from "@chakra-ui/react";
import { Plus, Building2, Eye, Edit2, DollarSign, Upload, File, Trash2, MapPin, Home, Calendar, Square, Bed, Bath, X } from "lucide-react";
import { useProperties } from "../hooks/useProperties";
import { useTransactions } from "../hooks/useTransactions";
import { Link as RouterLink } from "react-router-dom";

const Properties = () => {
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties();
  const { transactions, addTransaction } = useTransactions();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure();
  const { isOpen: isAddTransactionOpen, onOpen: onAddTransactionOpen, onClose: onAddTransactionClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    monthlyRent: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    imageUrl: "",
    totalUnits: 1,
    isLLC: false,
    llcInfo: {
      llcName: "",
      ein: "",
      registrationState: "",
      registrationDate: "",
      email: "",
      phone: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("llcInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        llcInfo: {
          ...prev.llcInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberInputChange = (name: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isLLC: e.target.checked,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          imageUrl: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          imageUrl: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProperty = () => {
    const newProperty = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "Vacant",
      isArchived: false,
    };

    addProperty(newProperty);
    const acquisitionTransaction = {
      id: Date.now().toString() + '-acquisition',
      propertyId: newProperty.id,
      date: new Date().toISOString(),
      amount: 0,
      type: 'Expense',
      category: 'Property Acquisition',
      description: `Initial acquisition of ${newProperty.name}`,
      createdAt: new Date().toISOString(),
    };
    addTransaction(acquisitionTransaction);

    setFormData({
      name: "",
      address: "",
      description: "",
      monthlyRent: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      imageUrl: "",
      totalUnits: 1,
      isLLC: false,
      llcInfo: {
        llcName: "",
        ein: "",
        registrationState: "",
        registrationDate: "",
        email: "",
        phone: "",
      },
    });
    setImagePreview(null);
    onAddClose();
    toast({
      title: "Success",
      description: "Property added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEditProperty = () => {
    if (selectedProperty) {
      const updatedProperty = {
        ...selectedProperty,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      updateProperty(selectedProperty.id, updatedProperty);
      setSelectedProperty(null);
      setFormData({
        name: "",
        address: "",
        description: "",
        monthlyRent: 0,
        bedrooms: 0,
        bathrooms: 0,
        squareFeet: 0,
        imageUrl: "",
        totalUnits: 1,
        isLLC: false,
        llcInfo: {
          llcName: "",
          ein: "",
          registrationState: "",
          registrationDate: "",
          email: "",
          phone: "",
        },
      });
      setImagePreview(null);
      onEditClose();
      toast({
        title: "Success",
        description: "Property updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteProperty = () => {
    if (selectedProperty) {
      updateProperty(selectedProperty.id, { ...selectedProperty, isArchived: true });
      setSelectedProperty(null);
      onDeleteClose();
      toast({
        title: "Success",
        description: "Property archived successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRestoreProperty = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      updateProperty(propertyId, { ...property, isArchived: false });
      toast({
        title: "Success",
        description: "Property restored successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openEditModal = (property: any) => {
    setSelectedProperty(property);
    setFormData(property);
    setImagePreview(property.imageUrl);
    onEditOpen();
  };

  const openDeleteModal = (property: any) => {
    setSelectedProperty(property);
    onDeleteOpen();
  };

  const getPropertyStatus = (propertyId: string) => {
    const currentMonth = new Date().getMonth();
    const hasActiveRent = transactions.some(
      t => 
        t.propertyId === propertyId && 
        t.type === 'Income' &&
        t.category === 'Rent' &&
        new Date(t.date).getMonth() === currentMonth
    );
    return hasActiveRent ? "Rented" : "Vacant";
  };

  const calculateMonthlyRevenue = (propertyId: string) => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(
        t => 
          t.propertyId === propertyId && 
          t.type === 'Income' &&
          t.category === 'Rent' &&
          new Date(t.date).getMonth() === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyExpenses = (propertyId: string) => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(
        t => 
          t.propertyId === propertyId && 
          t.type === 'Expense' &&
          new Date(t.date).getMonth() === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Properties</Heading>
          <Text color="gray.600" mt={1}>
            Manage your real estate portfolio
          </Text>
        </Box>
        <Button leftIcon={<Plus />} colorScheme="blue" onClick={onAddOpen}>
          Add Property
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={8}>
        {properties.filter(p => !p.isArchived).map((property) => (
          <Card key={property.id} overflow="hidden" variant="outline">
            <CardBody>
              <Box position="relative">
                {property.imageUrl ? (
                  <Image
                    src={property.imageUrl}
                    alt={property.name}
                    borderRadius="lg"
                    height="200px"
                    width="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    height="200px"
                    width="100%"
                    bg="gray.100"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={Building2} boxSize={12} color="gray.400" />
                  </Box>
                )}
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme={property.isLLC ? "purple" : "blue"}
                >
                  {property.isLLC ? "LLC" : "Individual"}
                </Badge>
              </Box>

              <Stack mt="6" spacing="3">
                <Heading size="md">{property.name}</Heading>
                <HStack spacing={4}>
                  <Box flex="1">
                    <Text color="gray.600" fontSize="sm">
                      <Icon as={MapPin} inline mr={1} size={16} />
                      {property.address}
                    </Text>

                    <HStack mt={2} spacing={4}>
                      <Text fontSize="sm" color="gray.600">
                        <Icon as={Bed} inline mr={1} size={16} />
                        {property.bedrooms} beds
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        <Icon as={Bath} inline mr={1} size={16} />
                        {property.bathrooms} baths
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        <Icon as={Square} inline mr={1} size={16} />
                        {property.squareFeet} sqft
                      </Text>
                    </HStack>

                    <Text color="blue.600" fontSize="2xl" mt={2}>
                      <Icon as={DollarSign} inline mr={1} size={20} />
                      {property.monthlyRent.toLocaleString()}
                      <Text as="span" color="gray.600" fontSize="sm">
                        /month
                      </Text>
                    </Text>
                  </Box>

                  {/* LLC Information Column */}
                  {property.isLLC && (
                    <Box
                      borderLeft="1px"
                      borderColor="gray.200"
                      pl={4}
                      ml={4}
                      minW="150px"
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="bold" color="purple.600">
                          LLC Details
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {property.llcInfo.llcName}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {property.llcInfo.email}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {property.llcInfo.phone}
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </HStack>
              </Stack>

              <Divider my={4} />

              <HStack justify="space-between">
                <HStack>
                  <Tooltip label="View Details">
                    <IconButton
                      as={RouterLink}
                      to={`/properties/${property.id}`}
                      aria-label="View property details"
                      icon={<Eye size={18} />}
                      variant="ghost"
                      colorScheme="blue"
                    />
                  </Tooltip>
                  <Tooltip label="Edit Property">
                    <IconButton
                      aria-label="Edit property"
                      icon={<Edit2 size={18} />}
                      variant="ghost"
                      colorScheme="green"
                      onClick={() => {
                        setSelectedProperty(property);
                        setFormData({
                          ...property,
                          monthlyRent: Number(property.monthlyRent),
                        });
                        if (property.imageUrl) {
                          setImagePreview(property.imageUrl);
                        }
                        onEditOpen();
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="Add Transaction">
                    <IconButton
                      as={RouterLink}
                      to={`/transactions?propertyId=${property.id}`}
                      aria-label="Add transaction"
                      icon={<DollarSign size={18} />}
                      variant="ghost"
                      colorScheme="purple"
                    />
                  </Tooltip>
                </HStack>
                <Tooltip label="Delete Property">
                  <IconButton
                    aria-label="Delete property"
                    icon={<Trash2 size={18} />}
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => {
                      setSelectedProperty(property);
                      onDeleteOpen();
                    }}
                  />
                </Tooltip>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Add Property Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Property</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Property Name</FormLabel>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name="address" value={formData.address} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Monthly Rent</FormLabel>
                <NumberInput
                  value={formData.monthlyRent}
                  onChange={(value) => handleNumberInputChange("monthlyRent", value)}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <Grid templateColumns="repeat(3, 1fr)" gap={4} width="100%">
                <FormControl>
                  <FormLabel>Bedrooms</FormLabel>
                  <NumberInput
                    value={formData.bedrooms}
                    onChange={(value) => handleNumberInputChange("bedrooms", value)}
                    min={0}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Bathrooms</FormLabel>
                  <NumberInput
                    value={formData.bathrooms}
                    onChange={(value) => handleNumberInputChange("bathrooms", value)}
                    min={0}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Square Feet</FormLabel>
                  <NumberInput
                    value={formData.squareFeet}
                    onChange={(value) => handleNumberInputChange("squareFeet", value)}
                    min={0}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Grid>
              <FormControl>
                <FormLabel>Total Units</FormLabel>
                <NumberInput
                  value={formData.totalUnits}
                  onChange={(value) => handleNumberInputChange("totalUnits", value)}
                  min={1}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Property Image</FormLabel>
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  cursor="pointer"
                  onClick={() => document.getElementById('property-image')?.click()}
                >
                  {imagePreview ? (
                    <Box position="relative">
                      <Image 
                        src={imagePreview} 
                        alt="Property Preview" 
                        maxH="200px" 
                        mx="auto"
                      />
                      <IconButton
                        aria-label="Remove image"
                        icon={<X />}
                        position="absolute"
                        top={2}
                        right={2}
                        size="sm"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setFormData(prev => ({
                            ...prev,
                            imageUrl: ""
                          }));
                        }}
                      />
                    </Box>
                  ) : (
                    <VStack spacing={2}>
                      <Icon as={Upload} boxSize={8} color="gray.400" />
                      <Text>Drag and drop an image here or click to select</Text>
                      <Text fontSize="sm" color="gray.500">
                        Supports: JPG, PNG, GIF
                      </Text>
                    </VStack>
                  )}
                  <Input
                    id="property-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    display="none"
                  />
                </Box>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">LLC Property</FormLabel>
                <Switch isChecked={formData.isLLC} onChange={handleSwitchChange} />
              </FormControl>
              {formData.isLLC && (
                <Box width="100%" p={4} bg="gray.50" borderRadius="md">
                  <VStack spacing={4} align="stretch" mt={4}>
                    <Heading size="sm">LLC Information</Heading>
                    <FormControl>
                      <FormLabel>LLC Name</FormLabel>
                      <Input
                        name="llcInfo.llcName"
                        value={formData.llcInfo.llcName}
                        onChange={handleInputChange}
                        placeholder="Enter LLC name"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>EIN</FormLabel>
                      <Input
                        name="llcInfo.ein"
                        value={formData.llcInfo.ein}
                        onChange={handleInputChange}
                        placeholder="XX-XXXXXXX"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Registration State</FormLabel>
                      <Input
                        name="llcInfo.registrationState"
                        value={formData.llcInfo.registrationState}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Registration Date</FormLabel>
                      <Input
                        name="llcInfo.registrationDate"
                        type="date"
                        value={formData.llcInfo.registrationDate}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>LLC Email</FormLabel>
                      <Input
                        name="llcInfo.email"
                        type="email"
                        value={formData.llcInfo.email}
                        onChange={handleInputChange}
                        placeholder="Enter LLC email"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>LLC Phone</FormLabel>
                      <Input
                        name="llcInfo.phone"
                        type="tel"
                        value={formData.llcInfo.phone}
                        onChange={handleInputChange}
                        placeholder="Enter LLC phone number"
                      />
                    </FormControl>
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddProperty}>
              Add Property
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Property Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Property</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Property Name</FormLabel>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name="address" value={formData.address} onChange={handleInputChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Monthly Rent</FormLabel>
                <NumberInput
                  value={formData.monthlyRent}
                  onChange={(value) => handleNumberInputChange("monthlyRent", value)}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <Grid templateColumns="repeat(3, 1fr)" gap={4} width="100%">
                <FormControl>
                  <FormLabel>Bedrooms</FormLabel>
                  <NumberInput
                    value={formData.bedrooms}
                    onChange={(value) => handleNumberInputChange("bedrooms", value)}
                    min={0}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Bathrooms</FormLabel>
                  <NumberInput
                    value={formData.bathrooms}
                    onChange={(value) => handleNumberInputChange("bathrooms", value)}
                    min={0}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Square Feet</FormLabel>
                  <NumberInput
                    value={formData.squareFeet}
                    onChange={(value) => handleNumberInputChange("squareFeet", value)}
                    min={0}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Grid>
              <FormControl>
                <FormLabel>Total Units</FormLabel>
                <NumberInput
                  value={formData.totalUnits}
                  onChange={(value) => handleNumberInputChange("totalUnits", value)}
                  min={1}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Property Image</FormLabel>
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  cursor="pointer"
                  onClick={() => document.getElementById('property-image')?.click()}
                >
                  {imagePreview ? (
                    <Box position="relative">
                      <Image 
                        src={imagePreview} 
                        alt="Property Preview" 
                        maxH="200px" 
                        mx="auto"
                      />
                      <IconButton
                        aria-label="Remove image"
                        icon={<X />}
                        position="absolute"
                        top={2}
                        right={2}
                        size="sm"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setFormData(prev => ({
                            ...prev,
                            imageUrl: ""
                          }));
                        }}
                      />
                    </Box>
                  ) : (
                    <VStack spacing={2}>
                      <Icon as={Upload} boxSize={8} color="gray.400" />
                      <Text>Drag and drop an image here or click to select</Text>
                      <Text fontSize="sm" color="gray.500">
                        Supports: JPG, PNG, GIF
                      </Text>
                    </VStack>
                  )}
                  <Input
                    id="property-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    display="none"
                  />
                </Box>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">LLC Property</FormLabel>
                <Switch isChecked={formData.isLLC} onChange={handleSwitchChange} />
              </FormControl>
              {formData.isLLC && (
                <Box width="100%" p={4} bg="gray.50" borderRadius="md">
                  <VStack spacing={4} align="stretch" mt={4}>
                    <Heading size="sm">LLC Information</Heading>
                    <FormControl>
                      <FormLabel>LLC Name</FormLabel>
                      <Input
                        name="llcInfo.llcName"
                        value={formData.llcInfo.llcName}
                        onChange={handleInputChange}
                        placeholder="Enter LLC name"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>EIN</FormLabel>
                      <Input
                        name="llcInfo.ein"
                        value={formData.llcInfo.ein}
                        onChange={handleInputChange}
                        placeholder="XX-XXXXXXX"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Registration State</FormLabel>
                      <Input
                        name="llcInfo.registrationState"
                        value={formData.llcInfo.registrationState}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Registration Date</FormLabel>
                      <Input
                        name="llcInfo.registrationDate"
                        type="date"
                        value={formData.llcInfo.registrationDate}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>LLC Email</FormLabel>
                      <Input
                        name="llcInfo.email"
                        type="email"
                        value={formData.llcInfo.email}
                        onChange={handleInputChange}
                        placeholder="Enter LLC email"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>LLC Phone</FormLabel>
                      <Input
                        name="llcInfo.phone"
                        type="tel"
                        value={formData.llcInfo.phone}
                        onChange={handleInputChange}
                        placeholder="Enter LLC phone number"
                      />
                    </FormControl>
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="red" mr={3} onClick={() => {
              onEditClose();
              onDeleteOpen();
            }}>
              Delete
            </Button>
            <Button colorScheme="blue" onClick={handleEditProperty}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Property
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {selectedProperty?.name}? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteProperty} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Property Review Modal */}
      <Modal isOpen={isReviewOpen} onClose={onReviewClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={0}>
            {selectedProperty && (
              <Box bg="gray.50" minH="90vh">
                <HStack justify="space-between" p={4} bg="white" borderBottomWidth={1}>
                  <HStack spacing={3}>
                    <Icon as={Building2} boxSize={6} />
                    <Heading size="md">{selectedProperty.name}</Heading>
                  </HStack>
                  <HStack spacing={2}>
                    <Button
                      leftIcon={<Plus />}
                      colorScheme="blue"
                      onClick={() => {
                        onReviewClose();
                        // Open add transaction modal with property pre-selected
                        setSelectedProperty(selectedProperty);
                        onAddTransactionOpen();
                      }}
                    >
                      Add Transaction
                    </Button>
                    <Button
                      leftIcon={<Edit2 />}
                      variant="outline"
                      onClick={() => {
                        onReviewClose();
                        openEditModal(selectedProperty);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      leftIcon={<Trash2 />}
                      variant="outline"
                      colorScheme="red"
                      onClick={() => {
                        onReviewClose();
                        openDeleteModal(selectedProperty);
                      }}
                    >
                      Delete
                    </Button>
                    <IconButton
                      icon={<X />}
                      aria-label="Close"
                      variant="ghost"
                      onClick={onReviewClose}
                    />
                  </HStack>
                </HStack>

                <Box p={6}>
                  <VStack align="stretch" spacing={6}>
                    <HStack spacing={4} align="flex-start">
                      <Box flex={1}>
                        <VStack align="stretch" spacing={4}>
                          <HStack>
                            <Icon as={MapPin} />
                            <Text color="gray.600">{selectedProperty.address}</Text>
                          </HStack>
                          
                          <Image
                            src={selectedProperty.imageUrl || "https://via.placeholder.com/600x400"}
                            alt={selectedProperty.name}
                            borderRadius="md"
                            objectFit="cover"
                            width="100%"
                            height="400px"
                          />

                          <SimpleGrid columns={2} spacing={4}>
                            <VStack align="start">
                              <Text color="gray.600">Units</Text>
                              <HStack>
                                <Icon as={Home} />
                                <Text>{selectedProperty.totalUnits}</Text>
                              </HStack>
                            </VStack>
                            
                            <VStack align="start">
                              <Text color="gray.600">Monthly Income</Text>
                              <HStack>
                                <Icon as={DollarSign} color="green.500" />
                                <Text>${selectedProperty.monthlyRent || 0}</Text>
                              </HStack>
                            </VStack>

                            <VStack align="start">
                              <Text color="gray.600">Monthly Expenses</Text>
                              <HStack>
                                <Icon as={DollarSign} color="red.500" />
                                <Text>${getMonthlyExpenses(selectedProperty.id)}</Text>
                              </HStack>
                            </VStack>

                            <VStack align="start">
                              <Text color="gray.600">Monthly Net</Text>
                              <HStack>
                                <Icon as={DollarSign} color="blue.500" />
                                <Text>${selectedProperty.monthlyRent - getMonthlyExpenses(selectedProperty.id)}</Text>
                              </HStack>
                            </VStack>

                            <VStack align="start">
                              <Text color="gray.600">Year Built</Text>
                              <HStack>
                                <Icon as={Calendar} />
                                <Text>{selectedProperty.yearBuilt || 'N/A'}</Text>
                              </HStack>
                            </VStack>

                            <VStack align="start">
                              <Text color="gray.600">Square Footage</Text>
                              <HStack>
                                <Icon as={Square} />
                                <Text>{selectedProperty.squareFeet} sqft</Text>
                              </HStack>
                            </VStack>

                            <VStack align="start">
                              <Text color="gray.600">Bedrooms</Text>
                              <HStack>
                                <Icon as={Bed} />
                                <Text>{selectedProperty.bedrooms}</Text>
                              </HStack>
                            </VStack>

                            <VStack align="start">
                              <Text color="gray.600">Bathrooms</Text>
                              <HStack>
                                <Icon as={Bath} />
                                <Text>{selectedProperty.bathrooms}</Text>
                              </HStack>
                            </VStack>
                          </SimpleGrid>
                        </VStack>
                      </Box>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Archived Properties */}
      <Box mt={8}>
        <Heading size="md" mb={4}>
          Archived Properties
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {properties.filter(p => p.isArchived).map((property) => (
            <Card key={property.id} overflow="hidden">
              <Image
                src={property.imageUrl || "https://via.placeholder.com/300x200"}
                alt={property.name}
                height="200px"
                objectFit="cover"
              />
              <CardBody>
                <Stack spacing={3}>
                  <Heading size="md">{property.name}</Heading>
                  <Text color="gray.600" noOfLines={2}>
                    {property.address}
                  </Text>
                  <HStack>
                    <Badge colorScheme="gray">Archived</Badge>
                  </HStack>
                  <Divider />
                  <HStack spacing={2} justify="flex-end">
                    <Tooltip label="Restore">
                      <Button
                        aria-label="Restore property"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => handleRestoreProperty(property.id)}
                      >
                        Restore
                      </Button>
                    </Tooltip>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Properties;
