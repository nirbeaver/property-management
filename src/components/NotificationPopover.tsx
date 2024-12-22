import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  IconButton,
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationPopover = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Add some sample notifications if there are none
  React.useEffect(() => {
    if (notifications.length === 0) {
      const sampleNotifications = [
        {
          id: '1',
          title: 'Welcome!',
          message: 'Welcome to Property Manager. Get started by adding your first property.',
          type: 'info',
          createdAt: new Date().toISOString(),
          read: false,
        },
        {
          id: '2',
          title: 'Tip',
          message: 'You can manage all your properties and tenants from the dashboard.',
          type: 'info',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          read: false,
        },
      ];
      sampleNotifications.forEach(notification => {
        localStorage.setItem('notifications', JSON.stringify([
          ...notifications,
          notification,
        ]));
      });
    }
  }, []);

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom-end"
      closeOnBlur={true}
    >
      <PopoverTrigger>
        <Box position="relative" display="inline-block">
          <IconButton
            aria-label="Notifications"
            icon={<Bell size={20} />}
            variant="ghost"
            onClick={onOpen}
          />
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top="-2"
              right="-2"
              colorScheme="red"
              borderRadius="full"
              minW="4"
              h="4"
              textAlign="center"
              fontSize="xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="400px" maxH="600px">
        <PopoverHeader borderBottomWidth="1px">
          <HStack justify="space-between">
            <Text fontWeight="bold">Notifications</Text>
            {notifications.length > 0 && (
              <Button
                size="sm"
                leftIcon={<Check size={14} />}
                variant="ghost"
                onClick={() => {
                  markAllAsRead();
                  onClose();
                }}
              >
                Mark all as read
              </Button>
            )}
          </HStack>
        </PopoverHeader>
        <PopoverBody maxH="400px" overflowY="auto">
          <VStack spacing={2} align="stretch">
            {notifications.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={4}>
                No notifications
              </Text>
            ) : (
              notifications.map((notification) => (
                <Box
                  key={notification.id}
                  p={3}
                  bg={notification.read ? 'white' : 'blue.50'}
                  borderRadius="md"
                  position="relative"
                  _hover={{ bg: notification.read ? 'gray.50' : 'blue.100' }}
                  transition="background-color 0.2s"
                >
                  <HStack justify="space-between" mb={1}>
                    <Text fontWeight="bold" fontSize="sm">
                      {notification.title}
                    </Text>
                    <HStack spacing={1}>
                      {!notification.read && (
                        <IconButton
                          aria-label="Mark as read"
                          icon={<Check size={14} />}
                          size="xs"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        />
                      )}
                      <IconButton
                        aria-label="Remove notification"
                        icon={<X size={14} />}
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                      />
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    {notification.message}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </Text>
                  {!notification.read && (
                    <Badge
                      position="absolute"
                      top={2}
                      right={10}
                      colorScheme="blue"
                      variant="solid"
                      fontSize="xs"
                    >
                      New
                    </Badge>
                  )}
                </Box>
              ))
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
