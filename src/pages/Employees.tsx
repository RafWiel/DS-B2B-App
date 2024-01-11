import { Box, Card, CardContent, Grid, InputAdornment, TextField } from "@mui/material";
import { memo } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

const Employees = memo(() => {
    const theme = useTheme();    

    return (
        <Box 
            sx={{
                padding: {
                    xs: 0, 
                    sm:1.5
                }
            }}
        >
            <Card 
                variant="outlined"
                sx={{ 
                    minWidth: 275,
                    [theme.breakpoints.down('sm')]: {
                        border: 'none' 
                    },                    
                }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8} sm={10}>                        
                            <TextField 
                                id="search"                                 
                                label="Szukaj" 
                                fullWidth                                 
                                variant="standard" 
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                    ),
                                }}
                            />                        
                        </Grid>
                        <Grid item xs={4} sm={2}>
                            <TextField 
                                label="Typ" 
                                fullWidth 
                                variant="standard" />
                        </Grid>  
                    </Grid>                                                            
                </CardContent>      
            </Card>
        </Box>
    );
});

export default Employees;