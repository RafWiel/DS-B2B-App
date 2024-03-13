import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import EmployeesFilter from "../components/EmployeesFilter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DataGrid, { IBaseRow, IColumn, IDataGridRef, Order } from "../components/DataGrid";
import { useAppStore } from "../store";
import { Button, Grid, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { config } from "../config/config";
import employeeType from "../enums/employeeType";
import debounce from 'lodash/debounce';
import queryString from 'query-string';
import { useLocation } from 'wouter';

interface IEmployeeRow extends IBaseRow {
    login: string;
    name: string;
    type: string;    
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

type FetchState = {
    search: string,
    type: string,
    page: number,
    sortColumn: string | null,
    sortOrder: Order | null,
    isReset: boolean
}
  
const Employees = memo(() => {
    const theme = useTheme();     
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));           
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const dataGridRef = useRef<IDataGridRef>();
    const [employees, setEmployees] = useState<Array<IEmployeeRow>>([]);
    const [, navigate] = useLocation();
    const abortController = useRef(new AbortController()).current;  
    const [dataGridHeight, setDataGridHeight] = useState(0);
    
    const [state, setState] = useState<FetchState>({
        search: '',
        type: employeeType.none.toString(),
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
    
    const fetchNextData = () => {
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
    };

    const setFilter = (search: string, type: string, isDebouncedUpdate: boolean) => {
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
    };

    const setSorting = (column: string, order: Order) => {
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
    }
    
    const debounceFetchData = useRef(
        debounce((stateValue: FetchState) => { 
            fetchData(stateValue); 
        }, 500)
    ).current;

    const parseUrl = () => {
        const url = queryString.parse(location.search);
        //console.log(url);
        
        const newState: FetchState = {
            ...state,
            search: (url.search ?? '').toString(),
            type: (url.type ?? employeeType.none).toString(),
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
            type: Number(stateValue.type) > 0 ? stateValue.type : null, 
            'sort-column': stateValue.sortColumn, 
            'sort-order': stateValue.sortOrder
        }, {
            skipNull: true
        });
        
        if (url.length > 0) {
            url = `/employees?${url}`;
        }

        window.history.replaceState(null, '', url);
    }

    const fetchData = useCallback((stateValue: FetchState) => {                        
        //console.log('fetchData');
        //console.log('search: ', stateValue.search, ' | ', state.search);   
        //console.log('type: ', stateValue.type, ' | ', state.type);   
        //console.log('page: ', stateValue.page, ' | ', state.page);           
    
        setUrl(stateValue);        

        showLoadingIcon(true);       
    
        fetch(`${config.API_URL}/employees?${String(new URLSearchParams({ 
            search: stateValue.search,
            type: stateValue.type,
            'sort-column': stateValue.sortColumn ?? 'id',
            'sort-order': stateValue.sortOrder ?? 'asc',
            page: stateValue.page.toString()
        }))}`, { 
            signal: abortController.signal 
        })              
        .then((res) => {           
          if (!res.ok) throw new Error("Nieprawidłowa odpowiedź serwera");    
          
          //console.log('res', res);
          return res.json();
        })
        .then((res) => {  
            const newEmployees = res as Array<IEmployeeRow>;
            if (newEmployees.length === 0 && 
                !stateValue.isReset) {
                return;
            }

            //console.log('employees', newEmployees);

            //update type text
            newEmployees.forEach(u => {
                u.type = employeeType.getText(Number(u.type));                
            });
            
            if (stateValue.isReset) {
                setEmployees(newEmployees);
            }
            else {
                setEmployees([...employees, ...newEmployees]); 
            }                      
        })
        .catch((error: unknown) => {
            if ((error as Error).name === 'AbortError') return;
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error as Error).message
            });
        })
        .finally(() => {
            showLoadingIcon(false);                        
        });    
    }, [state, employees, openMessageDialog, showLoadingIcon, abortController]);

    const handleDelete = (row: object) => {
        const employee = row as IEmployeeRow;

        openQuestionDialog({
            title: 'Pracownicy',
            text: `Czy na pewno usunąć pracownika ${employee.name}?`,            
            action: deleteSingle,
            actionParameters: employee.id
        });
    }

    const handleDeleteAll = () => {        
        openQuestionDialog({
            title: 'Pracownicy',
            text: 'Czy na pewno usunąć wszystkich pracowników?',
            action: deleteAll,
            //actionParameters: [1, 2, 3]
        });
    }

    const deleteSingle = async (id: number) => {
        const result = await deleteAsync(`${config.API_URL}/employees/${id}`, 'Nieudane usunięcie pracownika');        
        if (!result) {            
            return;
        }

        setEmployees(employees.filter(u => u.id !== id));     
    }

    const deleteAll = async () => {
        const result = await deleteAsync(`${config.API_URL}/employees`, 'Nieudane usunięcie wszystkich pracowników');        
        if (!result) {            
            return;
        }

        setEmployees([]);         
    }

    const deleteAsync = async (url: string, errorMessage: string) => {
        showLoadingIcon(true);       
        
        const result = await fetch(url, { method: 'DELETE' })              
            .then((res) => {           
                if (!res.ok) throw new Error(errorMessage);    
            
                return true;
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
        
        //console.log('result', result);
        return result;
    }    

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
                <EmployeesFilter 
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
                                rows={employees}
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
});

export default Employees;