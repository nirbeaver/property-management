import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Building2, Key, Mail, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const from = location.state?.from?.pathname || '/';
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    if (isSignUp) {
      if (!name) {
        setError('Name is required');
        return false;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        // Sign up
        await signUpWithEmail(email, password, name);
        await sendVerificationEmail();
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email to verify your account before signing in.',
          status: 'success',
          duration: 5000,
        });
        setIsSignUp(false);
      } else {
        // Sign in
        const user = await signInWithEmail(email, password);
        if (!user.emailVerified) {
          await sendVerificationEmail();
          toast({
            title: 'Email Not Verified',
            description: 'Please verify your email. A new verification link has been sent.',
            status: 'warning',
            duration: 5000,
          });
          return;
        }
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast({
        title: 'Error',
        description: err.message || 'An error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Google',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="6xl">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={10}
          align="center"
          justify="space-between"
        >
          {/* Left side - Description */}
          <VStack flex={1} align="flex-start" spacing={6}>
            <HStack>
              <Icon as={Building2} boxSize={10} color="blue.500" />
              <Heading size="2xl" color="blue.500">
                LX3HOME
              </Heading>
            </HStack>
            
            <Heading size="lg" lineHeight="tall">
              Streamline Your Property Management with Intelligent Solutions
            </Heading>
            
            <Text fontSize="lg" color={textColor} maxW="xl">
              LX3HOME is your all-in-one property management solution. Manage properties,
              track finances, handle maintenance requests, and communicate with tenants - all
              in one powerful platform. Built for property managers who demand efficiency
              and excellence.
            </Text>

            <Stack spacing={4} direction={{ base: 'column', sm: 'row' }} pt={4}>
              <HStack spacing={6}>
                <VStack align="flex-start">
                  <Text fontWeight="bold" fontSize="2xl">500+</Text>
                  <Text color={textColor}>Properties Managed</Text>
                </VStack>
                <VStack align="flex-start">
                  <Text fontWeight="bold" fontSize="2xl">98%</Text>
                  <Text color={textColor}>Client Satisfaction</Text>
                </VStack>
                <VStack align="flex-start">
                  <Text fontWeight="bold" fontSize="2xl">24/7</Text>
                  <Text color={textColor}>Support Available</Text>
                </VStack>
              </HStack>
            </Stack>
          </VStack>

          {/* Right side - Auth Form */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="xl"
            shadow="xl"
            minW={{ base: 'full', lg: '400px' }}
          >
            <CardBody>
              <VStack spacing={6}>
                <Heading size="lg">{isSignUp ? 'Create Account' : 'Welcome Back'}</Heading>
                <Text color={textColor}>
                  {isSignUp 
                    ? 'Sign up to start managing your properties'
                    : 'Sign in to continue to your dashboard'}
                </Text>

                {/* Google Sign In Button */}
                <Button
                  w="full"
                  size="lg"
                  variant="outline"
                  leftIcon={<Icon as={FcGoogle} boxSize={5} />}
                  onClick={handleGoogleSignIn}
                  isDisabled={loading}
                >
                  {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                </Button>

                <HStack w="full">
                  <Divider />
                  <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
                    or {isSignUp ? 'sign up' : 'sign in'} with email
                  </Text>
                  <Divider />
                </HStack>

                <VStack as="form" onSubmit={handleEmailAuth} spacing={6} width="full">
                  {error && (
                    <Text color="red.500" fontSize="sm">
                      {error}
                    </Text>
                  )}

                  {isSignUp && (
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        size="lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        leftElement={
                          <Icon as={User} ml={3} boxSize={5} color="gray.500" />
                        }
                      />
                    </FormControl>
                  )}

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      size="lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      leftElement={
                        <Icon as={Mail} ml={3} boxSize={5} color="gray.500" />
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      size="lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      leftElement={
                        <Icon as={Key} ml={3} boxSize={5} color="gray.500" />
                      }
                    />
                  </FormControl>

                  {isSignUp && (
                    <FormControl isRequired>
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        size="lg"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        leftElement={
                          <Icon as={Key} ml={3} boxSize={5} color="gray.500" />
                        }
                      />
                    </FormControl>
                  )}

                  <Button
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    type="submit"
                    isLoading={loading}
                    loadingText={isSignUp ? 'Creating Account' : 'Signing In'}
                  >
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Button>
                </VStack>

                <HStack spacing={1} fontSize="sm">
                  <Text color={textColor}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </Text>
                  <Button
                    variant="link"
                    colorScheme="blue"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                    }}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Button>
                </HStack>

                <Text fontSize="xs" color={textColor} textAlign="center">
                  By continuing, you agree to our{' '}
                  <Button variant="link" colorScheme="blue" fontSize="xs">
                    Terms of Service
                  </Button>{' '}
                  and{' '}
                  <Button variant="link" colorScheme="blue" fontSize="xs">
                    Privacy Policy
                  </Button>
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Flex>
      </Container>
    </Box>
  );
};

export default AuthPage;
