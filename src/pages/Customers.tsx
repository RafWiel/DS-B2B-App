import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { CustomersFilter } from "../components/CustomersFilter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DataGrid, IBaseRow, IColumn, IDataGridRef, Order } from "../components/DataGrid";
import { useAppStore } from "../store";
import { Button, Grid, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { config } from "../config/config";
import { customerType } from "../enums/customerType";
import debounce from 'lodash/debounce';
import queryString from 'query-string';
import { useLocation } from 'wouter';
import { useApi } from '../hooks/useApi.ts';

interface ICustomerRow extends IBaseRow {
    login: string;
    name: string;
    phoneNumber: string,
    companyName: string,
    type: string;    
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
        id: 'companyName',
        label: 'Firma',
        width: {
            mobile: '190px',
            desktop: '190px'
        }
    },
    {
        id: 'type',
        label: 'Typ',
        mobileHidden: true,
        width: {            
            desktop: 'auto'
        }
    },
];

type FetchState = {
    search: string,
    type: string,
    page: number,
    sortColumn: string | null,
    sortOrder: Order | null,
    isReset: boolean
}
  
export const Customers = () => {
    const theme = useTheme();     
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));           
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const dataGridRef = useRef<IDataGridRef>();
    const [customers, setCustomers] = useState<Array<ICustomerRow>>([]);
    const [, navigate] = useLocation();
    const abortController = useRef(new AbortController()).current;  
    const [dataGridHeight, setDataGridHeight] = useState(0);
    const api = useApi();    
    const setPreviousLocation = useAppStore((state) => state.setPreviousLocation); 
    const [location, ] = useLocation();  
    
    const [state, setState] = useState<FetchState>({
        search: '',
        type: customerType.none.toString(),
        page: 1,
        sortColumn: null,
        sortOrder: null,        
        isReset: true
    });
    
   
    //console.log('render', state.page);

    useEffect(() => {                    
        parseUrl();        
        handleResize();              
        window.addEventListener('resize', handleResize);
    
        return () => {
          showLoadingIcon(false);
          abortController.abort();
          debounceFetchData.cancel();    
          window.removeEventListener('resize', handleResize);      
        }
    }, []);    

    const debounceFetchData = useRef(
        debounce((stateValue: FetchState) => { 
            fetchData(stateValue); 
        }, 500)
    ).current;

    const fetchData = useCallback((stateValue: FetchState) => {                        
        //console.log('fetchData');
        //console.log('search: ', stateValue.search, ' | ', state.search);   
        //console.log('type: ', stateValue.type, ' | ', state.type);   
        //console.log('page: ', stateValue.page, ' | ', state.page);           
    
        setUrl(stateValue);        

        showLoadingIcon(true);       
    
        api.get(`${config.API_URL}/customers?${String(new URLSearchParams({ 
                search: stateValue.search,
                type: Number(stateValue.type) > customerType.none ? stateValue.type : '',
                'sort-column': stateValue.sortColumn ?? 'login',
                'sort-order': stateValue.sortOrder ?? 'asc',
                page: stateValue.page.toString()
            }))}`, { 
            signal: abortController.signal 
        })                      
        .then((res) => {              
            const newCustomers = res.data as Array<ICustomerRow>;
            if (newCustomers.length === 0 && 
                !stateValue.isReset) {
                return;
            }
            
            if (stateValue.isReset) {
                setCustomers(newCustomers);
            }
            else {
                setCustomers([...customers, ...newCustomers]); 
            }                      
        })
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;
            
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error.response ? `${error.response.status} - ` : '') + 'Nieudane pobranie listy klientów' 
            });
        })
        .finally(() => {
            showLoadingIcon(false);                        
        });    
    }, [customers, openMessageDialog, showLoadingIcon, abortController, api]);

    const setFilter = useCallback((search: string, type: string, isDebouncedUpdate: boolean) => {
        //console.log('setFilter');        
        //console.log('search', value);        
        //console.log('page', state.page);

        const newState = {
            ...state,             
            search: search,
            type: type,
            page: 1, 
            isReset: true
        };
        
        setState(newState);    
        
        if (isDebouncedUpdate) {
            debounceFetchData(newState);
        } else {
            fetchData(newState); 
        }
    }, [state, debounceFetchData, fetchData]);

    const fetchNextData = useCallback(() => {
        //console.log('fetchNextData');
        //console.log('search', state.search);
        //console.log('page', state.page);
        
        const newState = {
            ...state,             
            page: state.page + 1,
            isReset: false
        };        

        setState(newState);    
        fetchData(newState);
    }, [state, fetchData]);    

    const setSorting = useCallback((column: string, order: Order) => {
        //console.log('sorting: ', column, order);

        const newState = {
            ...state,             
            sortColumn: column,
            sortOrder: order,
            page: 1, 
            isReset: true
        };

        setState(newState);
        fetchData(newState);         
    }, [state, fetchData]);    

    const parseUrl = () => {
        const url = queryString.parse(location.search);
        //console.log(url);
        
        const newState: FetchState = {
            ...state,
            search: (url.search ?? '').toString(),
            type: (url.type ?? customerType.none).toString(),
            sortColumn: url['sort-column']?.toString() ?? null,
            sortOrder: url['sort-order']?.toString() as Order ?? null,        
            page: 1,            
            isReset: true
        };
        
        setState(newState);
        fetchData(newState);   
        
        dataGridRef.current?.updateSorting(newState.sortColumn, newState.sortOrder);
    }

    const setUrl = (stateValue: FetchState) => {
        let url = queryString.stringify({
            search: stateValue.search.length > 0 ? stateValue.search : null, 
            type: Number(stateValue.type) > customerType.none ? stateValue.type : null, 
            'sort-column': stateValue.sortColumn, 
            'sort-order': stateValue.sortOrder
        }, {
            skipNull: true
        });
        
        if (url.length > 0) {
            url = `/customers?${url}`;
        }

        window.history.replaceState(null, '', url);
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
    }, [api, abortController.signal, openMessageDialog, showLoadingIcon]); 

    const deleteSingle = useCallback(async (id?: number) => {
        const result = await deleteAsync(`${config.API_URL}/customers/${id}`, 'Nieudane usunięcie klienta');        
        if (!result) {            
            return;
        }

        setCustomers(customers.filter(u => u.id !== id));     
    }, [customers, deleteAsync]);

    const handleDelete = useCallback((row: object) => {
        const customer = row as ICustomerRow;

        openQuestionDialog({
            title: 'Klienci',
            text: `Czy na pewno usunąć klienta ${customer.name}?`,            
            action: deleteSingle,
            actionParameters: customer.id
        });
    }, [deleteSingle, openQuestionDialog]);

    const deleteAll = useCallback(async () => {
        const result = await deleteAsync(`${config.API_URL}/customers`, 'Nieudane usunięcie wszystkich klientów');        
        if (!result) {            
            return;
        }

        setCustomers([]);         
    }, [deleteAsync]);

    const handleDeleteAll = useCallback(() => {        
        openQuestionDialog({
            title: 'Klienci',
            text: 'Czy na pewno usunąć wszystkich klientów?',
            action: deleteAll,
            //actionParameters: [1, 2, 3]
        });
    }, [deleteAll, openQuestionDialog]);               

    const handleResize = () => {
        const appBarHeight = document.getElementById("appBar")?.clientHeight ?? 0;
        const filterHeight = document.getElementById("filter-container")?.clientHeight ?? 0;
        const datagridMargin = isMobileView ? 74 : 42;  
        const mainMargin = 12;  

        setDataGridHeight(window.innerHeight - appBarHeight - filterHeight - mainMargin * 3 - datagridMargin);        
        
        //console.log('isMobileView', isMobileView);
        //console.log('containerHeight', document.getElementById("main-container")?.clientHeight);
        //console.log('calculatedContainerHeight', window.innerHeight - appBarHeight);    
    }    

    const handleDataGridRowClick = (id: number) => {
        setPreviousLocation(location);
        navigate(`/customers/${id}`);
    }

    return (
        <Box 
            id="main-container"                   
            sx={{                
                width: 1,
                height: '100%',
                //maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                padding: {
                    xs: 0, 
                    sm: 1.5
                }
            }}
        >
            <div id="filter-container">
                <CustomersFilter 
                    search={state.search}
                    type={state.type}
                    setFilter={setFilter}
                />
            </div>
            <Card 
                variant="outlined"
                sx={{    
                    marginTop: 1.5, 
                    height: '100%', 
                    //maxHeight: '50vh',                   
                    [theme.breakpoints.down('sm')]: {
                        border: 'none' 
                    },                    
                }}
            >
                <CardContent 
                    id="card-content"  
                    sx={{
                        //backgroundColor: 'red', 
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
                    }}
                >                    
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
                                deleteAllRows={handleDeleteAll} 
                                fetchNextData={fetchNextData}        
                                setSorting={setSorting}
                                onRowClick={(id: number) => handleDataGridRowClick(id)}
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
                                onClick={() => navigate('/customers/0')}                                
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