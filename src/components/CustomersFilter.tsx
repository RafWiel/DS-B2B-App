import { Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { customerType } from '../enums/customerType.ts';

type ComponentProps = { 
    search: string,  
    type: string,
    setFilter(search: string, type: string, isDebouncedUpdate: boolean): void;           
};  

export const CustomersFilter = memo(({search, type, setFilter}: ComponentProps) => {
    const theme = useTheme();
    
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {           
    //     setFilter(e.target.value, type, true);
    // };  
    
    // const handleChangeSelect = (e: SelectChangeEvent<string>) => {           
    //     setFilter(search, e.target.value, false);     
    // };  

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
                    <Grid item xs={8} sm={10}>
                        <TextField                                                          
                            label="Szukaj" 
                            value={search} 
                            onChange={(e) => setFilter(e.target.value, type, true)}
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
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="customer-type-label">Typ</InputLabel>
                            <Select
                                labelId="customer-type-label"                                
                                value={type}
                                onChange={(e) => setFilter(search, e.target.value, false)}
                            >
                                {
                                    customerType && customerType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{customerType.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid>  
                </Grid>                                                            
            </CardContent>      
        </Card>
    );
});
