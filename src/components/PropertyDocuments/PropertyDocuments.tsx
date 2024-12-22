import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FileUpload } from '../FileUpload/FileUpload';

interface PropertyDocumentsProps {
  propertyId: string;
  onUpload?: (files: { url: string; path: string }[]) => void;
}

export const PropertyDocuments: React.FC<PropertyDocumentsProps> = ({
  propertyId,
  onUpload,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleUploadComplete = (result: { url: string; path: string }) => {
    onUpload?.([result]);
  };

  return (
    <Box
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md">Property Documents</Heading>
        
        <Tabs>
          <TabList>
            <Tab>Leases</Tab>
            <Tab>Maintenance</Tab>
            <Tab>Insurance</Tab>
            <Tab>Other</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text color="gray.600">Upload lease agreements and related documents</Text>
                <FileUpload
                  folder="properties"
                  id={`${propertyId}/leases`}
                  onUploadComplete={handleUploadComplete}
                  accept=".pdf,.doc,.docx"
                  maxFiles={10}
                />
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text color="gray.600">Upload maintenance records and invoices</Text>
                <FileUpload
                  folder="properties"
                  id={`${propertyId}/maintenance`}
                  onUploadComplete={handleUploadComplete}
                  accept="image/*,.pdf,.doc,.docx"
                  maxFiles={10}
                />
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text color="gray.600">Upload insurance policies and claims</Text>
                <FileUpload
                  folder="properties"
                  id={`${propertyId}/insurance`}
                  onUploadComplete={handleUploadComplete}
                  accept=".pdf,.doc,.docx"
                  maxFiles={5}
                />
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text color="gray.600">Upload other property-related documents</Text>
                <FileUpload
                  folder="properties"
                  id={`${propertyId}/other`}
                  onUploadComplete={handleUploadComplete}
                  accept="image/*,.pdf,.doc,.docx"
                  maxFiles={10}
                />
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};
