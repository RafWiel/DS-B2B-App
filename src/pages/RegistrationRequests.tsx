import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import ParentComponent from "../components/ParentComponent";

const RegistrationRequests = memo(() => {
    const theme = useTheme();    

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
                    <ParentComponent />
                </CardContent>
            </Card>
        </Box>
    );
});

export default RegistrationRequests;