import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Grid, TextField, Typography, useMediaQuery } from "@mui/material";
import { useAppStore } from "../store.ts";
import { useLocation, useRoute } from "wouter";
import { config } from "../config/config.ts";
import { Formik, FormikProps, FormikHelpers } from 'formik';
import AddIcon from '@mui/icons-material/Add';
import * as yup from 'yup';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { IIdResponse } from "../interfaces/IIdResponse.ts";
import '../assets/card.css';
import { DataGrid, IBaseRow, IColumn, IDataGridRef } from "../components/DataGrid.tsx";
import { ICustomer } from "../interfaces/ICustomer.ts";
import { useApi } from '../hooks/useApi.ts';
import { IServiceRequest } from "../interfaces/IServiceRequest.ts";
import BadgeIcon from '@mui/icons-material/Badge';
import dayjs from "dayjs";

interface ICustomerRow extends IBaseRow {
    login: string,
    name: string;
    phoneNumber: string;    
    type: string
}

const columns: IColumn[] = [
    {
        id: 'id',
        label: 'Id',
        numeric: true,
        hidden: true,        
    },
    {
        id: 'login',
        label: 'Login',
        disablePadding: true,        
        width: {
            mobile: '170px',
            desktop: '170px'
        }
    },
    {
        id: 'name',
        label: 'Imię i nazwisko',
        width: {
            mobile: '190px',
            desktop: '190px'
        }
    },
    {
        id: 'phoneNumber',
        label: 'Numer telefonu',
        width: {
            mobile: '170px',
            desktop: '170px'
        }
    },
    {
        id: 'type',
        label: 'Typ',
        width: {
            mobile: 'auto',
            desktop: 'auto'
        }
    },
];

