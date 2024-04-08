import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { ownershipType } from '../enums/ownershipType.ts';
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { serviceRequestType } from "../enums/serviceRequestType.ts";
import { serviceRequestSubmitType } from "../enums/serviceRequestSubmitType.ts";
import { serviceRequestStatus } from "../enums/serviceRequestStatus.ts";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { serviceRequestSimpleStatus } from "../enums/serviceRequestSimpleStatus.ts";

type ComponentProps = { 
    search: string,  
    start: Dayjs | null,
    end: Dayjs | null,
    ownership: string,
    type: string,    
    submitType: string,    
    status: string,    
    setFilter(
        search: string, 
        start: Dayjs | null,
        end: Dayjs | null,
        ownership: string,
        type: string, 
        submitType: string,    
        status: string,    
        isDebouncedUpdate: boolean): void;           
};  

export const ServiceRequestsFilter = memo(({search, start, end, ownership, type, submitType, status, setFilter}: ComponentProps) => {
    const theme = useTheme();
        
    return (
        <>
        <Accordion elevation={0} variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={4} >
                        <TextField                                                        
                            label="Szukaj" 
                            value={search} 
                            onChange={(e) => setFilter(e.target.value, start, end, ownership, type, submitType, status, true)}                          
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
                    <Grid 
                        item 
                        md={3}
                        sx={{
                            [theme.breakpoints.down('md')]: {
                                display: 'none'
                            },                        
                        }}
                    >
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Od</InputLabel>
                            <DatePicker 
                                value={start}
                                onChange={(newValue: Dayjs | null) => setFilter(search, newValue, end, ownership, type, submitType, status, false)}
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
                    <Grid 
                        item 
                        md={3}
                        sx={{
                            [theme.breakpoints.down('md')]: {
                                display: 'none'
                            },                        
                        }}
                    >
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Do</InputLabel>
                            <DatePicker 
                                value={end}
                                onChange={(newValue: Dayjs | null) => setFilter(search, start, newValue, ownership, type, submitType, status, false)}
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
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid 
                        item 
                        xs={4}
                        sx={{
                            [theme.breakpoints.up('md')]: {
                                display: 'none'
                            },                        
                        }}
                    >
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Od</InputLabel>
                            <DatePicker 
                                value={start}
                                onChange={(newValue: Dayjs | null) => setFilter(search, newValue, end, ownership, type, submitType, status, false)}
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
                    <Grid 
                        item 
                        xs={4}
                        sx={{
                            [theme.breakpoints.up('md')]: {
                                display: 'none'
                            },                        
                        }}
                    >
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Do</InputLabel>
                            <DatePicker 
                                value={end}
                                onChange={(newValue: Dayjs | null) => setFilter(search, start, newValue, ownership, type, submitType, status, false)}
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
                    <Grid item xs={4} md={3} lg={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-ownership-label">Zlecenia</InputLabel>
                            <Select
                                labelId="service-request-ownership-label"
                                value={ownership}
                                onChange={(e) => setFilter(search, start, end, e.target.value, type, submitType, status, false)}                                 
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
                    <Grid item xs={4} md={3} lg={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-type-label">Typ</InputLabel>
                            <Select
                                labelId="service-request-type-label"
                                value={type}
                                onChange={(e) => setFilter(search, start, end, ownership, e.target.value, submitType, status, false)}
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
                    <Grid item xs={4} md={3} lg={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-submit-type-label">Źródło</InputLabel>
                            <Select
                                labelId="service-request-submit-type-label"
                                value={submitType}
                                onChange={(e) => setFilter(search, start, end, ownership, type, e.target.value, status, false)}
                            >
                                {
                                    serviceRequestSubmitType && serviceRequestSubmitType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{serviceRequestSubmitType.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} md={3} lg={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-status-label">Status</InputLabel>
                            <Select
                                labelId="service-request-status-label"
                                value={status}
                                onChange={(e) => setFilter(search, start, end, ownership, type, submitType, e.target.value, false)}
                            >
                                <MenuItem key={0} value={0}>Wszystkie</MenuItem>
                                <Divider /> 
                                {                                     
                                    serviceRequestSimpleStatus && serviceRequestSimpleStatus.items
                                        .filter(u => u.id > serviceRequestSimpleStatus.none)
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{serviceRequestSimpleStatus.getFilterText(item.id)}</MenuItem>
                                        ))
                                }  
                                <Divider /> 
                                {                                     
                                    serviceRequestStatus && serviceRequestStatus.items   
                                        .filter(u => u.id > serviceRequestStatus.none)                                     
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{serviceRequestStatus.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid> 
                </Grid>
            </AccordionDetails>
        </Accordion>

        <Card 
            variant="outlined"
            sx={{                 
                [theme.breakpoints.down('sm')]: {
                    border: 'none' 
                },                    
            }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={4} >
                        <TextField                                                        
                            label="Szukaj" 
                            value={search} 
                            onChange={(e) => setFilter(e.target.value, start, end, ownership, type, submitType, status, true)}                          
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
                    <Grid item xs={4} md={3} lg={2}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Od</InputLabel>
                            <DatePicker 
                                value={start}
                                onChange={(newValue: Dayjs | null) => setFilter(search, newValue, end, ownership, type, submitType, status, false)}
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
                    <Grid item xs={4} md={3} lg={2}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Do</InputLabel>
                            <DatePicker 
                                value={end}
                                onChange={(newValue: Dayjs | null) => setFilter(search, start, newValue, ownership, type, submitType, status, false)}
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
                    <Grid item xs={4} md={3} lg={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-ownership-label">Zlecenia</InputLabel>
                            <Select
                                labelId="service-request-ownership-label"
                                value={ownership}
                                onChange={(e) => setFilter(search, start, end, e.target.value, type, submitType, status, false)}                                 
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
                    <Grid item xs={4} md={3} lg={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-type-label">Typ</InputLabel>
                            <Select
                                labelId="service-request-type-label"
                                value={type}
                                onChange={(e) => setFilter(search, start, end, ownership, e.target.value, submitType, status, false)}
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
                    <Grid item xs={4} md={3} lg={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-submit-type-label">Źródło</InputLabel>
                            <Select
                                labelId="service-request-submit-type-label"
                                value={submitType}
                                onChange={(e) => setFilter(search, start, end, ownership, type, e.target.value, status, false)}
                            >
                                {
                                    serviceRequestSubmitType && serviceRequestSubmitType.items                                        
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{serviceRequestSubmitType.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                
                            </Select>
                        </FormControl>                        
                    </Grid>  
                    <Grid item xs={4} md={3} lg={1}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="service-request-status-label">Status</InputLabel>
                            <Select
                                labelId="service-request-status-label"
                                value={status}
                                onChange={(e) => setFilter(search, start, end, ownership, type, submitType, e.target.value, false)}
                            >
                                <MenuItem key={0} value={0}>Wszystkie</MenuItem>
                                <Divider /> 
                                {                                     
                                    serviceRequestSimpleStatus && serviceRequestSimpleStatus.items
                                        .filter(u => u.id > serviceRequestSimpleStatus.none)
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{serviceRequestSimpleStatus.getFilterText(item.id)}</MenuItem>
                                        ))
                                }  
                                <Divider /> 
                                {                                     
                                    serviceRequestStatus && serviceRequestStatus.items   
                                        .filter(u => u.id > serviceRequestStatus.none)                                     
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{serviceRequestStatus.getFilterText(item.id)}</MenuItem>                                    
                                        ))
                                }                                 
                            </Select>
                        </FormControl>                        
                    </Grid>                      
                </Grid>                                                            
            </CardContent>      
        </Card>
        </>
    );
});
