import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { ServiceRequestsFilter } from "../components/ServiceRequestsFilter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DataGrid, IBaseRow, IColumn, IDataGridRef, Order } from "../components/DataGrid";
import { useAppStore } from "../store";
import { Button, Grid, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { config } from "../config/config";
import debounce from 'lodash/debounce';
import queryString from 'query-string';
import { useLocation } from 'wouter';
import useApi from '../hooks/useApi.ts';
import { serviceRequestType } from "../enums/serviceRequestType.ts";
import dayjs, { Dayjs } from "dayjs";
import { ownershipType } from "../enums/ownershipType.ts";
import { serviceRequestSubmitType } from "../enums/serviceRequestSubmitType.ts";
import { serviceRequestStatus } from "../enums/serviceRequestStatus.ts";
import { serviceRequestSimpleStatus } from "../enums/serviceRequestSimpleStatus.ts";

interface IServiceRequestRow extends IBaseRow {
    login: string;
    name: string;
    type: string;    
}

const columns: IColumn[] = [
    {
        id: 'id',
        label: 'Id',
        numeric: true,
        hidden: true,
        width: {
            mobile: '0',
            desktop: '0'
        }
    },
    {
        id: 'date',
        label: 'Data',
        disablePadding: true,                
        width: {
            mobile: '100px',
            desktop: '120px'
        }
    },
    {
        id: 'name',
        label: 'Numer',
        width: {
            mobile: '120px',
            desktop: '150px'
        }
    },
    {
        id: 'topic',
        label: 'Temat',
        width: {
            mobile: '150px',
            desktop: '200px'
        }
    },
    {
        id: 'customer',
        label: 'Zgłaszający',
        mobileHidden: true,
        width: {            
            desktop: '150px'
        }
    },
    {
        id: 'company',
        label: 'Firma',
        mobileHidden: true,
        width: {
            desktop: '150px'
        }
    },
    {
        id: 'employee',
        label: 'Odpowiedzialny',
        mobileHidden: true,
        mediumHidden: true,
        width: {
            desktop: '150px'
        }
    },
    {
        id: 'type',
        label: 'Typ',
        mobileHidden: true,
        mediumHidden: true,
        width: {
            desktop: '100px'
        }
    },
    {
        id: 'submitType',
        label: 'Źródło',
        mobileHidden: true,
        mediumHidden: true,
        width: {
            desktop: 'auto'
        }
    },
    {
        id: 'status',
        label: 'Status',
        mobileHidden: true,
        mediumHidden: true,
        width: {
            desktop: 'auto'
        }
    },
];

type FetchState = {
    search: string,
    start: Dayjs | null,
    end: Dayjs | null,
    ownership: string,
    type: string,
    submitType: string,
    status: string,
    page: number,
    sortColumn: string | null,
    sortOrder: Order | null,
    isReset: boolean
}
  
export const ServiceRequests = () => {
    const theme = useTheme();     
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));           
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const dataGridRef = useRef<IDataGridRef>();
    const [requests, setRequests] = useState<Array<IServiceRequestRow>>([]);
    const [, navigate] = useLocation();
    const abortController = useRef(new AbortController()).current;  
    const [dataGridHeight, setDataGridHeight] = useState(0);
    const api = useApi();

    const [state, setState] = useState<FetchState>({
        search: '',
        start: null, 
        end: null,
        ownership: ownershipType.none.toString(),
        type: serviceRequestType.none.toString(),
        submitType: serviceRequestSubmitType.none.toString(),
        status: serviceRequestStatus.none.toString(),
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

    const parseUrl = () => {
        const url = queryString.parse(location.search);
        const dateRegExp = /^(19|20)\d{2}(-)(0[1-9]|1[1,2])(-)(0[1-9]|[12][0-9]|3[01])$/;
                
        const newState: FetchState = {
            ...state,
            search: (url.search ?? '').toString(),
            start: url.start?.toString().match(dateRegExp) ? dayjs(url.start?.toString()) : null,
            end: url.end?.toString().match(dateRegExp) ? dayjs(url.end?.toString()) : null,
            ownership: (url.employee != null ? ownershipType.employee : ownershipType.none).toString(),
            type: (url.type ?? serviceRequestType.none).toString(),
            submitType: (url['submit-type']?.toString() ?? serviceRequestSubmitType.none).toString(),
            status: (url.status ?? serviceRequestStatus.none).toString(),
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
            start: stateValue.start !== null ? stateValue.start.format('YYYY-MM-DD') : null,
            end: stateValue.end !== null ? stateValue.end.format('YYYY-MM-DD') : null,
            employee: Number(stateValue.ownership) > ownershipType.none ? 666 : null, //TODO: zalogowany user
            type: Number(stateValue.type) > serviceRequestType.none ? stateValue.type : null, 
            'submit-type': Number(stateValue.submitType) > serviceRequestSubmitType.none ? stateValue.submitType : null, 
            status: Number(stateValue.status) > serviceRequestStatus.none ? stateValue.status : null, 
            'sort-column': stateValue.sortColumn, 
            'sort-order': stateValue.sortOrder
        }, {
            skipNull: true
        });
        
        if (url.length > 0) {
            url = `/service-requests?${url}`;
        }

        window.history.replaceState(null, '', url);
    }

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
        
        const status = (Number(stateValue.status) & 0xFF).toString(); //maska 0xFF
    
        api.get(`${config.API_URL}/service-requests?${String(new URLSearchParams({ 
                search: stateValue.search,
                start: stateValue.start !== null ? stateValue.start.format('YYYY-MM-DD') : '',
                end: stateValue.end !== null ? stateValue.end.format('YYYY-MM-DD') : '',
                employee: Number(stateValue.ownership) > ownershipType.none ? '666' : '', //TODO: zalogowany user
                type: Number(stateValue.type) > serviceRequestType.none ? stateValue.type : '',
                'submit-type': Number(stateValue.submitType) > serviceRequestSubmitType.none ? stateValue.submitType : '',
                status: Number(stateValue.status) > serviceRequestStatus.none ? status : '',
                'sort-column': stateValue.sortColumn ?? 'date',
                'sort-order': stateValue.sortOrder ?? 'asc',
                page: stateValue.page.toString()
            }))}`, { 
            signal: abortController.signal 
        })                      
        .then((res) => {            
            const newRequests = res.data as Array<IServiceRequestRow>;
            if (newRequests.length === 0 && 
                !stateValue.isReset) {
                return;
            }            
            
            if (stateValue.isReset) {
                setRequests(newRequests);
            }
            else {
                setRequests([...requests, ...newRequests]); 
            }                      
        })
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;
            
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error.response ? `${error.response.status} - ` : '') + 'Nieudane pobranie listy zleceń'
            });
        })
        .finally(() => {
            showLoadingIcon(false);                        
        });    
    }, [api, requests, openMessageDialog, showLoadingIcon, abortController]);

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

    const setFilter = useCallback((
        search: string, 
        start: Dayjs | null, 
        end: Dayjs | null, 
        ownership: string,
        type: string, 
        submitType: string,
        status: string,
        isDebouncedUpdate: boolean
    ) => {
        //console.log('setFilter');        
        //console.log('submitType', submitType);
        //console.log('status', status);        
        //console.log('page', state.page);

        const newState = {
            ...state,             
            search: search,
            start: start,
            end: end,
            ownership: ownership,
            type: type,
            submitType: submitType,
            status: status,
            page: 1, 
            isReset: true
        };
        
        setState(newState);    
        
        if (isDebouncedUpdate) {
            debounceFetchData(newState);
        } else {
            fetchData(newState); 
        }
    }, [state, fetchData, debounceFetchData]);

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

    const deleteSingle = useCallback(async (id: number) => {
        const result = await deleteAsync(`${config.API_URL}/service-requests/${id}`, 'Nieudane usunięcie zlecenia serwisowego');        
        if (!result) {            
            return;
        }

        setRequests(requests.filter(u => u.id !== id));     
    }, [requests, deleteAsync]);

    const handleDelete = useCallback((row: object) => {
        const request = row as IServiceRequestRow;

        openQuestionDialog({
            title: 'Pracownicy',
            text: `Czy na pewno usunąć zlecenie serwisowe ${request.name}?`,            
            action: deleteSingle,
            actionParameters: request.id
        });
    }, [deleteSingle, openQuestionDialog]);

    const deleteAll = useCallback(async () => {
        const result = await deleteAsync(`${config.API_URL}/service-requests`, 'Nieudane usunięcie wszystkich zleceń serwisowych');        
        if (!result) {            
            return;
        }

        setRequests([]);         
    }, [deleteAsync]);

    const handleDeleteAll = useCallback(() => {        
        openQuestionDialog({
            title: 'Pracownicy',
            text: 'Czy na pewno usunąć wszystkie zlecenia serwisowe?',
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
                <ServiceRequestsFilter 
                    search={state.search}
                    start={state.start}
                    end={state.end}
                    ownership={state.ownership}
                    type={state.type}
                    submitType={state.submitType}
                    status={state.status}
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
                                rows={requests}
                                isSelection={false}
                                isDelete={true}
                                maxHeight={dataGridHeight}                              
                                deleteRow={handleDelete}
                                deleteAllRows={handleDeleteAll} 
                                fetchNextData={fetchNextData}        
                                setSorting={setSorting}
                                onRowClick={(id: number) => navigate(`/employees/${id}`)}
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