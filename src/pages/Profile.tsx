import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Heading,
  useToast,
  HStack,
  Avatar,
  Icon,
  Select,
  IconButton,
  Checkbox,
  Image,
} from '@chakra-ui/react';
import { User, Lock, Building2, Clock, X } from 'lucide-react';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  profilePicture: string;
  companyLogo: string;
  leaseNotifications: {
    days30: boolean;
    days60: boolean;
    days90: boolean;
  };
}

const Profile = () => {
  const toast = useToast();
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const companyLogoInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      role: 'Property Manager',
      profilePicture: '',
      companyLogo: '',
      leaseNotifications: {
        days30: true,
        days60: true,
        days90: true,
      },
    };
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
        localStorage.setItem('userProfile', JSON.stringify({
          ...profile,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfile(prev => ({
          ...prev,
          companyLogo: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your changes have been saved successfully.',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Profile</Heading>
          {isEditing ? (
            <HStack spacing={4}>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSave}>
                Save Changes
              </Button>
            </HStack>
          ) : (
            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </HStack>

        {/* Profile Picture */}
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack spacing={4} align="center">
            <Box position="relative">
              <Avatar
                size="2xl"
                src={profile.profilePicture || undefined}
                icon={<User size={40} />}
                cursor="pointer"
                onClick={() => profilePicInputRef.current?.click()}
              />
              <Input
                type="file"
                accept="image/*"
                ref={profilePicInputRef}
                display="none"
                onChange={handleProfilePictureChange}
              />
            </Box>
            <Text color="gray.600">Property Manager</Text>
          </VStack>
        </Box>

        {/* Personal Information */}
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack spacing={6} align="stretch">
            <Heading size="md">Personal Information</Heading>
            
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Enter your full name"
                isReadOnly={!isEditing}
                bg={!isEditing ? 'gray.50' : 'white'}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
                isReadOnly={!isEditing}
                bg={!isEditing ? 'gray.50' : 'white'}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone number"
                isReadOnly={!isEditing}
                bg={!isEditing ? 'gray.50' : 'white'}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Enter your address"
                isReadOnly={!isEditing}
                bg={!isEditing ? 'gray.50' : 'white'}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input
                value={profile.role}
                isReadOnly
                bg="gray.50"
              />
            </FormControl>
          </VStack>
        </Box>

        {/* Security Settings */}
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack spacing={6} align="stretch">
            <Heading size="md">Security Settings</Heading>

            <Box>
              <HStack spacing={4} mb={2}>
                <Icon as={Lock} />
                <Text fontWeight="medium">Password</Text>
              </HStack>
              <Text color="gray.600" fontSize="sm">
                Change your account password
              </Text>
            </Box>

            <Box>
              <HStack spacing={4} mb={2}>
                <Icon as={Lock} />
                <Text fontWeight="medium">Two-Factor Authentication</Text>
              </HStack>
              <Text color="gray.600" fontSize="sm">
                Add an extra layer of security to your account
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Company Branding */}
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack spacing={6} align="stretch">
            <Heading size="md">Company Branding</Heading>

            <FormControl>
              <FormLabel>Company Logo</FormLabel>
              <Box
                borderWidth={2}
                borderStyle="dashed"
                borderColor="gray.200"
                rounded="lg"
                p={6}
                textAlign="center"
                cursor={isEditing ? "pointer" : "not-allowed"}
                onClick={() => isEditing && companyLogoInputRef.current?.click()}
                opacity={isEditing ? 1 : 0.7}
                position="relative"
              >
                {profile.companyLogo ? (
                  <Box position="relative">
                    <Image
                      src={profile.companyLogo}
                      alt="Company Logo"
                      maxH="200px"
                      mx="auto"
                    />
                    {isEditing && (
                      <IconButton
                        aria-label="Remove logo"
                        icon={<X size={16} />}
                        size="sm"
                        colorScheme="red"
                        position="absolute"
                        top={2}
                        right={2}
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfile(prev => ({
                            ...prev,
                            companyLogo: ""
                          }));
                        }}
                      />
                    )}
                  </Box>
                ) : (
                  <VStack spacing={2}>
                    <Icon as={Building2} boxSize={8} color="gray.400" />
                    <Text color="gray.500">
                      {isEditing ? "Click to upload company logo" : "No logo uploaded"}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Recommended: 400x400px or larger, PNG or JPG
                    </Text>
                  </VStack>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  ref={companyLogoInputRef}
                  display="none"
                  onChange={handleCompanyLogoChange}
                  disabled={!isEditing}
                />
              </Box>
            </FormControl>
          </VStack>
        </Box>

        {/* Lease Expiration Notifications */}
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack spacing={6} align="stretch">
            <Heading size="md">Lease Expiration Notifications</Heading>

            <VStack spacing={4} align="stretch">
              <Checkbox
                isChecked={profile.leaseNotifications.days30}
                onChange={() => isEditing && setProfile(prev => ({
                  ...prev,
                  leaseNotifications: {
                    ...prev.leaseNotifications,
                    days30: !prev.leaseNotifications.days30
                  }
                }))}
                isDisabled={!isEditing}
              >
                30 days before expiration
              </Checkbox>

              <Checkbox
                isChecked={profile.leaseNotifications.days60}
                onChange={() => isEditing && setProfile(prev => ({
                  ...prev,
                  leaseNotifications: {
                    ...prev.leaseNotifications,
                    days60: !prev.leaseNotifications.days60
                  }
                }))}
                isDisabled={!isEditing}
              >
                60 days before expiration
              </Checkbox>

              <Checkbox
                isChecked={profile.leaseNotifications.days90}
                onChange={() => isEditing && setProfile(prev => ({
                  ...prev,
                  leaseNotifications: {
                    ...prev.leaseNotifications,
                    days90: !prev.leaseNotifications.days90
                  }
                }))}
                isDisabled={!isEditing}
              >
                90 days before expiration
              </Checkbox>

              <HStack spacing={4} mt={4}>
                <Input 
                  placeholder="Enter number of days" 
                  isReadOnly={!isEditing}
                  bg={!isEditing ? 'gray.50' : 'white'}
                />
                <Select 
                  placeholder="All Properties"
                  isDisabled={!isEditing}
                >
                  <option value="all">All Properties</option>
                  <option value="selected">Selected Properties</option>
                </Select>
                <IconButton
                  aria-label="Add custom period"
                  icon={<Icon as={Clock} />}
                  colorScheme="blue"
                  isDisabled={!isEditing}
                />
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Profile;
