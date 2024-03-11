/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useEffect, useRef, useState } from "react";
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
import { ICustomer } from "../interfaces/ICustomer.ts";
import '../assets/card.css';
import DataGrid, { IBaseRow, IColumn, IDataGridRef } from "../components/DataGrid.tsx";

interface ICustomerRow extends IBaseRow {
    name: string;
    phoneNumber: string;    
}

const columns: IColumn[] = [
    {
        id: 'id',
        label: 'Id',
        numeric: true,
        disablePadding: false,        
        visible: false,
        width: {
            mobile: '0',
            desktop: '0'
        }
    },
    {
        id: 'login',
        label: 'Login',
        numeric: false,
        disablePadding: true,        
        visible: true,
        width: {
            mobile: '170px',
            desktop: '170px'
        }
    },
    {
        id: 'name',
        label: 'Imię i nazwisko',
        numeric: false,
        disablePadding: false,        
        visible: true,
        width: {
            mobile: '190px',
            desktop: '190px'
        }
    },
    {
        id: 'phoneNumber',
        label: 'Numer telefonu',
        numeric: false,
        disablePadding: false,        
        visible: true,
        width: {
            mobile: '170px',
            desktop: '170px'
        }
    },
    {
        id: 'type',
        label: 'Typ',
        numeric: false,
        disablePadding: false,        
        visible: true,
        width: {
            mobile: 'auto',
            desktop: 'auto'
        }
    },
];

const Company = memo(() => {
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
    const postalRegExp = /^[0-9]{2}-[0-9]{3}$/
    const [customers, setCustomers] = useState<Array<ICustomerRow>>([]);

    const schema = yup.object().shape({                                                    
        name: yup.string().required('Podaj nazwę'),
        erpId: yup.number().required('Podaj ERP Id'),
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
        customers: []
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
    
    const fetchData = useCallback(() => {
        if (!company.id) return;
               
        showLoadingIcon(true);
        
        fetch(`${config.API_URL}/companies/${company.id}`, { signal: abortController.signal })      
        .then((res: Response) => {           
            if (!res.ok) {
                throw new Error("Nieprawidłowa odpowiedź serwera");                       
            }
            
            return res.json();
        })
        .then((res: ICompany) => {                                                                 
            setCompany(res);                        

            //console.log('load:', JSON.stringify(res, null, 2));
            
            setAppBarTitle(`Firma ${res.name}`);        
        })
        .catch((error: unknown) => {
            if ((error as Error).name === 'AbortError') return;
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error as Error).message
            });

            navigate('/companies');
        })
        .finally(() => showLoadingIcon(false));         
    }, [company.id]);
    
    const handleSubmit = useCallback((company: ICompany, { setSubmitting }: FormikHelpers<ICompany>) => {                     
        showLoadingIcon(true);        

        //console.log('submit', company.id);
        //console.log('handleSubmit:', JSON.stringify(company, null, 2)); 
                        
        fetch(`${config.API_URL}/companies`, {
            method: !company.id ? 'POST' : 'PUT',            
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(company),
            signal: abortController.signal 
        })       
            .then((res) => {                
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Nie znaleziono firmy w bazie danych');
                    }

                    if (res.status === 409) {
                        throw new Error('Firma o takich danych już istnieje');
                    }

                    throw new Error('Nieprawidłowa odpowiedź serwera');
                }

                return res.json();             
            })      
            .then((res: IIdResponse) => {                                              
                setCompany({...company, id: res.id});

                openAutoMessageDialog({
                    title: 'Komunikat',
                    text: 'Zapisano',
                    delay: 1000
                });
            })
            .catch((error: unknown) => {
                if ((error as Error).name === 'AbortError') return;
                openMessageDialog({
                    title: 'Błąd aplikacji',
                    text: (error as Error).message
                });
            })        
            .finally(() => {           
                setSubmitting(false);  
                showLoadingIcon(false);            
            });
    }, [company.id]);
    
    const handleDelete = () => {        
        openQuestionDialog({
            title: 'Firma',
            text: `Czy na pewno usunąć firmę ${company.name}?`,            
            action: deleteSingle,
            actionParameters: company.id
        });
    }

    const deleteSingle = (id: number) => {
        showLoadingIcon(true);       
        
        fetch(`${config.API_URL}/companies/${id}`, { method: 'DELETE' })              
            .then((res) => {           
                if (!res.ok) throw new Error('Nieudane usunięcie firmy');    
            
                navigate('/companies');
            })        
            .catch((error: unknown) => {
                if ((error as Error).name === 'AbortError') return;
                
                openMessageDialog({
                    title: 'Błąd aplikacji',
                    text: (error as Error).message
                });

                return false;
            })
            .finally(() => {
                showLoadingIcon(false);                        
            });               
    }    

    const handleResize = () => {  
        //console.log('height', document.getElementById('main-company-card')?.clientHeight);          

        setMainCardHeight(document.getElementById('main-company-card')?.clientHeight ?? 0);    
        
        const appBarHeight = document.getElementById("appBar")?.clientHeight ?? 0;
        const filterHeight = document.getElementById("filter-container")?.clientHeight ?? 0;
        const datagridMargin = isMobileView ? 74 : 42;  
        const mainMargin = 12;  

        setDataGridHeight(window.innerHeight - appBarHeight - filterHeight - mainMargin * 3 - datagridMargin);                    
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
            <Card
                id="main-company-card" 
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
                                            <Grid item sm={4} xs={6}>
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
                                            <Grid item sm={4} xs={6}>
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
                                            disabled={!company.id}
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
                                            disabled={!company.id}
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
            {/* Pracownicy */}
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
                        paddingBottom: 2 
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
                        spacing={2}
                        sx={{
                            //backgroundColor: 'gainsboro',                                                                                                                                           
                        }}
                    >
                        <Grid 
                            item 
                            xs={12} 
                            sm={12} 
                            md={10} 
                            // sx={{
                            //     //backgroundColor: 'aqua',
                            //     //flexGrow: 1,
                            //     //alignSelf: 'flex-start'
                            // }}
                        >
                            <DataGrid                             
                                ref={dataGridRef}
                                columns={columns}
                                rows={customers}
                                isSelection={false}
                                isDelete={true}
                                maxHeight={dataGridHeight}                              
                                deleteRow={handleDelete}
                                //deleteAllRows={handleDeleteAll} 
                                //fetchNextData={fetchNextData}        
                                //setSorting={setSorting}
                                onRowClick={(id: number) => navigate(`/customers/${id}`)}
                            />
                        </Grid>
                        <Grid 
                            item 
                            xs={12} 
                            sm={12} 
                            md={2}
                            sx={{
                                //backgroundColor: 'aqua',                                
                                alignSelf: 'flex-start',
                                [theme.breakpoints.down('md')]: {
                                    alignSelf: 'flex-end',
                                },  
                            }}
                        >
                            <Button                                 
                                variant="contained"
                                disableElevation 
                                onClick={() => navigate('/employees/0')} 
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
});

export default Company;