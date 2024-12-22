import { useState } from 'react';
import { uploadFile, isValidFileSize, isValidFileType } from '../utils/storage';
import { useToast } from '@chakra-ui/react';

interface UseFileUploadResult {
  uploading: boolean;
  uploadFile: (
    file: File,
    folder: 'properties' | 'tenants' | 'transactions' | 'profile-pictures',
    id: string
  ) => Promise<{ url: string; path: string } | null>;
  error: string | null;
}

export const useFileUpload = (): UseFileUploadResult => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleUpload = async (
    file: File,
    folder: 'properties' | 'tenants' | 'transactions' | 'profile-pictures',
    id: string
  ) => {
    try {
      setUploading(true);
      setError(null);

      // Validate file
      if (!isValidFileSize(file)) {
        throw new Error('File size exceeds 10MB limit');
      }
      if (!isValidFileType(file)) {
        throw new Error('Invalid file type. Allowed types: images, PDF, Word documents');
      }

      // Upload file
      const result = await uploadFile(file, folder, id);

      toast({
        title: 'File uploaded successfully',
        status: 'success',
        duration: 3000,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
      
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadFile: handleUpload,
    error,
  };
};
