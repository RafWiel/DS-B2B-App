import { Card, CardContent, Grid, InputAdornment, TextField } from "@mui/material";
import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';


type ComponentProps = { 
    search: string,  
    setFilter(search: string, isDebouncedUpdate: boolean): void;           
};  

const CompaniesFilter = memo(({search, setFilter}: ComponentProps) => {
    const theme = useTheme();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {           
        setFilter(e.target.value, true);
    };  
        
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
                            id="employee-search"                                 
                            label="Szukaj" 
                            value={search} 
                            onChange={handleChange}                          
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

export default CompaniesFilter;