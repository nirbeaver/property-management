import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "property-management-bfe6d.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: 'HIDDEN',
  appId: 'HIDDEN',
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

async function signIn() {
  try {
    // You should replace these with your admin credentials
    const email = process.env.FIREBASE_ADMIN_EMAIL;
    const password = process.env.FIREBASE_ADMIN_PASSWORD;
    
    if (!email || !password) {
      throw new Error('Firebase admin credentials not found in environment variables');
    }
    
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Successfully signed in');
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

async function uploadAsset(file, fileName) {
  try {
    const path = `assets/${fileName}`;
    const storageRef = ref(storage, path);

    console.log(`Uploading ${fileName} to ${path}...`);
    
    // Upload file
    await uploadBytes(storageRef, file);
    console.log(`${fileName} uploaded successfully`);

    // Get download URL
    const url = await getDownloadURL(storageRef);
    console.log(`Got download URL for ${fileName}: ${url}`);

    return { url, path };
  } catch (error) {
    console.error('Error uploading asset:', error);
    if (error.code === 'storage/unauthorized') {
      console.error('Make sure you have the correct Firebase credentials and permissions');
    }
    throw error;
  }
}

async function uploadLogos() {
  try {
    console.log('Starting logo upload process...');
    
    // Sign in first
    await signIn();
    
    // Upload regular logo
    const logoPath = join(__dirname, '../public/logo.svg');
    console.log('Reading logo from:', logoPath);
    const logoContent = readFileSync(logoPath);
    const { url: logoUrl } = await uploadAsset(logoContent, 'logo.svg');
    
    // Upload social logo
    const socialLogoPath = join(__dirname, '../public/logo-social.svg');
    console.log('Reading social logo from:', socialLogoPath);
    const socialLogoContent = readFileSync(socialLogoPath);
    const { url: socialLogoUrl } = await uploadAsset(socialLogoContent, 'logo-social.svg');
    
    console.log('Logo URLs:', {
      logo: logoUrl,
      socialLogo: socialLogoUrl
    });
    
    // Update index.html with new URLs
    const indexPath = join(__dirname, '../index.html');
    console.log('Updating index.html at:', indexPath);
    let indexContent = readFileSync(indexPath, 'utf8');
    
    indexContent = indexContent.replace(
      /content="\/logo-social\.svg"/g,
      `content="${socialLogoUrl}"`
    );
    
    indexContent = indexContent.replace(
      /href="\/logo\.svg"/g,
      `href="${logoUrl}"`
    );
    
    writeFileSync(indexPath, indexContent);
    console.log('Updated index.html with new logo URLs');
    
  } catch (error) {
    console.error('Error uploading assets:', error);
    process.exit(1);
  }
}

uploadLogos();
