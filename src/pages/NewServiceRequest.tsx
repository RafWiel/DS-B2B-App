/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useAppStore } from "../store.ts";
import { useLocation, useRoute } from "wouter";
import { config } from '../config/config.ts';
import { customerType } from '../enums/customerType.ts';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as yup from 'yup';
import CheckIcon from '@mui/icons-material/Check';
import { IIdResponse } from "../interfaces/IIdResponse.ts";
import '../assets/card.css';
import { IList } from "../interfaces/IList.ts";
import { useFetch } from "../hooks/useFetch.ts";
import { useApi } from '../hooks/useApi.ts';
import { INewServiceRequest } from "../interfaces/INewServiceRequest.ts";
import { serviceRequestType } from "../enums/serviceRequestType.ts";
import { serviceRequestSubmitType } from "../enums/serviceRequestSubmitType.ts";
import { ICustomer } from "../interfaces/ICustomer.ts";
import { softwareProductType } from "../enums/softwareProductType.ts";
import { softwareModuleType } from "../enums/softwareModuleType.ts";

export const NewServiceRequest = () => {
    const theme = useTheme();  
    const setAppBarTitle = useAppStore((state) => state.setAppBarTitle);       
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const openAutoMessageDialog = useAppStore((state) => state.openAutoMessageDialog); 
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const [, params] = useRoute("/customers/:id/service-request");    
    const [, navigate] = useLocation();    
    const abortController = useRef(new AbortController()).current;     
    const api = useApi();    
    const customer = useFetch<ICustomer>(`${config.API_URL}/customers/${Number(params?.id)}`, 'Nieudane pobranie danych klienta'); 

    //console.log('company id', companyParams?.companyId);
    //console.log('customer id', companyParams?.id);
    //console.log('id', params?.id);

    const schema = yup.object().shape({                                        
        topic: yup.string().required('Podaj tytuł'),
        description: yup.string(),
        requestType: yup.number().required('Wybierz typ').min(serviceRequestType.min, 'Wybierz typ').max(serviceRequestType.max, 'Wybierz typ'),
        submitType: yup.number().required('Wybierz źródło').min(serviceRequestSubmitType.min, 'Wybierz źródło').max(serviceRequestSubmitType.max, 'Wybierz źródło'),
        softwareProduct: yup.number().required('Wybierz produkt').min(softwareProductType.min, 'Wybierz produkt').max(softwareProductType.max, 'Wybierz produkt'),
    });

    const [request, setRequest] = useState<INewServiceRequest>({         
        id: 0,
        customerId: Number(params?.id),  
        topic: '',        
        description: '',        
        requestType: 0,
        submitType: 0,  
        softwareProduct: 0,
        softwareModule: 0,
        softwareVersion: '',
        softwareOS: 0,  
    }); 

    useEffect(() => {                        
        setAppBarTitle('Nowe zlecenie serwisowe');   
        
        return () => {            
            abortController.abort();            
        }
    }, []);        
    
    const handleSubmit = (request: INewServiceRequest, { setSubmitting }: FormikHelpers<INewServiceRequest>) => {                     
        showLoadingIcon(true);

        //console.log('submit', customer.id);
        console.log('handleSubmit:', JSON.stringify(request, null, 2)); 
                        
        api(`${config.API_URL}/service-requests`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            data: request,
            signal: abortController.signal 
        })       
        .then((res) => {                            
            const response = res.data as IIdResponse;

            setRequest({...request, id: response.id});            

            //todo wyjdz

            openAutoMessageDialog({
                title: 'Nowe zlecenie serwisowe',
                text: 'Zapisano',
                delay: 1000
            });     
            
            setTimeout(() => {
                navigate(`/customers/${Number(params?.id)}`);
            }, 1000);
        })              
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;            
                        
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error.response ? `${error.response.status} - ` : '') + 'Nieudany zapis danych zlecenia'
            });
        })        
        .finally(() => {           
            setSubmitting(false);  
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
                    <Formik
                        enableReinitialize={true}
                        initialValues={request}
                        validationSchema={schema} 
                        validateOnChange={true}
                        validateOnBlur={true}           
                        onSubmit={handleSubmit}>                    
                        {(props: FormikProps<INewServiceRequest>) => {
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
                                                        xs={4}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <FormControl 
                                                            error={touched?.requestType && !!errors?.requestType}
                                                            variant="standard" 
                                                            fullWidth 
                                                        >
                                                            <InputLabel id="requestType">Typ</InputLabel>
                                                            <Select
                                                                displayEmpty                                                        
                                                                labelId="requestType"
                                                                name="requestType"
                                                                value={values.requestType}
                                                                onChange={handleChange}
                                                            >
                                                                {
                                                                    serviceRequestType && serviceRequestType.items                                                                   
                                                                        .map((item) => (
                                                                            <MenuItem key={item.id} value={item.id}>{item.text}&nbsp;</MenuItem>                                    
                                                                        ))
                                                                }                                
                                                            </Select>
                                                            <FormHelperText>
                                                                {errors?.requestType}
                                                            </FormHelperText>
                                                        </FormControl>   
                                                    </Grid>                                          
                                                    <Grid 
                                                        item 
                                                        xs={4}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <FormControl 
                                                            error={touched?.submitType && !!errors?.submitType}
                                                            variant="standard" 
                                                            fullWidth 
                                                        >
                                                            <InputLabel id="submitType">Źródło</InputLabel>
                                                            <Select
                                                                displayEmpty                                                        
                                                                labelId="submitType"
                                                                name="submitType"
                                                                value={values.submitType}
                                                                onChange={handleChange}
                                                            >
                                                                {
                                                                    serviceRequestSubmitType && serviceRequestSubmitType.items                                                                   
                                                                        .map((item) => (
                                                                            <MenuItem key={item.id} value={item.id}>{item.text}&nbsp;</MenuItem>                                    
                                                                        ))
                                                                }                                
                                                            </Select>
                                                            <FormHelperText>
                                                                {errors?.submitType}
                                                            </FormHelperText>
                                                        </FormControl>   
                                                    </Grid>  
                                                    <Grid 
                                                        item                                                         
                                                        xs={4} 
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <TextField 
                                                            name="customer"
                                                            value={customer?.name} 
                                                            label="Klient" 
                                                            fullWidth                                 
                                                            variant="standard"                                                                                    
                                                            inputProps={
                                                                { readOnly: true, }
                                                            }
                                                        />  
                                                    </Grid>



                                                    <Grid 
                                                        item 
                                                        xs={4}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <FormControl 
                                                            error={touched?.softwareProduct && !!errors?.softwareProduct}
                                                            variant="standard" 
                                                            fullWidth 
                                                        >
                                                            <InputLabel id="softwareProduct">Product</InputLabel>
                                                            <Select
                                                                displayEmpty                                                        
                                                                labelId="softwareProduct"
                                                                name="softwareProduct"
                                                                value={values.softwareProduct}
                                                                onChange={handleChange}
                                                            >
                                                                {
                                                                    softwareProductType && softwareProductType.items
                                                                    .sort((a, b) => a.text.localeCompare(b.text))                                                                     
                                                                        .map((item) => (
                                                                            <MenuItem key={item.id} value={item.id}>{item.text}&nbsp;</MenuItem>                                    
                                                                        ))
                                                                }                                
                                                            </Select>
                                                            <FormHelperText>
                                                                {errors?.softwareProduct}
                                                            </FormHelperText>
                                                        </FormControl>   
                                                    </Grid> 
                                                    <Grid 
                                                        item 
                                                        xs={4}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <FormControl 
                                                            error={touched?.softwareModule && !!errors?.softwareModule}
                                                            variant="standard" 
                                                            fullWidth 
                                                        >
                                                            <InputLabel id="softwareModule">Moduł</InputLabel>
                                                            <Select
                                                                displayEmpty                                                        
                                                                labelId="softwareModule"
                                                                name="softwareModule"
                                                                value={values.softwareModule}
                                                                onChange={handleChange}
                                                            >
                                                                {
                                                                    softwareModuleType && softwareModuleType.items
                                                                        .filter(u => u.productId.includes(values.softwareProduct))  
                                                                        .sort((a, b) => a.text.localeCompare(b.text))       
                                                                        .map((item) => (
                                                                            <MenuItem key={item.id} value={item.id}>{item.text}&nbsp;</MenuItem>                                    
                                                                        ))
                                                                }                                
                                                            </Select>
                                                            <FormHelperText>
                                                                {errors?.softwareModule}
                                                            </FormHelperText>
                                                        </FormControl>   
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
                                            disabled={isSubmitting}
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
                                    </Grid>                                    
                                </Grid>
                            );
                        }}
                    </Formik>  
                </CardContent>
            </Card>
        </Box>
    );
}