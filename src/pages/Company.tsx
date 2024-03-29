import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Grid, TextField, Typography, useMediaQuery } from "@mui/material";
import { useAppStore } from "../store.ts";
import { ICompany } from '../interfaces/ICompany.ts';
import { useLocation, useRoute } from "wouter";
import { config } from "../config/config.ts";
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as yup from 'yup';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { IIdResponse } from "../interfaces/IIdResponse.ts";
import '../assets/card.css';
import { DataGrid, IBaseRow, IColumn, IDataGridRef } from "../components/DataGrid.tsx";
import { ICustomer } from "../interfaces/ICustomer.ts";
import useApi from '../hooks/useApi.ts';

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

export const Company = () => {
    const theme = useTheme();  
    const setAppBarTitle = useAppStore((state) => state.setAppBarTitle);       
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const openAutoMessageDialog = useAppStore((state) => state.openAutoMessageDialog); 
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const [, params] = useRoute("/companies/:id");
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

    const [company, setCompany] = useState<ICompany>({         
        id: Number(params?.id),                        
        name: '',
        erpId: 0,
        taxNumber: '',
        address: '',
        postal: '',
        city: '',
        customers: new Array<ICustomer>()
    }); 

    useEffect(() => {                        
        setAppBarTitle('Firma');   
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
        if (!company.id) return;
               
        showLoadingIcon(true);
        
        api.get(`${config.API_URL}/companies/${company.id}`, { 
            signal: abortController.signal 
        })              
        .then((res) => {                        
            setCompany(res.data);  
            setAppBarTitle(`Firma ${res.data.name}`);        
        })
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;
            
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: `${error.response.status} - Nieprawidłowa odpowiedź serwera`
            });

            navigate('/companies');
        })
        .finally(() => showLoadingIcon(false));         
    }
    
    const handleSubmit = (company: ICompany, { setSubmitting }: FormikHelpers<ICompany>) => {                     
        showLoadingIcon(true);        

        //console.log('submit', company.id);
        console.log('handleSubmit:', JSON.stringify(company, null, 2)); 
                 
        //nie wysylaj klientow, dane sa niepelne i nie przechodza walidacji
        const clone = {...company};
        clone.customers = new Array<ICustomer>();

        api(`${config.API_URL}/companies`, {
            method: !company.id ? 'POST' : 'PUT',            
            headers: { "Content-Type": "application/json" },
            data: clone,
            signal: abortController.signal 
        })       
        .then((res) => {                           
            const response = res.data as IIdResponse;

            setCompany({...company, id: response.id});
            setUrl(response.id);

            openAutoMessageDialog({
                title: 'Firma',
                text: 'Zapisano',
                delay: 1000
            });           
        })      
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;

            let errorMessage = 'Nieprawidłowa odpowiedź serwera';
            
            if (error.response.status === 404) {
                errorMessage = 'Nie znaleziono firmy w bazie danych';
            }

            if (error.response.status === 409) {
                errorMessage = 'Firma o takich danych już istnieje';
            }

            openMessageDialog({
                title: 'Błąd aplikacji',
                text: `${error.response.status} - ${errorMessage}`
            });
        })        
        .finally(() => {           
            setSubmitting(false);  
            showLoadingIcon(false);            
        });
    }
    
    const setUrl = (id: number) => {
        const url = `/companies/${id}`;
        
        window.history.replaceState(null, '', url);
    }

    const handleDelete = () => {        
        openQuestionDialog({
            title: 'Firma',
            text: `Czy na pewno usunąć firmę ${company.name}?`,            
            action: deleteSingle,
            actionParameters: company.id
        });
    }

    const deleteSingle = async (id: number) => {
        const result = await deleteAsync(`${config.API_URL}/companies/${id}`, 'Nieudane usunięcie firmy');        
        if (!result) {            
            return;
        }

        navigate('/companies');
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
                text: `${error.response.status} - ${errorMessage}`                
            });

            return false;
        })
        .finally(() => {
            showLoadingIcon(false);                        
        });   
    
        //console.log('result', result);
        return result;
    }, [abortController.signal, api, openMessageDialog, showLoadingIcon]); 

    const deleteSingleCustomer = useCallback(async (id: number) => {
        const result = await deleteAsync(`${config.API_URL}/customers/${id}`, 'Nieudane usunięcie pracownika');        
        if (!result) {            
            return;
        }

        setCompany({...company, customers: company.customers.filter(u => u.id !== id)} );   
    }, [company, deleteAsync]);

    const handleDeleteCustomer = useCallback((row: object) => {    
        const customer = row as ICustomerRow;
        
        openQuestionDialog({
            title: 'Firma',
            text: `Czy na pewno usunąć pracownika ${customer.name}?`,            
            action: deleteSingleCustomer,
            actionParameters: customer.id
        });
    }, [deleteSingleCustomer, openQuestionDialog]);

    const deleteAllCustomers = useCallback(async () => {
        const result = await deleteAsync(`${config.API_URL}/companies/${company.id}/customers`, 'Nieudane usunięcie wszystkich pracowników');        
        if (!result) {            
            return;
        }

        setCompany({...company, customers: new Array<ICustomer>() });           
    }, [company, deleteAsync]);

    const handleDeleteAllCustomers = useCallback(() => {        
        openQuestionDialog({
            title: 'Firma',
            text: 'Czy na pewno usunąć wszystkich pracowników?',
            action: deleteAllCustomers,
        });
    }, [deleteAllCustomers, openQuestionDialog]);            

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
                        initialValues={company}
                        validationSchema={schema} 
                        validateOnChange={true}
                        validateOnBlur={true}           
                        onSubmit={handleSubmit}>                    
                        {(props: FormikProps<ICompany>) => {
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
                                        //     backgroundColor: 'aqua',                                
                                        // }}
                                    >      
                                        <Typography className="card-title" component="div">
                                            Firma
                                        </Typography>                                
                                        <Grid                                         
                                            container 
                                            spacing={2}
                                            
                                        >                                            
                                            <Grid 
                                                item 
                                                sm={4} 
                                                xs={6} 
                                                sx={{ mt: 1 }}
                                            >
                                                <TextField 
                                                    error={touched?.name && !!errors?.name}
                                                    helperText={touched?.name && errors?.name}
                                                    name="name"                                                    
                                                    value={values.name} 
                                                    label="Nazwa" 
                                                    onChange={handleChange}                                                                              
                                                    fullWidth                                 
                                                    variant="standard"                                                                                    
                                                    // inputProps={{ style: { fontSize: '14px' } }}
                                                />  
                                            </Grid>
                                            <Grid 
                                                item 
                                                sm={4} 
                                                xs={6}
                                                sx={{ mt: 1 }}
                                            >
                                                <TextField 
                                                    error={touched?.erpId && !!errors?.erpId}
                                                    helperText={touched?.erpId && errors?.erpId}
                                                    name="erpId"                                                    
                                                    value={values.erpId} 
                                                    label="ERP Id" 
                                                    onChange={handleChange}                                                     
                                                    fullWidth                                 
                                                    variant="standard"                                 
                                                />  
                                            </Grid>
                                            <Grid 
                                                item 
                                                sm={4} 
                                                xs={6}
                                                sx={{ mt: 1 }}
                                            >
                                                <TextField 
                                                    error={touched?.taxNumber && !!errors?.taxNumber}
                                                    helperText={touched?.taxNumber && errors?.taxNumber}           
                                                    name="taxNumber"                                                    
                                                    value={values.taxNumber} 
                                                    label="NIP" 
                                                    onChange={handleChange}                                                               
                                                    fullWidth                                 
                                                    variant="standard"                                 
                                                />  
                                            </Grid>                                            
                                            <Grid item sm={4} xs={6}>
                                                <TextField 
                                                    error={touched?.address && !!errors?.address}
                                                    helperText={touched?.address && errors?.address}                        
                                                    name="address"                                                    
                                                    value={values.address} 
                                                    label="Adres" 
                                                    onChange={handleChange}                                                     
                                                    fullWidth                                 
                                                    variant="standard"                                 
                                                />  
                                            </Grid>
                                            <Grid item sm={4} xs={6}>
                                                <TextField 
                                                    error={touched?.postal && !!errors?.postal}
                                                    helperText={touched?.postal && errors?.postal}                        
                                                    name="postal"                                                    
                                                    value={values.postal} 
                                                    label="Kod pocztowy" 
                                                    onChange={handleChange}                                                     
                                                    fullWidth                                 
                                                    variant="standard"                                 
                                                />  
                                            </Grid>
                                            <Grid item sm={4} xs={6}>
                                                <TextField 
                                                    error={touched?.city && !!errors?.city}
                                                    helperText={touched?.city && errors?.city}                        
                                                    name="city"                                                    
                                                    value={values.city} 
                                                    label="Miasto" 
                                                    onChange={handleChange}                                                     
                                                    fullWidth                                 
                                                    variant="standard"                                 
                                                />  
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
                                            Zapisz
                                        </Button>
                                        <Button                                 
                                            variant="contained"
                                            disableElevation 
                                            disabled={!company.id || isSubmitting}
                                            onClick={() => handleDelete()}                                
                                            startIcon={<ClearIcon />}
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
                                            Usuń
                                        </Button>
                                        <Button                                 
                                            variant="contained"
                                            disableElevation 
                                            disabled={!company.id || isSubmitting}
                                            // onClick={() => fetchNextData()}                                
                                            startIcon={<VpnKeyIcon />}
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
                                            Zresetuj hasło
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
                            <DataGrid                             
                                ref={dataGridRef}
                                columns={columns}
                                rows={company.customers}
                                isSelection={false}
                                isDelete={true}
                                maxHeight={dataGridHeight}                              
                                deleteRow={handleDeleteCustomer}
                                deleteAllRows={handleDeleteAllCustomers} 
                                fetchNextData={() => void 0}        
                                setSorting={() => void 0}
                                onRowClick={(id: number) => navigate(`/customers/${id}`)}
                            />
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
                                disabled={!company.id}
                                onClick={() => navigate(`/companies/${company.id}/customers/0`)} 
                                //startIcon={<AddIcon />}
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

