import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Receipt,
  BarChart2,
  Settings,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Properties', icon: Building2, path: '/properties' },
  { name: 'Tenants', icon: Users, path: '/tenants' },
  { name: 'Transactions', icon: Receipt, path: '/transactions' },
  { name: 'Reports', icon: BarChart2, path: '/reports' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const activeBg = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      as="nav"
      pos="fixed"
      top="16"
      left="0"
      h="calc(100vh - 4rem)"
      w="64"
      bg={useColorModeValue('white', 'gray.800')}
      borderRight="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      display={{ base: 'none', md: 'block' }}
    >
      <VStack spacing={1} align="stretch" py={4}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <HStack
                px={4}
                py={3}
                spacing={4}
                bg={isActive ? activeBg : 'transparent'}
                _hover={{ bg: hoverBg }}
                color={isActive ? 'blue.500' : 'inherit'}
                transition="all 0.2s"
              >
                <Icon as={item.icon} boxSize={5} />
                <Text fontWeight={isActive ? 'semibold' : 'normal'}>
                  {item.name}
                </Text>
                {isActive && (
                  <Box
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    w={1}
                    bg="blue.500"
                  />
                )}
              </HStack>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
