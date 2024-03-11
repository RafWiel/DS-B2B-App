import { createTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SideBar, { drawerWidth } from './components/SideBar';
import { useAppStore } from './store';
import { Redirect, Route, Switch, useLocation } from 'wouter';
import ServiceRequests from './pages/ServiceRequests';
import PhoneConsultations from './pages/PhoneConsultations';
import RegistrationRequests from './pages/RegistrationRequests';
import Customers from './pages/Customers';
import Companies from './pages/Companies';
import Employees from './pages/Employees';
import Employee from './pages/Employee';
import NotFound from './pages/NotFound';
import { ThemeProvider } from '@emotion/react';
import './assets/app.css';
import './assets/fonts.css';
import routes from './routes';
import MessageDialog from './components/MessageDialog';
import QuestionDialog from './components/QuestionDialog';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import Customer from './pages/Customer';
import AutoMessageDialog from './components/AutoMessageDialog';
import Company from './pages/Company';

const todo = 'Dodaj wielu pracownikow do jednej firmy, sprawdz wysokosc DataGrid';

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
    const location = useLocation();  
    const isDesktopSideBarOpen = useAppStore((state) => state.isOpenDesktop);
    const openDesktopSideBar = useAppStore((state) => state.openDesktop);
    const openMobileSideBar = useAppStore((state) => state.openMobile);         
    const appBarTitle = useAppStore((state) => state.appBarTitle);         
    const setAppBarTitle = useAppStore((state) => state.setAppBarTitle);     
    const isLoadingIcon = useAppStore((state) => state.isLoadingIcon);      

    const fontSize = '0.8rem';

    const theme = createTheme({
        palette: {    
            background: {
                default: '#e8e8e8'                           
            }                    
        },
        typography: {
            fontFamily: [
                '-apple-system',
                //'Montserrat',
                'Nunito',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            fontSize: 13,
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiInputBase-root, & .MuiInputLabel-root': {
                            fontSize: fontSize
                        },
                        '& .MuiInputLabel-root.MuiInputLabel-shrink': {                                            
                            transform: 'translate(0, 2px) scale(0.9)'
                        }
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        fontSize: fontSize,
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    root: {
                        fontSize: fontSize,                
                    },
                    // select: {
                    //     ":focus": {
                    //         backgroundColor: "green", // Just for the demo
                    //         border: '3px solid #A6CBF3',
                    //     },
                    // },                    
                },                
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        fontSize: fontSize,
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontSize: fontSize,
                        transform: 'translate(0, 2px) scale(0.9)'             
                    }
                }
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        fontSize: fontSize,
                    },
                },
            },  
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        fontSize: '0.9rem',
                    },
                },
            },  
            MuiDialogContentText: {
                styleOverrides: {
                    root: {
                        fontSize: fontSize,
                    },
                },
            }, 
        }
    });
    

    useEffect(() => {          
        if (routes.isText(location[0])) {
            setAppBarTitle(routes.getText(location[0]));
        }
    }, [location, setAppBarTitle]);
    
    //const [appBarHeight, setAppBarHeight] = useState(0);
    //const isMobileView = useMediaQuery(theme.breakpoints.down("sm"));        

    // useEffect(() => {  
    //     setAppBarTitle(routes.getText(location[0]));

    //     //handleResize();              
    //     //window.addEventListener('resize', handleResize);
        
    //     //return () => {               
    //     //    window.removeEventListener('resize', handleResize);
    //     //};
    // }, []);

    

    // const handleResize = () => {        
    //     setAppBarHeight(document.getElementById("appBar")?.clientHeight ?? 0);

    //     //const windowHeight = window.innerHeight;

    //     //console.log('windowHeight', windowHeight);
    //     console.log('appBarHeight', document.getElementById("appBar")?.clientHeight);

    // }

    return (
        <ThemeProvider theme={theme}>            
            <Box 
                sx={{ 
                    display: 'flex',
                    //minHeight: `calc(100vh - ${appBarHeight}px)`, 
                    minHeight: '100vh', 
                    //height: '100%',
                    [theme.breakpoints.up('sm')]: {
                        backgroundColor: '#e8e8e8'                   
                    },
                    [theme.breakpoints.down('sm')]: {
                        backgroundColor: 'white'                   
                    },
                }}
            >
                <CssBaseline />
                <AppBar 
                    id="appBar" 
                    position="fixed" 
                    open={isDesktopSideBarOpen} 
                    theme={theme} 
                    elevation={0}>
                    <Toolbar >                        
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
                        <Typography 
                            variant="h6" 
                            noWrap 
                            component="div"
                            sx={{ 
                                width: '50%',                                                              
                            }}
                        >
                            {appBarTitle}
                        </Typography>    
                        <Typography 
                            variant="h6" 
                            noWrap 
                            component="div" 
                            sx={{ 
                                width: '50%',
                                textAlign: 'right', 
                                color: 'yellow'                               
                            }}
                        >
                            {todo}
                        </Typography>                    
                    </Toolbar>                    
                </AppBar>                
                <SideBar />
                <Box 
                    component="main"                    
                    sx={{                        
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        flexGrow: 1, 
                        p: 0,                        
                    }}
                >
                    <Toolbar />                                                     
                    <Switch >   
                        <Route path={routes.home}>
                            <Redirect to={routes.serviceRequests} />
                        </Route>                                                                
                        <Route path={routes.companies}>
                            <Companies />
                        </Route>
                        <Route path={routes.company}>
                            <Company />
                        </Route>
                        <Route path={routes.customers}>
                            <Customers />
                        </Route>
                        <Route path={routes.customer}>
                            <Customer />
                        </Route>                        
                        <Route path={routes.employees}>
                            <Employees />
                        </Route>
                        <Route path={routes.employee}>
                            <Employee />
                        </Route>
                        <Route path={routes.phoneConsultations}>
                            <PhoneConsultations />
                        </Route>          
                        <Route path={routes.registrationRequests}>
                            <RegistrationRequests />
                        </Route>
                        <Route path={routes.serviceRequests}>
                            <ServiceRequests />
                        </Route>
                        <Route>
                            <NotFound />
                        </Route>                                        
                    </Switch>                     
                </Box>
                <AutoMessageDialog />
                <MessageDialog />
                <QuestionDialog />
                {
                    isLoadingIcon && 
                    <div className="center-screen">
                        <CircularProgress size={60} />
                    </div>
                }                                        
            </Box>
        </ThemeProvider>
    );
}
