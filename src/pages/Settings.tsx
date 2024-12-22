import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  VStack,
  Text,
  Heading,
  useToast,
  Switch,
  HStack,
  Icon,
  Divider,
  Grid,
  GridItem,
  useColorMode,
  Badge,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Bell,
  Moon,
  Sun,
  DollarSign,
  Calendar,
  Mail,
  Shield,
  Clock,
  AlertTriangle,
  Globe,
} from 'lucide-react';

interface ExpenseCategory {
  name: string;
  average: number;
  threshold: number;
}

interface SettingsState {
  general: {
    theme: 'light' | 'dark';
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    expenseAlerts: boolean;
    expenseCategories: ExpenseCategory[];
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
  };
}

const Settings = () => {
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock expense data - replace with actual data from your backend
  const mockExpenseCategories = [
    { name: 'Maintenance', average: 1200, threshold: 20 },
    { name: 'Utilities', average: 800, threshold: 20 },
    { name: 'Insurance', average: 500, threshold: 20 },
    { name: 'Property Tax', average: 2000, threshold: 20 },
    { name: 'Management Fees', average: 300, threshold: 20 },
  ];

  const [settings, setSettings] = useState<SettingsState>(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      general: {
        theme: 'light',
        language: navigator.language.split('-')[0], // Automatically detect browser language
      },
      notifications: {
        email: true,
        push: true,
        expenseAlerts: true,
        expenseCategories: mockExpenseCategories,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        loginNotifications: true,
      },
    };
  });

  // Sync theme with ColorMode
  useEffect(() => {
    if (settings.general.theme !== colorMode) {
      toggleColorMode();
    }
  }, [settings.general.theme]);

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
      status: 'success',
      duration: 3000,
    });
  };

  const handleThemeChange = () => {
    const newTheme = settings.general.theme === 'light' ? 'dark' : 'light';
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, theme: newTheme }
    }));
    toggleColorMode();
  };

  const handleThresholdChange = (categoryName: string, newThreshold: number) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        expenseCategories: prev.notifications.expenseCategories.map(cat =>
          cat.name === categoryName ? { ...cat, threshold: newThreshold } : cat
        )
      }
    }));
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">Settings</Heading>
            <Text color="gray.500" mt={1}>Manage your application preferences</Text>
          </Box>
          <Button colorScheme="blue" onClick={handleSave}>
            Save Changes
          </Button>
        </HStack>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
          {/* General Settings */}
          <GridItem>
            <Box bg={bg} p={6} rounded="lg" shadow="sm" borderWidth={1} borderColor={borderColor}>
              <VStack spacing={6} align="stretch">
                <Heading size="md">General Settings</Heading>

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <HStack mb={1}>
                      <Icon as={colorMode === 'dark' ? Moon : Sun} />
                      <FormLabel mb={0}>Theme</FormLabel>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">Toggle between light and dark mode</Text>
                  </Box>
                  <Switch
                    isChecked={settings.general.theme === 'dark'}
                    onChange={handleThemeChange}
                    colorScheme="blue"
                  />
                </FormControl>

                <FormControl>
                  <Box>
                    <HStack mb={1}>
                      <Icon as={Globe} />
                      <FormLabel mb={0}>Language</FormLabel>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      Automatically detected: {new Intl.DisplayNames([settings.general.language], { type: 'language' }).of(settings.general.language)}
                    </Text>
                  </Box>
                </FormControl>
              </VStack>
            </Box>
          </GridItem>

          {/* Notifications */}
          <GridItem>
            <Box bg={bg} p={6} rounded="lg" shadow="sm" borderWidth={1} borderColor={borderColor}>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Notifications</Heading>

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <HStack mb={1}>
                      <Icon as={Mail} />
                      <FormLabel mb={0}>Email Notifications</FormLabel>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">Receive updates via email</Text>
                  </Box>
                  <Switch
                    isChecked={settings.notifications.email}
                    onChange={() => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: !prev.notifications.email }
                    }))}
                    colorScheme="blue"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <HStack mb={1}>
                      <Icon as={Bell} />
                      <FormLabel mb={0}>Push Notifications</FormLabel>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">Receive push notifications</Text>
                  </Box>
                  <Switch
                    isChecked={settings.notifications.push}
                    onChange={() => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: !prev.notifications.push }
                    }))}
                    colorScheme="blue"
                  />
                </FormControl>

                <Divider />

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <HStack mb={1}>
                      <Icon as={AlertTriangle} />
                      <FormLabel mb={0}>Expense Alerts</FormLabel>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">Get notified when expenses exceed thresholds</Text>
                  </Box>
                  <Switch
                    isChecked={settings.notifications.expenseAlerts}
                    onChange={() => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        expenseAlerts: !prev.notifications.expenseAlerts
                      }
                    }))}
                    colorScheme="blue"
                  />
                </FormControl>

                {settings.notifications.expenseAlerts && (
                  <VStack spacing={4} align="stretch">
                    {settings.notifications.expenseCategories.map((category) => (
                      <Box key={category.name} p={4} borderWidth={1} rounded="md" borderColor={borderColor}>
                        <FormControl>
                          <FormLabel>
                            {category.name}
                            <Text fontSize="sm" color="gray.500">
                              12-month average: ${category.average.toLocaleString()}
                            </Text>
                          </FormLabel>
                          <HStack spacing={4}>
                            <Slider
                              value={category.threshold}
                              onChange={(val) => handleThresholdChange(category.name, val)}
                              min={10}
                              max={100}
                              step={5}
                              flex={1}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                            <NumberInput
                              maxW={20}
                              value={category.threshold}
                              onChange={(_, val) => handleThresholdChange(category.name, val)}
                              min={10}
                              max={100}
                              step={5}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                            <Text>%</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            Alert when exceeds ${(category.average * (1 + category.threshold / 100)).toLocaleString()}
                          </Text>
                        </FormControl>
                      </Box>
                    ))}
                  </VStack>
                )}
              </VStack>
            </Box>
          </GridItem>

          {/* Security */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Box bg={bg} p={6} rounded="lg" shadow="sm" borderWidth={1} borderColor={borderColor}>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Security</Heading>

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <HStack mb={1}>
                      <Icon as={Shield} />
                      <FormLabel mb={0}>Two-Factor Authentication</FormLabel>
                      <Badge colorScheme="green">Recommended</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">Add an extra layer of security to your account</Text>
                  </Box>
                  <Switch
                    isChecked={settings.security.twoFactorAuth}
                    onChange={() => setSettings(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        twoFactorAuth: !prev.security.twoFactorAuth
                      }
                    }))}
                    colorScheme="blue"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <HStack mb={1}>
                      <Icon as={Bell} />
                      <FormLabel mb={0}>Login Notifications</FormLabel>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">Get notified of new login attempts</Text>
                  </Box>
                  <Switch
                    isChecked={settings.security.loginNotifications}
                    onChange={() => setSettings(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        loginNotifications: !prev.security.loginNotifications
                      }
                    }))}
                    colorScheme="blue"
                  />
                </FormControl>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default Settings;
