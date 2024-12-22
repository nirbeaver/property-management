import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Divider,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignInProps {
  onSignUp: () => void;
  onForgotPassword: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignUp, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Get the redirect path from location state, or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/';

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmail(email, password);
      toast({
        title: 'Welcome back!',
        status: 'success',
        duration: 3000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: 'Error signing in',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast({
        title: 'Welcome!',
        status: 'success',
        duration: 3000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: 'Error signing in with Google',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={8}
      maxWidth="400px"
      borderWidth={1}
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Sign In
        </Text>

        <form onSubmit={handleEmailSignIn}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={loading}
            >
              Sign In
            </Button>
          </VStack>
        </form>

        <Button
          variant="link"
          colorScheme="blue"
          size="sm"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </Button>

        <HStack spacing={2}>
          <Divider />
          <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
            or continue with
          </Text>
          <Divider />
        </HStack>

        <Button
          variant="outline"
          width="100%"
          onClick={handleGoogleSignIn}
          leftIcon={<Icon as={Chrome} boxSize={5} color="blue.500" />}
          isLoading={loading}
        >
          Sign in with Google
        </Button>

        <HStack justify="center" spacing={1}>
          <Text fontSize="sm">Don't have an account?</Text>
          <Button
            variant="link"
            colorScheme="blue"
            size="sm"
            onClick={onSignUp}
          >
            Sign Up
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
