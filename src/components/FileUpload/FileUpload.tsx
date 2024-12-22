import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Icon,
  Image,
  Text,
  VStack,
  HStack,
  Progress,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  folder: 'properties' | 'tenants' | 'transactions' | 'profile-pictures';
  id: string;
  onUploadComplete?: (result: { url: string; path: string }) => void;
  accept?: string;
  maxFiles?: number;
}

interface UploadedFile {
  url: string;
  path: string;
  name: string;
  type: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  folder,
  id,
  onUploadComplete,
  accept = 'image/*,.pdf,.doc,.docx',
  maxFiles = 5,
}) => {
  const { uploadFile, uploading } = useFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dragBorderColor = useColorModeValue('blue.500', 'blue.300');

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadFile(file, folder, id);
      
      if (result) {
        const newFile: UploadedFile = {
          ...result,
          name: file.name,
          type: file.type,
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        onUploadComplete?.(result);
      }
    }
  }, [uploadFile, folder, id, maxFiles, onUploadComplete, uploadedFiles.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderPreview = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) {
      return (
        <Image
          src={file.url}
          alt={file.name}
          objectFit="cover"
          boxSize="100px"
          borderRadius="md"
        />
      );
    }
    return (
      <Icon
        as={File}
        boxSize="50px"
        color={file.type.includes('pdf') ? 'red.500' : 'blue.500'}
      />
    );
  };

  return (
    <VStack spacing={4} width="100%">
      <Box
        width="100%"
        borderWidth={2}
        borderStyle="dashed"
        borderColor={dragOver ? dragBorderColor : borderColor}
        borderRadius="md"
        bg={bgColor}
        p={6}
        textAlign="center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <VStack spacing={2}>
          <Icon as={Upload} boxSize={8} color="gray.400" />
          <Text>
            Drag and drop files here or{' '}
            <Button
              as="label"
              size="sm"
              colorScheme="blue"
              cursor="pointer"
              htmlFor="file-upload"
            >
              Browse
              <input
                id="file-upload"
                type="file"
                multiple
                accept={accept}
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                style={{ display: 'none' }}
              />
            </Button>
          </Text>
          <Text fontSize="sm" color="gray.500">
            Supported formats: Images, PDF, Word documents
          </Text>
          <Text fontSize="sm" color="gray.500">
            Maximum {maxFiles} files, up to 10MB each
          </Text>
        </VStack>
      </Box>

      {uploading && <Progress width="100%" size="sm" isIndeterminate />}

      {uploadedFiles.length > 0 && (
        <Box width="100%">
          <Text mb={2} fontWeight="medium">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </Text>
          <VStack spacing={2} align="stretch">
            {uploadedFiles.map((file, index) => (
              <HStack
                key={index}
                p={2}
                borderWidth={1}
                borderRadius="md"
                borderColor={borderColor}
              >
                {renderPreview(file)}
                <VStack align="start" flex={1} spacing={0}>
                  <Text fontWeight="medium" noOfLines={1}>
                    {file.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {file.type.split('/')[1].toUpperCase()}
                  </Text>
                </VStack>
                <IconButton
                  icon={<Icon as={X} />}
                  aria-label="Remove file"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                />
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
