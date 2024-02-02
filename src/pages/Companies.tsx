import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import EmployeesFilter from "../components/EmployeesFilter";
import DataGrid, { IBaseRow, IColumn } from "../components/DataGrid";

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
    createData(19, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(20, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(21, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),   
    createData(22, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(23, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(24, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),   
    createData(25, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(26, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(27, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),   
    createData(28, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(29, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(30, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),    
    createData(31, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(32, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(33, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),    
    createData(34, 'rafal.wielicki', 'Rafał Wielicki', 'Administrator'),
    createData(35, 'andy', 'Andrzej Jurkowski', 'Administrator'),
    createData(36, 'piotr.trybuchowicz', 'Piotr Trybuchowicz', 'Administrator'),  
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

const Companies = memo(() => {
    const theme = useTheme();    

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
            <EmployeesFilter />
            <Card 
                variant="outlined"
                sx={{    
                    marginTop: 1.5, 
                    height: '100%',                    
                    [theme.breakpoints.down('sm')]: {
                        border: 'none' 
                    },                    
                }}
            >
                <CardContent sx={{
                    //backgroundColor: 'red', 
                    display: 'flex',                            
                    maxHeight: '100%',
                    [theme.breakpoints.down('md')]: {
                        padding: 1,
                        '&:last-child': { 
                            paddingBottom: 1 
                        }
                    },                                                                                                                
                }}>                    
                    
                    <DataGrid 
                        columns={columns}
                        rows={rows}
                        isSelection={false}
                        isDelete={true}
                        deleteRow={() => {}}
                        deleteAllRows={() => {}}        
                    />
                        
                            
                </CardContent>
            </Card>
        </Box>
    );
});

export default Companies;