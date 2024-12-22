import { useState, useEffect } from 'react';

interface CompanySettings {
  companyName: string;
  email: string;
  phone: string;
  paymentMethods: {
    online?: string;
    check?: {
      payableTo: string;
      address: string;
    };
    directDeposit?: {
      bankName: string;
      accountInfo: string;
    };
  };
}

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be loaded from your backend
    // For now, we'll load from localStorage
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('companySettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        // Default settings
        const defaultSettings: CompanySettings = {
          companyName: 'Property Management Company',
          email: 'contact@propertymanagement.com',
          phone: '(555) 123-4567',
          paymentMethods: {
            online: 'Visit our tenant portal at https://portal.propertymanagement.com',
            check: {
              payableTo: 'Property Management Company',
              address: '123 Main St, Suite 100, City, State 12345'
            },
            directDeposit: {
              bankName: 'Bank of America',
              accountInfo: 'Account details will be provided upon request'
            }
          }
        };
        localStorage.setItem('companySettings', JSON.stringify(defaultSettings));
        setSettings(defaultSettings);
      }
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  return { settings, isLoading };
};
