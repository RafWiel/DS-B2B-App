import { Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { memo, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import employeeType from '../enums/employeeType.ts';
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

type ComponentProps = { 
    search: string,  
    type: string,
    start: Dayjs | null,
    stop: Dayjs | null,
    setFilter(
        search: string, 
        start: Dayjs | null,
        stop: Dayjs | null,
        type: string, 
        isDebouncedUpdate: boolean): void;           
};  

export const ServiceRequestsFilter = memo(({search, start, stop, type, setFilter}: ComponentProps) => {
    const theme = useTheme();
    
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {           
    //     setFilter(e.target.value, start, type, true);
    // };  
    
    const handleChangeSelect = (e: SelectChangeEvent<string>) => {           
        //setFilter(search, e.target.value, false);     
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
                    <Grid item xs={8} sm={4}>
                        <TextField 
                            id="employee-search"                                 
                            label="Szukaj" 
                            value={search} 
                            onChange={(e) => setFilter(e.target.value, start, stop, type, true)}                          
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
                            <InputLabel id="employee-type-label">Od</InputLabel>
                            <DatePicker 
                                value={start}
                                onChange={(newValue: Dayjs | null) => setFilter(search, newValue, stop, type, false)}
                                format="DD/MM/YYYY"
                                sx={{
                                    mt: 2
                                }}                                
                                slotProps={{ 
                                    textField: { variant: 'standard', },
                                    field: { clearable: true }
                                }}
                            />                          
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} sm={2}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="employee-type-label">Do</InputLabel>
                            <DatePicker 
                                value={stop}
                                onChange={(newValue: Dayjs | null) => setFilter(search, start, newValue, type, false)}
                                format="DD/MM/YYYY"
                                sx={{
                                    mt: 2
                                }}                                
                                slotProps={{ 
                                    textField: { variant: 'standard', },
                                    field: { clearable: true }
                                }}
                            />                            
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} sm={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="employee-type-label">Zlecenia</InputLabel>
                            <Select
                                labelId="employee-type-label"
                                id="employee-type"
                                value={type}
                                onChange={handleChangeSelect}
                            >
                                {
                                    employeeType && employeeType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{employeeType.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} sm={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="employee-type-label">Typ</InputLabel>
                            <Select
                                labelId="employee-type-label"
                                id="employee-type"
                                value={type}
                                onChange={handleChangeSelect}
                            >
                                {
                                    employeeType && employeeType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{employeeType.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} sm={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="employee-type-label">Źródło</InputLabel>
                            <Select
                                labelId="employee-type-label"
                                id="employee-type"
                                value={type}
                                onChange={handleChangeSelect}
                            >
                                {
                                    employeeType && employeeType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{employeeType.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} sm={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="employee-type-label">Status</InputLabel>
                            <Select
                                labelId="employee-type-label"
                                id="employee-type"
                                value={type}
                                onChange={handleChangeSelect}
                            >
                                {
                                    employeeType && employeeType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{employeeType.getFilterText(item.id)}</MenuItem>                                    
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
