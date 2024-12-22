import { Link } from 'react-router-dom';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
} from '@chakra-ui/react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

const ProfileMenu = () => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        rightIcon={<ChevronDown />}
        leftIcon={<Avatar size="xs" />}
      >
        John Doe
      </MenuButton>
      <MenuList>
        <MenuItem
          as={Link}
          to="/profile"
          icon={<User size={18} />}
        >
          Profile
        </MenuItem>
        <MenuItem
          as={Link}
          to="/settings"
          icon={<Settings size={18} />}
        >
          Settings
        </MenuItem>
        <MenuItem icon={<LogOut size={18} />}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
