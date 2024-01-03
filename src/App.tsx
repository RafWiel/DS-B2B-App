import './assets/app.css'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SideBar, { drawerWidth } from './components/SideBar';
import { useAppStore } from './store';
import { Redirect, Route, Switch } from 'wouter';
import ServiceRequests from './pages/ServiceRequests';
import PhoneConsultations from './pages/PhoneConsultations';
import RegistrationRequests from './pages/RegistrationRequests';
import Customers from './pages/Customers';
import Companies from './pages/Companies';
import Employees from './pages/Employees';
import NotFound from './pages/NotFound';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    [theme.breakpoints.up('sm')]: {
        zIndex: theme.zIndex.drawer + 1
    },    
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        [theme.breakpoints.up('sm')]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`
        },
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function App() {
    const theme = useTheme();
    const isDesktopSideBarOpen = useAppStore((state) => state.isOpenDesktop);
    const openDesktopSideBar = useAppStore((state) => state.openDesktop);
    const openMobileSideBar = useAppStore((state) => state.openMobile);
    //const closeDesktopSideBar = useAppStore((state) => state.closeDesktop);



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={isDesktopSideBarOpen} theme={theme}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={openMobileSideBar}
                        edge="start"
                        sx={{
                            marginRight: 2,
                            display: { xs: 'block', sm: 'none' },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={openDesktopSideBar}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            display: { xs: 'none', sm: 'block' },
                            ...(isDesktopSideBarOpen && { display: 'none' }),                            
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        TODO: Local storage
                    </Typography>
                </Toolbar>
            </AppBar>
            <SideBar />
            <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
                <Toolbar />
                <Switch>
                    {/* <Route path="/"><Home /></Route> */}
                    <Route path="/">
                        <Redirect to="/service-requests" />
                    </Route>
                    <Route path="/service-requests">
                        <ServiceRequests />
                    </Route>
                    <Route path="/phone-consultations">
                        <PhoneConsultations />
                    </Route>          
                    <Route path="/registration-requests">
                        <RegistrationRequests />
                    </Route>
                    <Route path="/customers">
                        <Customers />
                    </Route>
                    <Route path="/companies">
                        <Companies />
                    </Route>
                    <Route path="/employees">
                        <Employees />
                    </Route>                    
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Box>
        </Box>
    );
}
