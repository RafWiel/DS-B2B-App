import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { memo } from 'react';
import { Box, IconButton, Theme, makeStyles, styled } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject } from '@emotion/react';
import { useAppStore } from '../store';
import { Link, useLocation } from 'wouter';
import routes from '../routes';

export const drawerWidth = 285;

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
    //const theme = useTheme();    
    const location = useLocation();
    const isOpenMobile = useAppStore((state) => state.isOpenMobile);      
    const isOpenDesktop = useAppStore((state) => state.isOpenDesktop);      
    const close = useAppStore((state) => state.close);            

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const isSelected = (id: string) => {
        return location.indexOf(id) == 0;
    }   
        
    const drawer = (
        <Box>
            <DrawerHeader>
                <IconButton onClick={close}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {routes.items.filter(u => u.isSidebarItem).map((route) => (
                <ListItem key={route.id} disablePadding sx={{ display: 'block' }}>
                    <Link href={route.id}>                        
                        <ListItemButton
                            
                            selected={isSelected(route.id)}                            
                            sx={{
                                minHeight: 48,
                                justifyContent: (isOpenDesktop || isOpenMobile) ? 'initial' : 'center',
                                px: 2.5,
                                "&.Mui-selected": {
                                    backgroundColor: 'var(--color-selected-backround)',
                                    "&:hover": {
                                      backgroundColor: 'var(--color-selected-hover-backround)',
                                    },
                                },                                 
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: (isOpenDesktop || isOpenMobile) ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: isSelected(route.id) ? 'var(--color-primary)' : 'var(--color-grey)'
                                }}
                            >
                                {route.renderIcon?.()}                        
                            </ListItemIcon>                       
                            <ListItemText 
                                primary={route.text} 
                                sx={{ 
                                    opacity: (isOpenDesktop || isOpenMobile) ? 1 : 0,
                                    color: isSelected(route.id) ? 'var(--color-primary)' : 'var(--color-dark-grey)'
                                }} 
                            />                                        
                        </ListItemButton>
                    </Link>                         
                </ListItem>
            ))}
            </List>            
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