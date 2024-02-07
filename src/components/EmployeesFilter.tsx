import { Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import employeeType from '../enums/employeeType.ts';


type ComponentProps = { 
    search: string,  
    setSearch(value: string): void;        
};  

const EmployeesFilter = memo(({search, setSearch}: ComponentProps) => {
    const theme = useTheme();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {   
        setSearch(e.target.value);                         
        
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
                    <Grid item xs={8} sm={10}>
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
                    <Grid item xs={4} sm={2}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="employee-type-label">Typ</InputLabel>
                            <Select
                                labelId="employee-type-label"
                                id="employee-type"
                                //value={age}
                                //onChange={handleChange}
                                label="Age"
                            >
                                {
                                    employeeType && employeeType.items.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>{item.text}</MenuItem>                                    
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

export default EmployeesFilter;