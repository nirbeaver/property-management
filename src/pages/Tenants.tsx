import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  VStack,
  HStack,
  Avatar,
  Badge,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Icon,
  Spinner,
  useColorModeValue,
  IconButton,
  Tooltip,
  Link,
  Textarea,
  Divider,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useTenants } from "../hooks/useTenants";
import { useProperties } from "../hooks/useProperties";
import { useTransactions } from "../hooks/useTransactions";
import { useTenantDocuments, TenantDocument } from "../hooks/useTenantDocuments";
import { useTenantNotes, TenantNote } from "../hooks/useTenantNotes";
import { useCompanySettings } from '../hooks/useCompanySettings';
import { Tenant } from "../types/tenant";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Plus,
  FileText,
  Download,
  Trash2,
  Edit2,
  AlertTriangle,
} from "lucide-react";

const TenantCard = ({ tenant, onSelect, isSelected }: { tenant: Tenant; onSelect: (tenant: Tenant) => void; isSelected: boolean }) => {
  const { properties } = useProperties();
  const property = properties?.find(p => p.id === tenant.propertyId);
  const cardBg = useColorModeValue('white', 'gray.800');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <Card 
      cursor="pointer" 
      onClick={() => onSelect(tenant)}
      bg={isSelected ? selectedBg : cardBg}
      borderWidth={isSelected ? "2px" : "1px"}
      borderColor={isSelected ? "blue.500" : "gray.200"}
      _hover={{ shadow: "md" }}
    >
      <CardBody>
        <HStack spacing={4}>
          <Avatar name={tenant.name} size="md" />
          <VStack align="stretch" flex={1} spacing={2}>
            <HStack justify="space-between">
              <Heading size="sm">{tenant.name}</Heading>
              <Badge
                colorScheme={tenant.status === 'Active' ? 'green' : 'red'}
              >
                {tenant.status}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {property?.name || 'N/A'} - Unit {tenant.unitNumber}
            </Text>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

const DocumentUploadButton = ({ onUpload }: { onUpload: (file: File) => Promise<void> }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await onUpload(file);
      } finally {
        setIsUploading(false);
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
      <Button
        leftIcon={<Plus />}
        size="sm"
        colorScheme="blue"
        onClick={handleClick}
        isLoading={isUploading}
        loadingText="Uploading..."
      >
        Upload Document
      </Button>
    </>
  );
};

const DocumentList = ({ 
  documents,
  onDelete
}: { 
  documents: TenantDocument[];
  onDelete: (id: string) => Promise<void>;
}) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <VStack align="stretch" spacing={4}>
      {documents.map((doc) => (
        <Card key={doc.id} variant="outline">
          <CardBody>
            <HStack justify="space-between">
              <HStack spacing={3}>
                <Icon as={FileText} color="blue.500" />
                <VStack align="start" spacing={0}>
                  <Link
                    color="blue.500"
                    fontWeight="medium"
                    onClick={() => window.open(doc.url, '_blank')}
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {doc.name}
                  </Link>
                  <HStack spacing={2} fontSize="sm" color="gray.500">
                    <Text>{formatFileSize(doc.size)}</Text>
                    <Text>•</Text>
                    <Text>{new Date(doc.uploadDate).toLocaleDateString()}</Text>
                  </HStack>
                </VStack>
              </HStack>
              <Tooltip label="Delete Document">
                <IconButton
                  aria-label="Delete document"
                  icon={<Trash2 />}
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this document?')) {
                      onDelete(doc.id);
                    }
                  }}
                />
              </Tooltip>
            </HStack>
          </CardBody>
        </Card>
      ))}
      {documents.length === 0 && (
        <Box p={4} textAlign="center" color="gray.500">
          No documents uploaded yet
        </Box>
      )}
    </VStack>
  );
};

