/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useAppStore } from "../store";
import { IEmployee } from '../interfaces/IEmployee.ts';
import { useLocation, useRoute } from "wouter";
import { config } from "../config/config";
import employeeType from "../enums/employeeType.ts";
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as yup from 'yup';
import boolEnum from "../enums/boolEnum.ts";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { IIdResponse } from "../interfaces/IIdResponse.ts";

const Employee = memo(() => {
    const theme = useTheme();  
    const setAppBarTitle = useAppStore((state) => state.setAppBarTitle);       
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const openAutoMessageDialog = useAppStore((state) => state.openAutoMessageDialog); 
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const [, params] = useRoute("/employees/:id");
    const [, navigate] = useLocation();    
    const abortController = useRef(new AbortController()).current;      

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const schema = yup.object().shape({                                        
        type: yup.number().required().min(employeeType.administrator, 'Podaj typ').max(employeeType.employee, 'Podaj typ'),
        login: yup.string().required('Podaj login'),
        name: yup.string().required('Podaj imię i nazwisko'),
        phoneNumber: yup.string().required('Podaj numer telefonu').matches(phoneRegExp, 'Nieprawidłowy numer telefonu'),
        email: yup.string().required('Podaj e-mail').email('Nieprawidłowy e-mail'),
        isMailing: yup.boolean().required(),                        
    });

    const [employee, setEmployee] = useState<IEmployee>({         
        id: Number(params?.id),        
        type: employeeType.none,
        login: '',
        name: '',
        phoneNumber: '',
        email: '',
        isMailing: false
    }); 

    useEffect(() => {                        
        setAppBarTitle('Pracownik');   
        fetchData();                
        
        return () => {            
            abortController.abort();            
        }
    }, []);
    
    const fetchData = useCallback(() => {
        if (!employee.id) return;
               
        showLoadingIcon(true);
        
        fetch(`${config.API_URL}/employees/${employee.id}`, { signal: abortController.signal })      
        .then((res: Response) => {           
            if (!res.ok) {
                throw new Error("Nieprawidłowa odpowiedź serwera");                       
            }
            //res = JSON.parse(JSON.stringify(res).replace(/\:null/gi, "\:\"\""));

            return res.json();
        })
        .then((res: IEmployee) => {                                                                 
            setEmployee(res);                        

            console.log('load:', JSON.stringify(res, null, 2));
            
            setAppBarTitle(`Pracownik ${res.name}`);        
        })
        .catch((error: unknown) => {
            if ((error as Error).name === 'AbortError') return;
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error as Error).message
            });

            navigate('/employees');
        })
        .finally(() => showLoadingIcon(false));         
    }, [employee.id]);
    
    const handleSubmit = useCallback((employee: IEmployee, { setSubmitting }: FormikHelpers<IEmployee>) => {                     
        showLoadingIcon(true);

        console.log('submit', employee.id);
        console.log('handleSubmit:', JSON.stringify(employee, null, 2)); 
                        
        fetch(`${config.API_URL}/employees`, {
            method: !employee.id ? 'POST' : 'PUT',            
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employee),
            signal: abortController.signal 
        })       
            .then((res) => {                
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Nie znaleziono użytkownika w bazie danych');
                    }

                    if (res.status === 409) {
                        throw new Error('Użytkownik o takich danych już istnieje');
                    }

                    throw new Error('Nieprawidłowa odpowiedź serwera');
                }

                return res.json();             
            })      
            .then((res: IIdResponse) => {                                              
                setEmployee({...employee, id: res.id});

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
    }, [employee.id]);
    
    const handleDelete = () => {        
        openQuestionDialog({
            title: 'Pracownik',
            text: `Czy na pewno usunąć pracownika ${employee.name}?`,            
            action: deleteSingle,
            actionParameters: employee.id
        });
    }

    const deleteSingle = (id: number) => {
        showLoadingIcon(true);       
        
        fetch(`${config.API_URL}/employees/${id}`, { method: 'DELETE' })              
            .then((res) => {           
                if (!res.ok) throw new Error('Nieudane usunięcie pracownika');    
            
                navigate('/employees');
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
                        initialValues={employee}
                        validationSchema={schema} 
                        validateOnChange={true}
                        validateOnBlur={true}           
                        onSubmit={handleSubmit}>                    
                        {(props: FormikProps<IEmployee>) => {
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
                                                    error={touched?.login && !!errors?.login}
                                                    helperText={touched?.login && errors?.login}
                                                    name="login"                                                    
                                                    value={values.login} 
                                                    label="Login" 
                                                    onChange={handleChange}                                                                              
                                                    fullWidth                                 
                                                    variant="standard"                                                                                     
                                                    // inputProps={{ style: { fontSize: '14px' } }}
                                                />  
                                            </Grid>
                                            <Grid item sm={4} xs={6}>
                                                <TextField 
                                                    error={touched?.name && !!errors?.name}
                                                    helperText={touched?.name && errors?.name}
                                                    name="name"                                                    
                                                    value={values.name} 
                                                    label="Imię i nazwisko" 
                                                    onChange={handleChange}                                                     
                                                    fullWidth                                 
                                                    variant="standard"                                 
                                                />  
                                            </Grid>
                                            <Grid item sm={4} xs={6}>
                                                <TextField 
                                                    error={touched?.email && !!errors?.email}
                                                    helperText={touched?.email && errors?.email}           
                                                    name="email"                                                    
                                                    value={values.email} 
                                                    label="e-mail" 
                                                    onChange={handleChange}                                                               
                                                    fullWidth                                 
                                                    variant="standard"                                 
                                                />  
                                            </Grid>                                            
                                            <Grid item sm={4} xs={6}>
                                                <TextField 
                                                    error={touched?.phoneNumber && !!errors?.phoneNumber}
                                                    helperText={touched?.phoneNumber && errors?.phoneNumber}                        
                                                    name="phoneNumber"                                                    
                                                    value={values.phoneNumber} 
                                                    label="Numer telefonu" 
                                                    onChange={handleChange}                                                     
                                                    fullWidth                                 
                                                    variant="standard"                                 
                                                />  
                                            </Grid>
                                            <Grid item sm={4} xs={6}>
                                                <FormControl 
                                                    error={touched?.type && !!errors?.type}
                                                    variant="standard" 
                                                    fullWidth 
                                                >
                                                    <InputLabel id="type">Typ</InputLabel>
                                                    <Select
                                                        displayEmpty                                                        
                                                        labelId="type"
                                                        name="type"
                                                        value={values.type}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            employeeType && employeeType.items                                                                   
                                                                .map((item) => (
                                                                    <MenuItem key={item.id} value={item.id}>{item.text}&nbsp;</MenuItem>                                    
                                                                ))
                                                        }                                
                                                    </Select>
                                                    <FormHelperText>
                                                        {touched?.type && errors?.type}
                                                    </FormHelperText>
                                                </FormControl>   
                                            </Grid>
                                            <Grid item sm={4} xs={6}>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel id="isMailing">Powiadomienia e-mail</InputLabel>
                                                    <Select                                                        
                                                        labelId="isMailing"
                                                        name="isMailing"
                                                        value={Number(values.isMailing)}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            boolEnum && boolEnum.items                                      
                                                                .map((item) => (
                                                                    <MenuItem key={item.id} value={item.id}>{item.text}</MenuItem>                                    
                                                                ))
                                                        }                                
                                                    </Select>
                                                </FormControl>   
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
                                            disabled={!employee.id}
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
                                            disabled={!employee.id}
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
                            );
                        }}
                    </Formik>  
                </CardContent>
            </Card>
        </Box>
    );
});

export default Employee;