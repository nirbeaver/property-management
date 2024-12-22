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
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface ForgotPasswordProps {
  onSignIn: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for further instructions',
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Error',
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
          Reset Password
        </Text>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <form onSubmit={handleResetPassword}>
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

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={loading}
            >
              Send Reset Link
            </Button>
          </VStack>
        </form>

        <HStack justify="center" spacing={1}>
          <Text fontSize="sm">Remember your password?</Text>
          <Button
            variant="link"
            colorScheme="blue"
            size="sm"
            onClick={onSignIn}
          >
            Sign In
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
