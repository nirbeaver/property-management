import React from 'react';
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
  Image,
} from '@chakra-ui/react';
import { Building2, Key, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
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
                PropMaster
              </Heading>
            </HStack>
            
            <Heading size="lg" lineHeight="tall">
              Streamline Your Property Management with Intelligent Solutions
            </Heading>
            
            <Text fontSize="lg" color={textColor} maxW="xl">
              PropMaster is your all-in-one property management solution. Manage properties,
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

          {/* Right side - Sign In Form */}
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="xl"
            shadow="xl"
            minW={{ base: 'full', lg: '400px' }}
          >
            <CardBody>
              <VStack spacing={6} as="form" onSubmit={handleSignIn}>
                <Heading size="lg">Welcome Back</Heading>
                <Text color={textColor}>Sign in to continue to your dashboard</Text>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    size="lg"
                    leftElement={
                      <Icon as={Mail} ml={3} boxSize={5} color="gray.500" />
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    size="lg"
                    leftElement={
                      <Icon as={Key} ml={3} boxSize={5} color="gray.500" />
                    }
                  />
                </FormControl>

                <Button
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  type="submit"
                  mt={4}
                >
                  Sign In
                </Button>

                <Text fontSize="sm" color={textColor}>
                  Don't have an account?{' '}
                  <Button variant="link" colorScheme="blue">
                    Contact us
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
