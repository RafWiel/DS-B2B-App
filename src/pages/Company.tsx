/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Grid, TextField } from "@mui/material";
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

    
    const postalRegExp = /^[0-9]{2}-[0-9]{3}$/
    
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
        
        return () => {            
            abortController.abort();            
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

            console.log('load:', JSON.stringify(res, null, 2));
            
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

        console.log('submit', company.id);
        console.log('handleSubmit:', JSON.stringify(company, null, 2)); 
                        
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
                variant="outlined"
                sx={{    
                    height: '100%',                        
                    [theme.breakpoints.down('sm')]: {
                        border: 'none' 
                    },                     
                }}
            >
                <CardContent sx={{                    
                    display: 'flex',                            
                    height: '100%',
                    [theme.breakpoints.down('md')]: {
                        padding: 1,
                        '&:last-child': { 
                            paddingBottom: 1 
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
                                        <Grid                                         
                                            container 
                                            spacing={2}
                                            // sx={{                                                
                                            //     backgroundColor: 'gainsboro',                                                                                                                                           
                                            // }}
                                        >
                                            <Grid item sm={4} xs={6}>
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
                                                marginTop: '16px',
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
        </Box>
    );
});

export default Company;