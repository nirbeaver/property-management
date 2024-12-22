import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface UploadResult {
  url: string;
  path: string;
}

export const uploadFile = async (
  file: File,
  folder: 'properties' | 'tenants' | 'transactions' | 'profile-pictures' | 'assets',
  id: string
): Promise<UploadResult> => {
  try {
    // Create file path: folder/id/filename
    const fileName = `${Date.now()}-${file.name}`;
    const path = `${folder}/${id}/${fileName}`;
    const storageRef = ref(storage, path);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const url = await getDownloadURL(storageRef);

    return { url, path };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

export const uploadAsset = async (
  file: Buffer | File,
  fileName: string
): Promise<UploadResult> => {
  try {
    const path = `assets/${fileName}`;
    const storageRef = ref(storage, path);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const url = await getDownloadURL(storageRef);

    return { url, path };
  } catch (error) {
    console.error('Error uploading asset:', error);
    throw new Error('Failed to upload asset');
  }
};

export const getAssetUrl = async (fileName: string): Promise<string> => {
  try {
    const path = `assets/${fileName}`;
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting asset URL:', error);
    throw new Error('Failed to get asset URL');
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

// Helper function to get file type from mime type
export const getFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('word')) return 'document';
  return 'other';
};

// Helper function to validate file size (max 10MB)
export const isValidFileSize = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
};

// Helper function to validate file type
export const isValidFileType = (file: File): boolean => {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return validTypes.includes(file.type);
};
