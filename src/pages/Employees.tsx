import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import EmployeesFilter from "../components/EmployeesFilter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DataGrid, { IBaseRow, IColumn } from "../components/DataGrid";
import { useAppStore } from "../store";
import { Button, Grid, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { config } from "../config/config";
import employeeType from "../enums/employeeType";
import debounce from 'lodash/debounce';
import queryString from 'query-string';

interface IEmployee extends IBaseRow {
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
            mobile: '220px',
            desktop: '220px'
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
    sortOrder: string | null,
    isReset: boolean
}
  
const Employees = memo(() => {
    const theme = useTheme();     
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));           
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [state, setState] = useState<FetchState>({
        search: '',
        type: '0',
        page: 1,
        sortColumn: null,
        sortOrder: null,        
        isReset: true
    });
    
   
    //console.log('render', state.page);

    useEffect(() => {
        const abortController = new AbortController();
            
        parseUrl();        
    
        //cleanup, przerwij wywolanie fetch jesli unmount
        return () => {
          showLoadingIcon(false);
          abortController.abort();
          debounceFetchData.cancel();          
        }
    }, []);
    
    const fetchNextData = () => {
        console.log('fetchNextData');
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
        console.log('setFilter');        
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

    const setSorting = (column: string, order: string) => {
        console.log('sorting: ', column, order);

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
        console.log(url);
        
        const newState: FetchState = {
            ...state,
            search: (url.search ?? '').toString(),
            type: (url.type ?? 0).toString(),
            sortColumn: url['sort-column']?.toString() ?? null,
            sortOrder: url['sort-order']?.toString() ?? null,        
            page: 1,            
            isReset: true
        };
        
        setState(newState);
        fetchData(newState);

        jeszcze pokaz znacznik sortowania w datagrid
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
        console.log('fetchData');
        console.log('search: ', stateValue.search, ' | ', state.search);   
        console.log('type: ', stateValue.type, ' | ', state.type);   
        //console.log('page: ', stateValue.page, ' | ', state.page);           
    
        setUrl(stateValue);        

        showLoadingIcon(true);       
    
        fetch(`${config.API_URL}/employees?${String(new URLSearchParams({ 
            search: stateValue.search,
            type: stateValue.type,
            'sort-column': stateValue.sortColumn ?? 'id',
            'sort-order': stateValue.sortOrder ?? 'asc',
            page: stateValue.page.toString()
        }))}`)              
        .then((res) => {           
          if (!res.ok) throw new Error("Nieprawidłowa odpowiedź serwera");    
          
          //console.log('res', res);
          return res.json();
        })
        .then((res) => {  
            const newEmployees = res as IEmployee[];
            if (newEmployees.length === 0 && 
                !stateValue.isReset) {
                return;
            }

            //update type text
            newEmployees.forEach(u => {
                u.type = employeeType.getText(Number(u.type));                
            });
            
            if (stateValue.isReset) {
                setEmployees(newEmployees);
            }
            else {
                //append array
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
    }, [state, employees, openMessageDialog, showLoadingIcon]);

    const handleDelete = (row: object) => {
        const employee = row as IEmployee;

        openQuestionDialog({
            title: 'Pracownicy',
            text: `Czy na pewno usunąć pracownika ${employee.name}?`,            
            action: deleteUser,
            actionParameters: employee.id
        });
    }

    const handleDeleteAll = () => {        
        openQuestionDialog({
            title: 'Pracownicy',
            text: `Czy na pewno usunąć wszystkich pracowników?`,            
            action: deleteAllUsers,
            //actionParameters: [1, 2, 3]
        });
    }

    const deleteUser = (id?: number) => {
        console.log('delete user ', id);        
    }

    const deleteAllUsers = () => {
        console.log('delete all users');        
    }

    const [dataGridHeight, setDataGridHeight] = useState(0);

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

    useEffect(() => {          
        handleResize();              
        window.addEventListener('resize', handleResize);
        
        return () => {               
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                                columns={columns}
                                rows={employees}
                                isSelection={false}
                                isDelete={true}
                                maxHeight={dataGridHeight}                              
                                deleteRow={handleDelete}
                                deleteAllRows={handleDeleteAll} 
                                fetchNextData={fetchNextData}        
                                setSorting={setSorting}
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
                                onClick={() => fetchDataChunk()}                                
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