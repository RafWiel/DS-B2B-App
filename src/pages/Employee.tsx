/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import { useAppStore } from "../store";
import queryString from 'query-string';
import { useLocation, useRoute } from "wouter";
import { config } from "../config/config";

const Employee = memo(() => {
    const theme = useTheme();  
    const setAppBarTitle = useAppStore((state) => state.setAppBarTitle);       
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const [, params] = useRoute("/employees/:id");
    const [, navigate] = useLocation();
    const [employeeId, setEmployeeId] = useState(Number(params?.id as unknown));      
    const abortController = useRef(new AbortController()).current;  

    useEffect(() => {                        
        fetchData();
        
        setAppBarTitle(`Pracownik ${employeeId}`);   
        
        return () => {            
            abortController.abort();            
          }
    }, []);

    
    const fetchData = useCallback(() => {
        if (!employeeId) return;

               
        showLoadingIcon(true);
        
        fetch(`${config.API_URL}/employees/${employeeId}`, { signal: abortController.signal })      
        .then((res: Response) => {           
            if (!res.ok) {
                throw new Error("Nieprawidłowa odpowiedź serwera");                       
            }
            //res = JSON.parse(JSON.stringify(res).replace(/\:null/gi, "\:\"\""));

            return res.json();
        })
        .then((res) => {                                   
            
                  
                        
            //setValues(res as ICertificate);



            console.log('load:', JSON.stringify(res, null, 2));
            
            setAppBarTitle(`Pracownik ${employeeId}`);        
        })
        .catch((error: unknown) => {
            if ((error as Error).name === 'AbortError') return;
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error as Error).message
            });

            navigate('/employees');
        })
        .finally(() => showLoadingIcon(false));         
    }, [employeeId]);
    
    
    return (
        <Box         
            sx={{                
                width: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: {
                    xs: 0, 
                    sm: 1.5
                }
            }}
        >
            <Card 
                variant="outlined"
                sx={{    
                    height: '100%',                        
                    [theme.breakpoints.down('sm')]: {
                        border: 'none' 
                    },                    
                }}
            >
                <CardContent>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                        enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                        imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                        Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                        Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                        nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                        leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                        feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                        consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                        sapien faucibus et molestie ac.
                    </Typography>
                    <Typography paragraph>
                        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                        eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                        neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                        tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                        sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                        tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                        gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                        et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                        tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                        eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                        posuere sollicitudin aliquam ultrices sagittis orci a.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
});

export default Employee;