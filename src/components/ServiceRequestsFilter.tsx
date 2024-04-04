import { Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { employeeType } from '../enums/employeeType.ts';
import { ownershipType } from '../enums/ownershipType.ts';
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { serviceRequestType } from "../enums/serviceRequestType.ts";

type ComponentProps = { 
    search: string,  
    start: Dayjs | null,
    end: Dayjs | null,
    ownership: string,
    type: string,    
    setFilter(
        search: string, 
        start: Dayjs | null,
        end: Dayjs | null,
        ownership: string,
        type: string, 
        isDebouncedUpdate: boolean): void;           
};  

export const ServiceRequestsFilter = memo(({search, start, end, ownership, type, setFilter}: ComponentProps) => {
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
                    <Grid item xs={8} sm={4}>
                        <TextField                                                        
                            label="Szukaj" 
                            value={search} 
                            onChange={(e) => setFilter(e.target.value, start, end, ownership, type, true)}                          
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
                            <InputLabel>Od</InputLabel>
                            <DatePicker 
                                value={start}
                                onChange={(newValue: Dayjs | null) => setFilter(search, newValue, end, ownership, type, false)}
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
                            <InputLabel>Do</InputLabel>
                            <DatePicker 
                                value={end}
                                onChange={(newValue: Dayjs | null) => setFilter(search, start, newValue, ownership, type, false)}
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
                            <InputLabel id="service-request-ownership-label">Zlecenia</InputLabel>
                            <Select
                                labelId="service-request-ownership-label"
                                value={ownership}
                                onChange={(e) => setFilter(search, start, end, e.target.value, type, false)}                                 
                            >
                                {
                                    ownershipType && ownershipType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{ownershipType.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} sm={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-type-label">Typ</InputLabel>
                            <Select
                                labelId="service-request-type-label"
                                value={type}
                                onChange={(e) => setFilter(search, start, end, ownership, e.target.value, false)}
                            >
                                {
                                    serviceRequestType && serviceRequestType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{serviceRequestType.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} sm={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-submit-type-label">Źródło</InputLabel>
                            <Select
                                labelId="service-request-submit-type-label"
                                value={type}
                                onChange={(e) => setFilter(search, start, end, ownership, type, false)}
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
                            <InputLabel id="service-request-status-label">Status</InputLabel>
                            <Select
                                labelId="service-request-status-label"
                                value={type}
                                onChange={(e) => setFilter(search, start, end, ownership, type, false)}
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