const NoteList = ({ 
  notes,
  onEdit,
  onDelete 
}: { 
  notes: TenantNote[];
  onEdit: (note: TenantNote) => void;
  onDelete: (id: string) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <VStack align="stretch" spacing={4}>
      {notes.map((note) => (
        <Card key={note.id} variant="outline">
          <CardBody>
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.500">
                  {formatDate(note.createdAt)}
                </Text>
                <HStack>
                  <Tooltip label="Edit Note">
                    <IconButton
                      aria-label="Edit note"
                      icon={<Edit2 />}
                      variant="ghost"
                      colorScheme="blue"
                      size="sm"
                      onClick={() => onEdit(note)}
                    />
                  </Tooltip>
                  <Tooltip label="Delete Note">
                    <IconButton
                      aria-label="Delete note"
                      icon={<Trash2 />}
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this note?')) {
                          onDelete(note.id);
                        }
                      }}
                    />
                  </Tooltip>
                </HStack>
              </HStack>
              <Text>{note.content}</Text>
            </VStack>
          </CardBody>
        </Card>
      ))}
      {notes.length === 0 && (
        <Box p={4} textAlign="center" color="gray.500">
          No notes added yet
        </Box>
      )}
    </VStack>
  );
};

const AddNoteModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialContent = '',
  isEditing = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  initialContent?: string;
  isEditing?: boolean;
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Note content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(content.trim());
      onClose();
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit Note' : 'Add Note'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              {error && (
                <Box w="100%" p={3} bg="red.100" color="red.700" borderRadius="md">
                  {error}
                </Box>
              )}
              <FormControl isRequired>
                <FormLabel>Note Content</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter note content..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Save Note
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const TenantDetails = ({ 
  tenant,
  onEdit,
  onDelete 
}: { 
  tenant: Tenant;
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
}) => {
  const { properties } = useProperties();
  const { transactions } = useTransactions();
  const { settings } = useCompanySettings();
  const { 
    getDocumentsForTenant, 
    addDocument, 
    deleteDocument,
    isLoading: isLoadingDocs
  } = useTenantDocuments();
  const {
    getNotesForTenant,
    addNote,
    updateNote,
    deleteNote,
    isLoading: isLoadingNotes
  } = useTenantNotes();

  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<TenantNote | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const property = properties?.find(p => p.id === tenant.propertyId);
  const documents = getDocumentsForTenant(tenant.id);
  const notes = getNotesForTenant(tenant.id);

  if (!tenant || !property) {
    return <Box p={4}>Loading...</Box>;
  }

  const calculateLeaseProgress = (moveInDate: string, moveOutDate: string) => {
    const moveIn = new Date(moveInDate);
    const moveOut = new Date(moveOutDate);
    const today = new Date();
    const totalDays = Math.round((moveOut.getTime() - moveIn.getTime()) / (1000 * 3600 * 24));
    const passedDays = Math.round((today.getTime() - moveIn.getTime()) / (1000 * 3600 * 24));
    return (passedDays / totalDays) * 100;
  };

  return (
    <Box p={6} bg="white" borderRadius="lg">
      {/* LLC Information Box */}
      <Box 
        p={4} 
        mb={6} 
        borderWidth={1} 
        borderRadius="md" 
        borderColor="gray.200"
        bg="gray.50"
      >
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">{property?.llcName || 'LLC Name'}</Text>
          <Text>{property?.llcPhone || 'LLC Phone'}</Text>
          <Text>{property?.llcEmail || 'LLC Email'}</Text>
        </VStack>
      </Box>

      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={1}>
          <Heading size="lg">{tenant.name}</Heading>
          <Badge colorScheme={tenant.status === 'Active' ? 'green' : 'red'}>
            {tenant.status}
          </Badge>
        </VStack>
        <HStack>
          <Tooltip label="Send Three Day Notice">
            <IconButton
              aria-label="Send three day notice"
              icon={<AlertTriangle />}
              variant="ghost"
              colorScheme="red"
              onClick={() => {
                const today = new Date();
                const dueDate = new Date(today);
                dueDate.setDate(today.getDate() + 3);
                
                const subject = `Three Day Notice to Pay Rent or Quit - ${property.name} Unit ${tenant.unitNumber}`;
                const body = `
THREE-DAY NOTICE TO PAY RENT OR QUIT
(California Civil Code Section 1161(2))

Date of Service: ${today.toLocaleDateString()}

TO ALL TENANTS AND ALL OTHERS IN POSSESSION OF:

${tenant.name}
${property.name}
Unit ${tenant.unitNumber}
${tenant.address}
${tenant.city}, ${tenant.state} ${tenant.zipCode}

PLEASE TAKE NOTICE that you are justly indebted to the landlord/management of the above-described premises for rent due as follows:

Current Monthly Rent Due: $${tenant.monthlyRent?.toLocaleString()}
Late Fees (if applicable): $${(tenant.monthlyRent * 0.06).toFixed(2)} (6% of monthly rent)
Total Amount Due: $${(tenant.monthlyRent * 1.06).toFixed(2)}

For the rental period: ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}

WITHIN THREE (3) DAYS from the date of service of this notice upon you, excluding Saturdays, Sundays, and other judicial holidays, you are hereby required to either:

1. PAY THE TOTAL AMOUNT DUE of $${(tenant.monthlyRent * 1.06).toFixed(2)} in full
   OR
2. VACATE AND DELIVER possession of the premises to the landlord/management.

PAYMENT METHODS ACCEPTED:
${settings?.paymentMethods?.online ? `• ONLINE PAYMENT:
  ${settings.paymentMethods.online}\n` : ''}${
  settings?.paymentMethods?.check ? 
  `• CHECK/MONEY ORDER:
  Make payable to: ${settings.paymentMethods.check.payableTo}
  Mail or deliver to: ${settings.paymentMethods.check.address}\n` : ''}${
  settings?.paymentMethods?.directDeposit ? 
  `• DIRECT DEPOSIT:
  Bank Name: ${settings.paymentMethods.directDeposit.bankName}
  Account Details: ${settings.paymentMethods.directDeposit.accountInfo}\n` : ''}

PLEASE TAKE FURTHER NOTICE that if you fail to perform or otherwise comply with the requirements of this notice within the specified period, the landlord/management elects to declare a forfeiture of your rental agreement/lease and will institute legal proceedings against you to:
1. Recover possession of the premises
2. Recover all rent and other monetary amounts due and owing
3. Recover attorney's fees (if provided for in the rental agreement)
4. Recover costs of suit

This notice is intended to be legally binding in accordance with California Civil Code Section 1161(2) and California Code of Civil Procedure Section 1161.

This is intended as a three (3) day notice to pay rent or quit. This notice supersedes all other notices to pay rent or quit previously served.

CERTIFICATE OF SERVICE
I, the undersigned, being at least 18 years of age, declare under penalty of perjury that I served the above notice, of which this is a true copy, on the above-mentioned tenant(s) in possession in the manner(s) indicated below:

□ By personally delivering a copy to the tenant(s)
□ By leaving a copy with a person of suitable age and discretion at the premises
□ By posting a copy in a conspicuous place on the premises
□ By sending a copy through certified mail

Date: ${today.toLocaleDateString()}

Sincerely,

${property.isLLC ? property.llcInfo?.llcName : settings?.companyName}
Contact Information:
Email: ${property.isLLC ? property.llcInfo?.email : settings?.email}
Phone: ${property.isLLC ? property.llcInfo?.phone : settings?.phone}
Address: ${settings?.paymentMethods?.check?.address || '[Company Address]'}

NOTICE TO TENANT: If you are in need of an explanation of this notice in another language, please notify the landlord/management immediately.
`;
                window.location.href = `mailto:${tenant.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              }}
            />
          </Tooltip>
          <Tooltip label="Send General Email">
            <IconButton
              aria-label="Send general email"
              icon={<Mail />}
              variant="ghost"
              colorScheme="blue"
              onClick={() => {
                const subject = `Regarding ${property.name} Unit ${tenant.unitNumber}`;
                const body = `
Dear ${tenant.name},

[Your message here]

Best regards,
${property.isLLC ? `
${property.llcInfo?.llcName}
Email: ${property.llcInfo?.email}
Phone: ${property.llcInfo?.phone}` : `
${settings?.companyName}
Email: ${settings?.email}
Phone: ${settings?.phone}`}`;
                
                window.location.href = `mailto:${tenant.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              }}
            />
          </Tooltip>
          <Tooltip label="Edit Tenant">
            <IconButton
              aria-label="Edit tenant"
              icon={<Edit2 />}
              variant="ghost"
              colorScheme="blue"
              onClick={() => onEdit(tenant)}
            />
          </Tooltip>
          <Tooltip label="Delete Tenant">
            <IconButton
              aria-label="Delete tenant"
              icon={<Trash2 />}
              variant="ghost"
              colorScheme="red"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this tenant?')) {
                  onDelete(tenant.id);
                }
              }}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {/* Lease Progress */}
      <Box p={4} bg="white" rounded="lg" shadow="sm" borderWidth="1px">
        <VStack align="stretch" spacing={2}>
          <Text fontWeight="medium" mb={2}>Lease Progress</Text>
          <Progress value={calculateLeaseProgress(tenant.moveInDate, tenant.moveOutDate)} size="sm" colorScheme="blue" rounded="full" />
          <Flex justify="space-between" fontSize="sm" color="gray.600">
            <Text>Move In: {new Date(tenant.moveInDate).toLocaleDateString()}</Text>
            <Text>Move Out: {new Date(tenant.moveOutDate).toLocaleDateString()}</Text>
          </Flex>
        </VStack>
      </Box>

      {/* Lease Details Box */}
      <Box 
        p={4} 
        borderWidth={1} 
        borderRadius="md" 
        borderColor="gray.200"
        bg="white"
        mb={4}
      >
        <VStack align="start" spacing={3} width="100%">
          <Text fontWeight="bold">Lease Details</Text>
          <SimpleGrid columns={2} spacing={4} width="100%">
            <Box>
              <Text color="gray.600">Monthly Rent:</Text>
              <Text fontWeight="medium">${tenant.monthlyRent || '0'}</Text>
            </Box>
            <Box>
              <Text color="gray.600">Security Deposit:</Text>
              <Text fontWeight="medium">${tenant.securityDeposit || '0'}</Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Contact Info */}
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="1fr 1fr" gap={6}>
            {/* Tenant Info */}
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Icon as={Mail} />
                <Text>{tenant.email}</Text>
              </HStack>
              <HStack>
                <Icon as={Phone} />
                <Text>{tenant.phone}</Text>
              </HStack>
              <HStack>
                <Icon as={MapPin} />
                <Text>{property.name} - Unit {tenant.unitNumber}</Text>
              </HStack>
              <HStack>
                <Icon as={Calendar} />
                <Text>
                  {new Date(tenant.moveInDate).toLocaleDateString()} - {new Date(tenant.moveOutDate).toLocaleDateString()}
                </Text>
              </HStack>
            </VStack>

            {/* LLC Info */}
            {property.isLLC && (
              <Box borderLeft="1px" borderColor="gray.200" pl={6}>
                <VStack align="stretch" spacing={4}>
                  <Heading size="sm" color="purple.600">LLC Information</Heading>
                  <HStack>
                    <Icon as={User} />
                    <Text>{property.llcInfo?.llcName || 'N/A'}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={Mail} />
                    <Text>{property.llcInfo?.email || 'N/A'}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={Phone} />
                    <Text>{property.llcInfo?.phone || 'N/A'}</Text>
                  </HStack>
                </VStack>
              </Box>
            )}
          </Grid>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>Payment History</Tab>
          <Tab>Documents ({documents?.length || 0})</Tab>
          <Tab>Notes ({notes?.length || 0})</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card variant="outline">
              <CardBody>
                {transactions
                  ?.filter(t => t.tenantId === tenant.id && t.type === 'INCOME')
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <Box
                      key={transaction.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      mb={4}
                    >
                      <HStack justify="space-between" mb={2}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">
                            {transaction.paymentType === 'RENT' ? 'Rent Payment' :
                             transaction.paymentType === 'DEPOSIT' ? 'Security Deposit' :
                             'Other Payment'}
                          </Text>
                          <Text color="gray.600" fontSize="sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </Text>
                        </VStack>
                        <Text
                          fontWeight="bold"
                          color="green.500"
                        >
                          ${transaction.amount.toLocaleString()}
                        </Text>
                      </HStack>
                      {transaction.description && (
                        <Text color="gray.600" fontSize="sm">
                          {transaction.description}
                        </Text>
                      )}
                    </Box>
                  ))}
                {(!transactions || transactions.filter(t => t.tenantId === tenant.id && t.type === 'INCOME').length === 0) && (
                  <Text color="gray.500" textAlign="center">
                    No payment history available
                  </Text>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="medium">Documents</Text>
                <DocumentUploadButton
                  tenantId={tenant.id}
                  onUpload={addDocument}
                />
              </HStack>
              {isLoadingDocs ? (
                <Spinner />
              ) : (
                <DocumentList
                  documents={documents || []}
                  onDelete={deleteDocument}
                />
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="medium">Notes</Text>
                <Button
                  leftIcon={<Plus />}
                  size="sm"
                  onClick={() => setIsAddNoteOpen(true)}
                >
                  Add Note
                </Button>
              </HStack>
              {isLoadingNotes ? (
                <Spinner />
              ) : (
                <NoteList
                  notes={notes || []}
                  onEdit={note => setEditingNote(note)}
                  onDelete={deleteNote}
                />
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const ThreeDayNoticeModal = ({
  isOpen,
  onClose,
  tenant,
  property,
}: {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  property?: { id: string; name: string };
}) => {
  const { companySettings } = useCompanySettings();
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 3);

  const emailSubject = `Three Day Notice to Pay Rent or Quit - ${property?.name} Unit ${tenant.unitNumber}`;
  const emailBody = `
THREE-DAY NOTICE TO PAY RENT OR QUIT
(California Civil Code Section 1161(2))

Date of Service: ${today.toLocaleDateString()}

TO ALL TENANTS AND ALL OTHERS IN POSSESSION OF:

${tenant.name}
${property?.name}
Unit ${tenant.unitNumber}
${tenant.address}
${tenant.city}, ${tenant.state} ${tenant.zipCode}

PLEASE TAKE NOTICE that you are justly indebted to the landlord/management of the above-described premises for rent due as follows:

Current Monthly Rent Due: $${tenant.monthlyRent?.toLocaleString()}
Late Fees (if applicable): $${(tenant.monthlyRent * 0.06).toFixed(2)} (6% of monthly rent)
Total Amount Due: $${(tenant.monthlyRent * 1.06).toFixed(2)}

For the rental period: ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}

WITHIN THREE (3) DAYS from the date of service of this notice upon you, excluding Saturdays, Sundays, and other judicial holidays, you are hereby required to either:

1. PAY THE TOTAL AMOUNT DUE of $${(tenant.monthlyRent * 1.06).toFixed(2)} in full
   OR
2. VACATE AND DELIVER possession of the premises to the landlord/management.

PAYMENT METHODS ACCEPTED:
${companySettings?.paymentMethods?.online ? `• ONLINE PAYMENT:
  ${companySettings.paymentMethods.online}\n` : ''}${
  companySettings?.paymentMethods?.check ? 
  `• CHECK/MONEY ORDER:
  Make payable to: ${companySettings.paymentMethods.check.payableTo}
  Mail or deliver to: ${companySettings.paymentMethods.check.address}\n` : ''}${
  companySettings?.paymentMethods?.directDeposit ? 
  `• DIRECT DEPOSIT:
  Bank Name: ${companySettings.paymentMethods.directDeposit.bankName}
  Account Details: ${companySettings.paymentMethods.directDeposit.accountInfo}\n` : ''}

PLEASE TAKE FURTHER NOTICE that if you fail to perform or otherwise comply with the requirements of this notice within the specified period, the landlord/management elects to declare a forfeiture of your rental agreement/lease and will institute legal proceedings against you to:
1. Recover possession of the premises
2. Recover all rent and other monetary amounts due and owing
3. Recover attorney's fees (if provided for in the rental agreement)
4. Recover costs of suit

This notice is intended to be legally binding in accordance with California Civil Code Section 1161(2) and California Code of Civil Procedure Section 1161.

This is intended as a three (3) day notice to pay rent or quit. This notice supersedes all other notices to pay rent or quit previously served.

CERTIFICATE OF SERVICE
I, the undersigned, being at least 18 years of age, declare under penalty of perjury that I served the above notice, of which this is a true copy, on the above-mentioned tenant(s) in possession in the manner(s) indicated below:

□ By personally delivering a copy to the tenant(s)
□ By leaving a copy with a person of suitable age and discretion at the premises
□ By posting a copy in a conspicuous place on the premises
□ By sending a copy through certified mail

Date: ${today.toLocaleDateString()}

Sincerely,

${companySettings?.companyName || 'Property Management'}
Contact Information:
Email: ${companySettings?.email || '[Company Email]'}
Phone: ${companySettings?.phone || '[Company Phone]'}
Address: ${companySettings?.paymentMethods?.check?.address || '[Company Address]'}

NOTICE TO TENANT: If you are in need of an explanation of this notice in another language, please notify the landlord/management immediately.
`;

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${tenant.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Three Day Notice</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box p={4} borderWidth={1} borderRadius="md">
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Text fontWeight="bold">To:</Text>
                  <Text>{tenant.name} ({tenant.email})</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Subject:</Text>
                  <Text>{emailSubject}</Text>
                </HStack>
              </VStack>
            </Box>
            <Box p={4} borderWidth={1} borderRadius="md">
              <Text whiteSpace="pre-wrap" fontSize="sm" fontFamily="monospace">
                {emailBody}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSendEmail}
            isLoading={false}
            loadingText="Sending..."
            leftIcon={<Mail />}
          >
            Send Notice
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const EditTenantModal = ({ 
  isOpen, 
  onClose, 
  tenant,
  onUpdateTenant 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  tenant: Tenant;
  onUpdateTenant: (id: string, updates: Partial<Tenant>) => Promise<void>;
}) => {
  const { properties } = useProperties();
  const [leaseDuration, setLeaseDuration] = useState(12); // Default to 12 months
  const [formData, setFormData] = useState({
    ...tenant,
  });

  const calculateEndDate = (startDate: string, leaseType: string, duration: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    
    if (leaseType === 'Yearly') {
      end.setFullYear(end.getFullYear() + 1); // Add one year
    } else if (leaseType === 'Month-to-Month') {
      end.setMonth(end.getMonth() + duration); // Add specified number of months
    }
    
    // Format date as YYYY-MM-DD for input type="date"
    return end.toISOString().split('T')[0];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'moveInDate' || name === 'leaseType') {
      const newEndDate = calculateEndDate(
        name === 'moveInDate' ? value : formData.moveInDate,
        name === 'leaseType' ? value : formData.leaseType,
        leaseDuration
      );
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        moveOutDate: newEndDate
      }));
    } else if (name === 'leaseDuration') {
      const duration = parseInt(value);
      setLeaseDuration(duration);
      const newEndDate = calculateEndDate(formData.moveInDate, formData.leaseType, duration);
      setFormData(prev => ({
        ...prev,
        moveOutDate: newEndDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || 
          !formData.propertyId || !formData.unitNumber || 
          !formData.moveInDate || !formData.moveOutDate) {
        throw new Error('Please fill in all required fields');
      }

      // Validate dates
      const moveIn = new Date(formData.moveInDate);
      const moveOut = new Date(formData.moveOutDate);
      if (moveOut <= moveIn) {
        throw new Error('Move out date must be after move in date');
      }

      await onUpdateTenant(tenant.id, formData);
      onClose();
    } catch (err) {
      console.error('Error updating tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to update tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Tenant</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {error && (
              <Box w="100%" p={3} bg="red.100" color="red.700" borderRadius="md">
                {error}
              </Box>
            )}
            
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter tenant name"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Property</FormLabel>
              <Select
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              >
                {properties?.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Unit Number</FormLabel>
              <Input
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                placeholder="Enter unit number"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Lease Type</FormLabel>
              <Select
                name="leaseType"
                value={formData.leaseType}
                onChange={handleInputChange}
              >
                <option value="Yearly">Yearly</option>
                <option value="Month-to-Month">Month-to-Month</option>
              </Select>
            </FormControl>

            {formData.leaseType === 'Month-to-Month' && (
              <FormControl>
                <FormLabel>Lease Duration (months)</FormLabel>
                <Input
                  name="leaseDuration"
                  type="number"
                  min="1"
                  value={leaseDuration}
                  onChange={handleInputChange}
                />
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel>Move In Date</FormLabel>
              <Input
                name="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Move Out Date</FormLabel>
              <Input
                name="moveOutDate"
                type="date"
                value={formData.moveOutDate}
                readOnly
              />
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="blue" 
              width="full"
              isLoading={isSubmitting}
              loadingText="Updating Tenant"
              onClick={handleSubmit}
            >
              Update Tenant
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const NewTenantModal = ({ isOpen, onClose, onAddTenant }: { isOpen: boolean; onClose: () => void; onAddTenant: (newTenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Tenant> }) => {
  const { properties } = useProperties();
  const [leaseDuration, setLeaseDuration] = useState(12); // Default to 12 months
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    unitNumber: '',
    leaseType: 'Yearly',
    monthlyRent: '',
    deposit: '',
    moveInDate: '',
    moveOutDate: '',
    status: 'Active',
  });

  const calculateEndDate = (startDate: string, leaseType: string, duration: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    
    if (leaseType === 'Yearly') {
      end.setFullYear(end.getFullYear() + 1); // Add one year
    } else if (leaseType === 'Month-to-Month') {
      end.setMonth(end.getMonth() + duration); // Add specified number of months
    }
    
    // Format date as YYYY-MM-DD for input type="date"
    return end.toISOString().split('T')[0];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'moveInDate' || name === 'leaseType') {
      const newEndDate = calculateEndDate(
        name === 'moveInDate' ? value : formData.moveInDate,
        name === 'leaseType' ? value : formData.leaseType,
        leaseDuration
      );
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        moveOutDate: newEndDate
      }));
    } else if (name === 'leaseDuration') {
      const duration = parseInt(value);
      setLeaseDuration(duration);
      const newEndDate = calculateEndDate(formData.moveInDate, formData.leaseType, duration);
      setFormData(prev => ({
        ...prev,
        moveOutDate: newEndDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || 
          !formData.propertyId || !formData.unitNumber || 
          !formData.moveInDate || !formData.moveOutDate ||
          !formData.monthlyRent || !formData.deposit) {
        throw new Error('Please fill in all required fields');
      }

      // Validate dates
      const moveIn = new Date(formData.moveInDate);
      const moveOut = new Date(formData.moveOutDate);
      if (moveOut <= moveIn) {
        throw new Error('Move out date must be after move in date');
      }

      // Validate rent and deposit
      const rent = parseFloat(formData.monthlyRent);
      const deposit = parseFloat(formData.deposit);
      if (isNaN(rent) || rent <= 0) {
        throw new Error('Monthly rent must be a positive number');
      }
      if (isNaN(deposit) || deposit <= 0) {
        throw new Error('Deposit must be a positive number');
      }

      const tenant = await onAddTenant({
        ...formData,
        monthlyRent: rent,
        deposit: deposit,
      });
      onClose();
    } catch (err) {
      console.error('Error adding tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to add tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Tenant</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              {error && (
                <Box w="100%" p={3} bg="red.100" color="red.700" borderRadius="md">
                  {error}
                </Box>
              )}
              
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter tenant name"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Property</FormLabel>
                <Select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  placeholder="Select property"
                >
                  {properties?.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Unit Number</FormLabel>
                <Input
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  placeholder="Enter unit number"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Lease Type</FormLabel>
                <Select
                  name="leaseType"
                  value={formData.leaseType}
                  onChange={handleInputChange}
                >
                  <option value="Yearly">Yearly</option>
                  <option value="Month-to-Month">Month-to-Month</option>
                </Select>
              </FormControl>

              {formData.leaseType === 'Month-to-Month' && (
                <FormControl>
                  <FormLabel>Lease Duration (months)</FormLabel>
                  <Input
                    name="leaseDuration"
                    type="number"
                    min="1"
                    value={leaseDuration}
                    onChange={handleInputChange}
                  />
                </FormControl>
              )}

              <FormControl isRequired>
                <FormLabel>Monthly Rent</FormLabel>
                <Input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                  placeholder="Enter monthly rent amount"
                  min="0"
                  step="0.01"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Security Deposit</FormLabel>
                <Input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  placeholder="Enter security deposit amount"
                  min="0"
                  step="0.01"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Move In Date</FormLabel>
                <Input
                  name="moveInDate"
                  type="date"
                  value={formData.moveInDate}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Move Out Date</FormLabel>
                <Input
                  name="moveOutDate"
                  type="date"
                  value={formData.moveOutDate}
                  readOnly
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Adding Tenant"
            >
              Add Tenant
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const Tenants = () => {
  const { tenants, isLoading, error, addTenant, updateTenant, deleteTenant } = useTenants();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'Active' | 'Inactive'>('Active');

  const handleAddTenant = async (newTenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const tenant = await addTenant(newTenant);
    setRefreshKey(prev => prev + 1);
    return tenant;
  };

  const handleEditTenant = (tenant: Tenant) => {
    setTenantToEdit(tenant);
    onEditOpen();
  };

  const handleUpdateTenant = async (id: string, updates: Partial<Tenant>) => {
    await updateTenant(id, updates);
    setRefreshKey(prev => prev + 1);
    if (selectedTenant?.id === id) {
      const updatedTenant = { ...selectedTenant, ...updates };
      setSelectedTenant(updatedTenant);
    }
  };

  const handleDeleteTenant = async (id: string) => {
    await deleteTenant(id);
    setRefreshKey(prev => prev + 1);
    if (selectedTenant?.id === id) {
      setSelectedTenant(null);
    }
  };

  const filteredTenants = tenants?.filter(tenant => tenant.status === activeTab) || [];

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={6}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading tenants...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={6}>
        <Box p={4} bg="red.100" color="red.700" borderRadius="md">
          <Text>Error loading tenants: {error.message}</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Tenants</Heading>
          <Text color="gray.600">Manage your property tenants</Text>
        </Box>
        <Button leftIcon={<Plus />} colorScheme="blue" onClick={onAddOpen}>
          Add New Tenant
        </Button>
      </HStack>

      <Grid templateColumns={{ base: "1fr", lg: "350px 1fr" }} gap={6}>
        {/* Left Column - Tenant List */}
        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Card>
              <CardBody>
                <Tabs
                  isFitted
                  variant="soft-rounded"
                  colorScheme="blue"
                  onChange={(index) => setActiveTab(index === 0 ? 'Active' : 'Inactive')}
                >
                  <TabList mb={4}>
                    <Tab>Active</Tab>
                    <Tab>Inactive</Tab>
                  </TabList>
                </Tabs>

                <VStack align="stretch" spacing={3}>
                  {filteredTenants.length === 0 ? (
                    <Box textAlign="center" py={4} color="gray.500">
                      No {activeTab.toLowerCase()} tenants found
                    </Box>
                  ) : (
                    filteredTenants.map((tenant) => (
                      <TenantCard
                        key={tenant.id}
                        tenant={tenant}
                        isSelected={selectedTenant?.id === tenant.id}
                        onSelect={setSelectedTenant}
                      />
                    ))
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        {/* Right Column - Tenant Details */}
        <GridItem display={{ base: selectedTenant ? 'block' : 'none', lg: 'block' }}>
          {selectedTenant ? (
            <TenantDetails 
              tenant={selectedTenant} 
              onEdit={handleEditTenant}
              onDelete={handleDeleteTenant}
            />
          ) : (
            <Card h="full">
              <CardBody>
                <VStack justify="center" align="center" h="full" spacing={4}>
                  <Icon as={User} boxSize={12} color="gray.400" />
                  <Text color="gray.500">Select a tenant to view details</Text>
                </VStack>
              </CardBody>
            </Card>
          )}
        </GridItem>
      </Grid>

      <NewTenantModal 
        isOpen={isAddOpen} 
        onClose={onAddClose}
        onAddTenant={handleAddTenant}
      />

      {tenantToEdit && (
        <EditTenantModal
          isOpen={isEditOpen}
          onClose={() => {
            onEditClose();
            setTenantToEdit(null);
          }}
          tenant={tenantToEdit}
          onUpdateTenant={handleUpdateTenant}
        />
      )}
    </Container>
  );
};

export default Tenants;
