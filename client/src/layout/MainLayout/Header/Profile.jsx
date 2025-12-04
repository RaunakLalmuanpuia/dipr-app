import { useEffect, useState } from 'react';

// material-ui
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import useLogout from "../../../hooks/useLogout";
// third party
import { useLocation, useNavigate } from 'react-router-dom';

// project imports
import MainCard from '../../../components/cards/MainCard';

// assets
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DraftsTwoToneIcon from '@mui/icons-material/DraftsTwoTone';
import LockOpenTwoTone from '@mui/icons-material/LockOpenTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';

const menuItems = [
  { icon: <SettingsTwoToneIcon />, label: 'Settings' },
  { icon: <PersonTwoToneIcon />, label: 'Profile'  , path: '/profile' },
  { icon: <DraftsTwoToneIcon />, label: 'My Messages' , path: '/messages' },
  { icon: <LockOpenTwoTone />, label: 'Lock Screen' , path: '/lock-screen' },
  { icon: <MeetingRoomTwoToneIcon />, label: 'Logout', action: 'logout' },
];

// ==============================|| PROFILE ||============================== //

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => setOpen(false);

  useEffect(() => {
    const index = menuItems.findIndex((item) => item.path && location.pathname.startsWith(item.path));
    setSelectedIndex(index !== -1 ? index : null);
  }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/');   // redirect after logout
    };

  const handleMenuItemClick = (index, item) => {
    setSelectedIndex(index);

    console.log(item);

    if (item.path) {
      navigate(item.path);
    } else if (item.action === 'logout') {
        handleLogout();
    }
  };


  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'profile-popper' : undefined;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <IconButton size="small" onClick={handleClick}>
          <AccountCircleTwoToneIcon sx={{ fontSize: { sm: 24 }, color: 'background.paper' }} />
        </IconButton>

        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          disablePortal
          modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={100}>
              <MainCard content={false} sx={{ width: 250 }}>
                <List>
                  {menuItems.map((item, index) => (
                    <ListItemButton key={item.label} selected={selectedIndex === index} onClick={() => handleMenuItemClick(index, item)}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                </List>
              </MainCard>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
