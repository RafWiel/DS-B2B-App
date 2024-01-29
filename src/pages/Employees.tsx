import { memo, useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import EmployeesFilter from "../components/EmployeesFilter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DataGrid, { IBaseRow, IColumn } from "../components/DataGrid";
import { useAppStore } from "../store";
import { Button, Grid, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface IRow extends IBaseRow {
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

const rows = [
    createData(1, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(2, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(3, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),   
    createData(4, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(5, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(6, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),   
    createData(7, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(8, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(9, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),   
    createData(10, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(11, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(12, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),    
    createData(13, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(14, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(15, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),    
    createData(16, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(17, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(18, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),    
];

function createData(
    id: number,
    login: string,
    name: string,
    type: string
): IRow {
    return {
        id,
        login,
        name,
        type
    };
}

  
//   const rows = [
//     { id: 1, login: 'admin', name: 'Rafał Wielicki', type: 'Administrator' },
//     { id: 2, login: 'andy', name: 'Andrzej Jurkowski', type: 'Kierownik' },
//     { id: 3, login: 'piotr', name: 'Piotr Trybuchowicz', type: 'Administrator' },
//   ];





  
  
const Employees = memo(() => {
    const theme = useTheme();     
    const openQuestionDialog = useAppStore((state) => state.openQuestionDialog); 
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));           

    const handleDelete = (row: object) => {
        const employee = row as IRow;

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
                <EmployeesFilter />
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
                                rows={rows}
                                isSelection={false}
                                isDelete={true}
                                deleteRow={handleDelete}
                                deleteAllRows={handleDeleteAll}  
                                height={dataGridHeight}                              
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