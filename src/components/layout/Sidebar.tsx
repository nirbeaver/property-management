import React from 'react';
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
  VStack,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Building2,
  Users,
  FileText,
  DollarSign,
  BarChart2,
  Settings,
} from 'lucide-react';

interface LinkItemProps {
  name: string;
  icon: React.ElementType;
  to: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: Home, to: '/' },
  { name: 'Properties', icon: Building2, to: '/properties' },
  { name: 'Tenants', icon: Users, to: '/tenants' },
  { name: 'Leases', icon: FileText, to: '/leases' },
  { name: 'Transactions', icon: DollarSign, to: '/transactions' },
  { name: 'Reports', icon: BarChart2, to: '/reports' },
  { name: 'Settings', icon: Settings, to: '/settings' },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          PropManager
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <VStack spacing={2} align="stretch" px={4}>
        {LinkItems.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#EDF2F7' : 'transparent',
              borderRadius: '8px',
              textDecoration: 'none',
            })}
          >
            <Flex
              align="center"
              p="4"
              role="group"
              cursor="pointer"
              _hover={{
                bg: 'gray.100',
                color: 'gray.900',
              }}
              borderRadius="lg"
            >
              <Box mr="4">
                <link.icon size={20} />
              </Box>
              {link.name}
            </Flex>
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
