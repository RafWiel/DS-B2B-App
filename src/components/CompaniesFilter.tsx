import { Card, CardContent, Grid, InputAdornment, TextField } from "@mui/material";
import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';


type ComponentProps = { 
    search: string,  
    setFilter(search: string, isDebouncedUpdate: boolean): void;           
};  

export const CompaniesFilter = memo(({search, setFilter}: ComponentProps) => {
    const theme = useTheme();
            
    return (
        <Card 
            variant="outlined"
            sx={{                 
                [theme.breakpoints.down('sm')]: {
                    border: 'none' 
                },                    
            }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField                                                         
                            label="Szukaj" 
                            value={search} 
                            onChange={(e) => setFilter(e.target.value, true)}                                  
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
                </Grid>                                                            
            </CardContent>      
        </Card>
    );
});
