import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Stack,
  Badge,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  VStack,
  HStack,
  Icon,
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
} from '@chakra-ui/react';
import { Building2, DollarSign, MapPin, Bed, Bath, Square, Trash2, Edit2, Plus, Upload, X } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useTransactions } from '../hooks/useTransactions';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { properties, updateProperty } = useProperties();
  const { transactions } = useTransactions();
  const [property, setProperty] = useState<any>(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (id && properties.length > 0) {
      const foundProperty = properties.find((p: any) => p.id.toString() === id.toString());
      if (foundProperty) {
        setProperty(foundProperty);
        setFormData(foundProperty);
        if (foundProperty.imageUrl) {
          setImagePreview(foundProperty.imageUrl);
        }
      } else {
        navigate('/properties');
        toast({
          title: 'Property not found',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [id, properties, navigate, toast]);

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

  const handleEditProperty = () => {
    try {
      updateProperty(property.id, formData);
      toast({
        title: 'Success',
        description: 'Property updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
      // Update local state
      setProperty({ ...property, ...formData });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = () => {
    try {
      const storedProperties = localStorage.getItem('properties');
      const currentProperties = storedProperties ? JSON.parse(storedProperties) : [];
      const updatedProperties = currentProperties.filter((p: any) => p.id !== id);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      
      toast({
        title: 'Success',
        description: 'Property deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/properties');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Calculate financial metrics
  const propertyTransactions = transactions.filter(t => t.property === id);
  const monthlyIncome = propertyTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0) / 12;
  const monthlyExpenses = propertyTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0) / 12;
  const monthlyNet = monthlyIncome - monthlyExpenses;

  if (!property) return null;

  return (
    <Container maxW="container.xl" py={8}>
      <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
        <Box p={6}>
          <Stack spacing={6}>
            <HStack justify="space-between" align="center">
              <HStack>
                <Icon as={Building2} boxSize={6} />
                <Heading size="lg">{property.name}</Heading>
              </HStack>
              <HStack spacing={2}>
                <Button
                  leftIcon={<Plus size={20} />}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate(`/transactions?propertyId=${property.id}`)}
                >
                  Add Transaction
                </Button>
                <Button
                  leftIcon={<Edit2 size={20} />}
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                  onClick={onEditOpen}
                >
                  Edit
                </Button>
                <Button
                  leftIcon={<Trash2 size={20} />}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={onDeleteOpen}
                >
                  Delete
                </Button>
              </HStack>
            </HStack>

            <HStack spacing={4}>
              <Icon as={MapPin} />
              <Text>{property.address}</Text>
            </HStack>

            {property.imageUrl && (
              <Image
                src={property.imageUrl}
                alt={property.name}
                objectFit="cover"
                borderRadius="md"
                maxH="300px"
                w="100%"
              />
            )}

            <Stack spacing={4}>
              <VStack align="start" spacing={3}>
                <HStack>
                  <Icon as={Building2} />
                  <Text>Units: {property.totalUnits || 1}</Text>
                </HStack>

                <HStack>
                  <Icon as={DollarSign} color="green.500" />
                  <Text>Monthly Income: ${monthlyIncome.toFixed(0)}</Text>
                </HStack>

                <HStack>
                  <Icon as={DollarSign} color="red.500" />
                  <Text>Monthly Expenses: ${monthlyExpenses.toFixed(0)}</Text>
                </HStack>

                <HStack>
                  <Icon as={DollarSign} color="blue.500" />
                  <Text>Monthly Net: ${monthlyNet.toFixed(0)}</Text>
                </HStack>

                <HStack>
                  <Icon as={Square} />
                  <Text>Square Footage: {property.squareFeet || 0} sqft</Text>
                </HStack>

                <HStack>
                  <Icon as={Bed} />
                  <Text>Bedrooms: {property.bedrooms || 1}</Text>
                </HStack>

                <HStack>
                  <Icon as={Bath} />
                  <Text>Bathrooms: {property.bathrooms || 1}</Text>
                </HStack>
              </VStack>
            </Stack>
          </Stack>
        </Box>
      </Box>

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
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4} width="100%">
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
              </Stack>
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
                      <Button
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
                      >
                        <Icon as={X} />
                      </Button>
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
                  <VStack spacing={4} align="stretch">
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
              Are you sure you want to delete {property.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default PropertyDetails;