export const ServiceRequest = () => {
    const theme = useTheme();  
    const setAppBarTitle = useAppStore((state) => state.setAppBarTitle);       
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const openAutoMessageDialog = useAppStore((state) => state.openAutoMessageDialog); 
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const [, params] = useRoute("/service-requests/:id");
    const [, navigate] = useLocation();    
    const abortController = useRef(new AbortController()).current;      
    const [mainCardHeight, setMainCardHeight] = useState(0);
    const dataGridRef = useRef<IDataGridRef>();
    const [dataGridHeight, setDataGridHeight] = useState(0);
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));           
    const isXsMobileView = useMediaQuery(theme.breakpoints.only("xs"));           
    const postalRegExp = /^[0-9]{2}-[0-9]{3}$/    
    const api = useApi();


    const schema = yup.object().shape({                                                    
        name: yup.string().required('Podaj nazwę'),
        erpId: yup.number().typeError('Nieprawidłowy ERP Id').required('Podaj ERP Id'),
        taxNumber: yup.string().required('Podaj NIP').length(10, 'Nieprawidłowy NIP'),
        address: yup.string().required('Podaj adres'),
        postal: yup.string().required('Podaj kod pocztowy').matches(postalRegExp, 'Nieprawidłowy kod pocztowy'),                 
        city: yup.string().required('Podaj miasto'),
    });

    const [request, setRequest] = useState<IServiceRequest>({         
        id: Number(params?.id),                        
        creationDate: new Date,
        closureDate: new Date,
        reminderDate: new Date,
        ordinal: 0,
        name: '',
        companyName: '',
        topic: '',        
        description: '',
        status: 0,
        requestType: 0,
        submitType: 0,
        invoice: ''        
    }); 

    useEffect(() => {                        
        setAppBarTitle('Zlecenie serwisowe');   
        fetchData();                

        for (let i=1; i<=3; i++) {
            setTimeout(() => {
                handleResize(); 
            }, 75 * i);
        }
                     
        window.addEventListener('resize', handleResize);

        return () => {            
            abortController.abort();            
            window.removeEventListener('resize', handleResize);       
        }
    }, []);
    
    const fetchData = () => {
        if (!request.id) return;
               
        showLoadingIcon(true);
        
        api.get(`${config.API_URL}/service-requests/${request.id}`, { 
            signal: abortController.signal 
        })              
        .then((res) => {        
            console.log('fetch:', JSON.stringify(res.data, null, 2));                 
            setRequest(res.data);  
            setAppBarTitle(`Zlecenie serwisowe ${res.data.name}`);        
        })
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;
            
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error.response ? `${error.response.status} - ` : '') + 'Nieudane pobranie danych firmy'
            });

            navigate('/service-requests');
        })
        .finally(() => showLoadingIcon(false));         
    }
    
    const handleSubmit = (request: IServiceRequest, { setSubmitting }: FormikHelpers<IServiceRequest>) => {                     
        showLoadingIcon(true);        

        //console.log('submit', company.id);
        console.log('handleSubmit:', JSON.stringify(request, null, 2)); 
                         
        api(`${config.API_URL}/service-requests`, {
            method: !request.id ? 'POST' : 'PUT',            
            headers: { "Content-Type": "application/json" },
            data: request,
            signal: abortController.signal 
        })       
        .then((res) => {                           
            const response = res.data as IIdResponse;

            setRequest({...request, id: response.id});
            setUrl(response.id);

            openAutoMessageDialog({
                title: 'Zlecenie serwisowe',
                text: 'Zapisano',
                delay: 1000
            });           
        })      
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;

            let errorMessage = 'Nieudany zapis zlecenia serwisowego';
            
            if (error.response?.status === 404) {
                errorMessage = 'Nie znaleziono zlecenia w bazie danych';
            }
            
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error.response ? `${error.response.status} - ` : '') + errorMessage
            });
        })        
        .finally(() => {           
            setSubmitting(false);  
            showLoadingIcon(false);            
        });
    }
    
    const setUrl = (id: number) => {
        const url = `/service-requests/${id}`;
        
        window.history.replaceState(null, '', url);
    }

    const handleDelete = () => {        
        openQuestionDialog({
            title: 'Zlecenie serwisowe',
            text: `Czy na pewno usunąć zlecenie ${request.name}?`,            
            action: deleteSingle,
            actionParameters: request.id
        });
    }

    const deleteSingle = async (id: number) => {
        const result = await deleteAsync(`${config.API_URL}/service-requests/${id}`, 'Nieudane usunięcie zlecenia serwisowego');        
        if (!result) {            
            return;
        }

        navigate('/service-requests');
    }   

    const deleteAsync = useCallback(async (url: string, errorMessage: string) => {
        showLoadingIcon(true);       
        
        const result = await api.delete(url, {
            signal: abortController.signal 
        })              
        .then(() => {                       
            return true;
        })        
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;
            
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error.response ? `${error.response.status} - ` : '') + errorMessage
            });

            return false;
        })
        .finally(() => {
            showLoadingIcon(false);                        
        });   
    
        //console.log('result', result);
        return result;
    }, [abortController.signal, api, openMessageDialog, showLoadingIcon]); 
    
    const handleResize = () => {                  
        const appBarHeight = document.getElementById("appBar")?.clientHeight ?? 0;     
        const mainCardHeight = document.getElementById('company-main-card')?.clientHeight ?? 0;
        const titleHeight = document.getElementById('company-datagrid-card-title')?.clientHeight ?? 0;        
        const datagridMargin = isMobileView ? (isXsMobileView ? 45 : 74) : 42; //uwaga, tutaj rzezba
        const mainMargin = 12;  
        
        setMainCardHeight(mainCardHeight);    
        setDataGridHeight(window.innerHeight - appBarHeight - mainCardHeight - titleHeight - mainMargin * 3 - datagridMargin);                    
    }  

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
            {/* Szczegoly */}
            <Card
                id="company-main-card" 
                variant="outlined"
                sx={{    
                    minHeight: 162,  
                    [theme.breakpoints.down('md')]: {
                        minHeight: 292,                          
                    },
                    [theme.breakpoints.down('sm')]: {
                        minHeight: 342,  
                        border: 'none' 
                    },                     
                }}
            >                
                <CardContent sx={{                    
                    display: 'flex',                            
                    height: '100%',                    
                    '&:last-child': { 
                        paddingBottom: 2 
                    },
                    [theme.breakpoints.down('md')]: {
                        padding: 1,
                        '&:last-child': { 
                            paddingBottom: 2 
                        }
                    },                                                                                                                
                }}>                        
                    <Formik
                        enableReinitialize={true}
                        initialValues={request}
                        validationSchema={schema} 
                        validateOnChange={true}
                        validateOnBlur={true}           
                        onSubmit={handleSubmit}>                    
                        {(props: FormikProps<IServiceRequest>) => {
                            const { handleSubmit, handleChange, values, errors, touched, isSubmitting } = props;                            

                            //console.log('render Formik');
                            //console.log('errors', errors);
                            //console.log('touched', touched);

                            return (                                                                                  
                                <Grid 
                                    container                         
                                    spacing={2}
                                    // sx={{
                                    //     height: '100%',                            
                                    // }}
                                >
                                    {/* Content grid */}
                                    <Grid 
                                        item 
                                        xs={12} 
                                        sm={12} 
                                        md={10} 
                                        // sx={{                                
                                        //     backgroundColor: 'yellow',                                
                                        // }}
                                    >      
                                        <Typography className="card-title" component="div">
                                            Zlecenie
                                        </Typography>                                
                                        {/* 2 columns */}
                                        <Grid                                         
                                            container 
                                            spacing={2}
                                            // sx={{                                
                                            //     backgroundColor: 'blue',                                
                                            // }}
                                        >
                                            {/* Column 1 */}
                                            <Grid 
                                                item 
                                                xs={6}                                                 
                                                // sx={{                                
                                                //     backgroundColor: 'aqua',
                                                // }}
                                            >
                                                <Grid                                         
                                                    container 
                                                    spacing={2}                                                    
                                                >   
                                                    <Grid 
                                                        item                                                         
                                                        xs={12} 
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <TextField 
                                                            error={touched?.topic && !!errors?.topic}
                                                            helperText={touched?.topic && errors?.topic}
                                                            name="topic"
                                                            value={values.topic} 
                                                            label="Tytuł" 
                                                            onChange={handleChange}                                                                              
                                                            fullWidth                                 
                                                            variant="standard"                                                                                    
                                                            // inputProps={{ style: { fontSize: '14px' } }}
                                                        />  
                                                    </Grid>
                                                    <Grid 
                                                        item                                                          
                                                        xs={12}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <TextField 
                                                            error={touched?.description && !!errors?.description}
                                                            helperText={touched?.description && errors?.description}
                                                            name="description"                                                    
                                                            value={values.description} 
                                                            label="Opis" 
                                                            onChange={handleChange}                                                     
                                                            fullWidth                                 
                                                            variant="standard" 
                                                            multiline  
                                                            rows={4}                              
                                                        />  
                                                    </Grid>
                                                </Grid>
                                            </Grid> 
                                            {/* Column 2 */}
                                            <Grid 
                                                item 
                                                xs={6}                                              
                                                // sx={{                                
                                                //     backgroundColor: 'aqua',
                                                // }}
                                            >
                                                <Grid                                         
                                                    container 
                                                    spacing={2}
                                                    
                                                >                                            
                                                    <Grid 
                                                        item                                                         
                                                        xs={3} 
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <TextField 
                                                            name="status"
                                                            value={values.status} 
                                                            label="Status" 
                                                            fullWidth                                 
                                                            variant="standard"                                                                                    
                                                            inputProps={
                                                                { readOnly: true, }
                                                            }
                                                        />  
                                                    </Grid>
                                                    <Grid 
                                                        item                                                         
                                                        xs={3}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <TextField 
                                                            name="status"
                                                            value={dayjs(values.creationDate).format('DD/MM/YYYY')} 
                                                            label="Data utworzenia" 
                                                            fullWidth                                 
                                                            variant="standard"                                                                                    
                                                            inputProps={
                                                                { readOnly: true, }
                                                            }
                                                        />   
                                                    </Grid>
                                                    <Grid 
                                                        item                                                         
                                                        xs={3}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <TextField 
                                                            name="type"
                                                            value={values.requestType} 
                                                            label="Typ" 
                                                            fullWidth                                 
                                                            variant="standard"                                                                                    
                                                            inputProps={
                                                                { readOnly: true, }
                                                            }
                                                        />  
                                                    </Grid>                                            
                                                    <Grid 
                                                        item 
                                                        xs={3}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <TextField 
                                                            name="type"
                                                            value={values.submitType} 
                                                            label="Źródło" 
                                                            fullWidth                                 
                                                            variant="standard"                                                                                    
                                                            inputProps={
                                                                { readOnly: true, }
                                                            }
                                                        />  
                                                    </Grid>                                                    
                                                </Grid>  
                                            </Grid>
                                        </Grid>                                  
                                    </Grid>
                                    {/* Buttons grid */}
                                    <Grid                             
                                        item 
                                        xs={12} 
                                        sm={12} 
                                        md={2}
                                        sx={{                                
                                            alignSelf: 'flex-start',
                                            [theme.breakpoints.down('md')]: {
                                                alignSelf: 'flex-end'
                                            },  
                                        }}
                                    >
                                        <Button                                 
                                            variant="contained"
                                            disableElevation 
                                            disabled={isSubmitting}
                                            onClick={() => handleSubmit()}                                
                                            startIcon={<CheckIcon />}
                                            sx={{
                                                display: 'inline-flex',                                                                        
                                                width: '100%', 
                                                height: 40                                   
                                            }}
                                        >
                                            Podejmij zlecenie
                                        </Button>
                                        <Button                                 
                                            variant="contained"
                                            disableElevation 
                                            disabled={!request.id || isSubmitting}
                                            onClick={() => handleDelete()}                                
                                            startIcon={<BadgeIcon />}
                                            sx={{
                                                display: 'inline-flex',                                                                        
                                                width: '100%', 
                                                height: 40,
                                                marginTop: '4px',
                                                [theme.breakpoints.down('sm')]: {
                                                    marginTop: '1px',
                                                },
                                            }}
                                        >
                                            Przydziel osoby
                                        </Button>                                                                               
                                    </Grid>                                    
                                </Grid>
                            )
                        }}
                    </Formik>  
                </CardContent>
            </Card>
            {/* Klienci */}
            <Card                 
                variant="outlined"
                sx={{  
                    mt: 1.5,  
                    height: `calc(100% - ${mainCardHeight}px)`,
                    //height: '50%',
                    [theme.breakpoints.down('sm')]: {
                        border: 'none' 
                    },                     
                }}
            >                
                <CardContent sx={{                    
                    display: 'flex',                            
                    height: '100%',
                    '&:last-child': { 
                        paddingBottom: 1 
                    },
                    [theme.breakpoints.down('md')]: {
                        padding: 1,
                        '&:last-child': { 
                            paddingBottom: 1 
                        }
                    },                                                                                                                
                }}>                     
                    <Grid 
                        container 
                        spacing={{ xs: 0, md: 2 }}   
                        // sx={{
                        //     backgroundColor: 'yellow',
                        // }}                     
                    >
                        <Grid 
                            item 
                            xs={12} 
                            sm={12} 
                            md={10} 
                            // sx={{
                            //     backgroundColor: 'aqua',                                                            
                            // }}
                        >
                            <Typography 
                                id="company-datagrid-card-title" 
                                className="card-title" 
                                component="div">
                                Klienci
                            </Typography>    
                            
                        </Grid>
                        <Grid 
                            item 
                            xs={12} 
                            sm={12} 
                            md={2}
                            sx={{
                                alignSelf: 'flex-start',
                                [theme.breakpoints.down('md')]: {
                                    alignSelf: 'flex-end',
                                },  
                            }}
                        >
                            <Button                                 
                                variant="contained"                                
                                disableElevation 
                                startIcon={<AddIcon />}
                                sx={{
                                    display: 'inline-flex',                                                                        
                                    width: '100%', 
                                    height: 40                                   
                                }}
                            >
                                Dodaj
                            </Button>                            
                        </Grid>
                    </Grid> 
                </CardContent>
            </Card>            
        </Box>
    );
}

