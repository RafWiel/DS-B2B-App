import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import EmployeesFilter from "../components/EmployeesFilter";

const Customers = memo(() => {
    const theme = useTheme();    

    return (
        <Box         
            sx={{                
                display: 'flex',
                width: 1,
                height: '90vh',
                
                flexDirection: 'column',
                padding: {
                    xs: 0, 
                    sm: 1.5
                }
            }}
        >
            <EmployeesFilter />
            <Card 
                variant="outlined"
                sx={{    
                    marginTop: 1.5, 
                    height: '100%',                    
                    [theme.breakpoints.down('sm')]: {
                        border: 'none' 
                    },                    
                }}
            >
                <CardContent sx={{
                    //backgroundColor: 'red', 
                    
                    display: 'flex',
                    height: '100%',                            
                    maxHeight: '100%',
                    [theme.breakpoints.down('md')]: {
                        padding: 1,
                        '&:last-child': { 
                            paddingBottom: 1 
                        }
                    },                                                                                                                
                }}>                    
                    
                <Box sx={{
                    display: 'flex',
                    width: .5,
                    maxHeight: '100%',
                    overflow: 'scroll',
                    backgroundColor: 'aqua'
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: 1,
                        height: '1000px',
                        backgroundColor: 'red'
                    }}>
                    
                    </Box>    
                </Box>    
                    
                        
                            
                </CardContent>
            </Card>
        </Box>
    );
});

export default Customers;