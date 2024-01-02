//import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
//import Drawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
//import Toolbar from '@mui/material/Toolbar';
import { memo } from 'react';
import { Box, IconButton, Theme, styled } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, useTheme } from '@emotion/react';
import { useAppStore } from '../store';

export const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
);

const SideBar = memo(() => {
    const theme = useTheme();
    
    const isOpenMobile = useAppStore((state) => state.isOpenMobile);      
    const isOpenDesktop = useAppStore((state) => state.isOpenDesktop);      
    const close = useAppStore((state) => state.close);

    console.log('isOpenMobile', isOpenMobile);

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      }));

    const drawer = (
        <Box>
            <DrawerHeader>
                <IconButton onClick={close}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                        minHeight: 48,
                        justifyContent: (isOpenDesktop || isOpenMobile) ? 'initial' : 'center',
                        px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: (isOpenDesktop || isOpenMobile) ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} sx={{ opacity: (isOpenDesktop || isOpenMobile) ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            ))}
            </List>
            {/* <Divider />
            <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                        minHeight: 48,
                        justifyContent: isOpen ? 'initial' : 'center',
                        px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isOpen ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} sx={{ opacity: isOpen ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            ))}
            </List> */}
        </Box>
    );
  
    return (
        <Box>
            <MuiDrawer                
                variant="temporary"
                open={isOpenMobile}
                onClose={close}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },   
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },                 
                }}
            >
                {drawer}
            </MuiDrawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },                    
                }}
                open={isOpenDesktop}
            >
                {drawer}
            </Drawer>
        </Box>        
    );
})

export default SideBar;