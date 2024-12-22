import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  IconButton,
  Input,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import { MessageCircle, X, Send } from 'lucide-react';

export const CustomerSupport = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = () => {
    // Here you would implement the actual support message submission
    console.log('Support message:', { email, message });
    setMessage('');
    setEmail('');
    onToggle();
  };

  return (
    <Box
      position="fixed"
      bottom="4"
      left="4"
      zIndex="1000"
    >
      <Collapse in={isOpen}>
        <Card
          width="300px"
          mb={4}
          boxShadow="lg"
          borderColor={borderColor}
          bg={bgColor}
        >
          <CardHeader pb={2}>
            <Heading size="sm" display="flex" justifyContent="space-between" alignItems="center">
              Customer Support
              <IconButton
                aria-label="Close support"
                icon={<Icon as={X} />}
                size="sm"
                variant="ghost"
                onClick={onToggle}
              />
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3}>
              <Input
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
              />
              <Textarea
                placeholder="How can we help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="sm"
                rows={4}
              />
              <Button
                leftIcon={<Icon as={Send} />}
                colorScheme="blue"
                size="sm"
                width="full"
                onClick={handleSubmit}
                isDisabled={!message || !email}
              >
                Send Message
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Collapse>
      
      <Button
        leftIcon={<Icon as={MessageCircle} />}
        colorScheme="blue"
        onClick={onToggle}
        size="md"
        boxShadow="lg"
      >
        Need Help?
      </Button>
    </Box>
  );
};
