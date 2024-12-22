import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface CardProps extends BoxProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      shadow="sm"
      p={6}
      {...props}
    >
      {children}
    </Box>
  );
};
