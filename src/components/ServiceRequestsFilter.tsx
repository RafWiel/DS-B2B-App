import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { memo, useState } from "react";
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
// import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
// import { withStyles } from "@material-ui/core/styles";

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

// const AccordionSummary = withStyles({
//     root: {
//       "&.Mui-focused": {
//         backgroundColor: "inherit"
//       }
//     }
//   })(MuiAccordionSummary);

export const ServiceRequestsFilter = memo(({search, start, end, ownership, type, submitType, status, setFilter}: ComponentProps) => {
    const theme = useTheme();
    const [expand, setExpand] = useState(false);

    const toggleAccordion = () => {
        setExpand((prev) => !prev);
    };

    return (
        <>
        <Accordion 
            elevation={0} 
            square={false}
            expanded={expand}
            disableGutters
            sx={{
                [theme.breakpoints.up('sm')]: {
                    border: '1px solid #dddddd', 
                    borderRadius: '4px'
                }, 
                [theme.breakpoints.up('xl')]: {
                    display: 'none' 
                },                            
            }}
        >
            <AccordionSummary             
                expandIcon={
                    <ExpandMoreIcon onClick={toggleAccordion}/>
                }                
            >
                <Grid 
                    container 
                    spacing={2} 
                    marginRight={2}
                >
                    {/* Search */}
                    <Grid item xs={12} md={8}>
                        <TextField                                                        
                            label="Szukaj" 
                            value={search}                             
                            //onClick={(e) => e.stopPropagation()}
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
                    {/* Start */}
                    <Grid 
                        item 
                        md={2}
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
                    {/* End */}
                    <Grid 
                        item 
                        md={2}
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
            <AccordionDetails >
                <Grid 
                    container 
                    spacing={2}
                    sx={{
                        paddingRight: '38px'
                    }}                    
                >
                    {/* Start */}
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
                    {/* End */}
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
                    {/* Ownership */}
                    <Grid item xs={4} md={2}>
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
                    {/* Type */}
                    <Grid item xs={4} md={3}>
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
                    {/* Submit type */}
                    <Grid item xs={4} md={3}>
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
                    {/* Status */}
                    <Grid item xs={4} md={4}>
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
                [theme.breakpoints.down('xl')]: {
                    display: 'none' 
                },                                                     
            }}>
            <CardContent>
                <div                     
                    style={{
                        display: 'flex',                        
                    }}
                >
                    {/* Search */}
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
                        sx={{
                            width: '300%'
                        }}                            
                    />                        
                
                    {/* Start */}
                    <FormControl 
                        variant="standard" 
                        fullWidth 
                        sx={{
                            marginLeft: '16px'
                        }}
                    >
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
                    
                    {/* End */}                    
                    <FormControl 
                        variant="standard" 
                        fullWidth
                        sx={{
                            marginLeft: '16px'
                        }}
                    >
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
                    
                    {/* Ownership */}                    
                    <FormControl 
                        variant="standard" 
                        fullWidth
                        sx={{
                            marginLeft: '16px',
                            width: '80%'
                        }}
                    >
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
                    
                    {/* Type */}                    
                    <FormControl 
                        variant="standard" 
                        fullWidth
                        sx={{
                            marginLeft: '16px',
                        }}
                    >
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
                    
                    {/* Submit type */}                    
                    <FormControl 
                        variant="standard" 
                        fullWidth
                        sx={{
                            marginLeft: '16px',
                        }}
                    >
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

                    {/* Status */}                    
                    <FormControl 
                        variant="standard" 
                        fullWidth
                        sx={{
                            marginLeft: '16px',
                            width: '150%'
                        }}
                    >
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
                </div>
            </CardContent>      
        </Card>
        </>
    );
});
