import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  Avatar,
  Badge,
  Divider,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  LogOut,
  Settings,
  User,
  Building2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import NotificationPopover from './NotificationPopover';

const Layout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Flex
        as="header"
        position="fixed"
        w="full"
        h="16"
        px="4"
        bg={headerBg}
        borderBottomWidth="1px"
        borderColor={borderColor}
        align="center"
        zIndex="1000"
      >
        {/* Left side */}
        <HStack spacing="4">
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon />}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="ghost"
          />
          <Link to="/">
            <HStack>
              <Box color="blue.500">
                <Building2 size={24} />
              </Box>
              <Text fontSize="xl" fontWeight="bold">
                Property Manager
              </Text>
            </HStack>
          </Link>
        </HStack>

        {/* Right side */}
        <HStack spacing="4" ml="auto">
          {/* Notifications */}
          <NotificationPopover />

          {/* User Menu */}
          <Menu>
            <MenuButton>
              <HStack spacing="3">
                <Avatar
                  size="sm"
                  name={user?.name || undefined}
                  src={user?.photoURL || undefined}
                />
                <Box display={{ base: 'none', md: 'block' }}>
                  <Text fontWeight="medium" fontSize="sm">
                    {user?.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {user?.email}
                  </Text>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem 
                as={Link}
                to="/profile"
                icon={<User size={16} />}
              >
                Profile
              </MenuItem>
              <MenuItem
                as={Link}
                to="/settings"
                icon={<Settings size={16} />}
              >
                Settings
              </MenuItem>
              <Divider />
              <MenuItem icon={<LogOut size={16} />} onClick={handleSignOut}>
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody p="0">
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        as="aside"
        position="fixed"
        left="0"
        w="64"
        top="16"
        h="calc(100vh - 4rem)"
        display={{ base: 'none', md: 'block' }}
        borderRightWidth="1px"
        borderColor={borderColor}
        bg={headerBg}
      >
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box ml={{ base: 0, md: '64' }} pt="16">
        <Box p="6">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
