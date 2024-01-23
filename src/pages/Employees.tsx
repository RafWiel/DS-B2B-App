import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import EmployeesFilter from "../components/EmployeesFilter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DataGrid, { IBaseRow, IColumn } from "../components/DataGrid";
import { useAppStore } from "../store";

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
    const openMessageDialog = useAppStore((state) => state.openMessageDialog); 

    const handleDelete = (row: object) => {
        const employee = row as IRow;

        openMessageDialog({
            title: 'Pracownicy',
            text: `Czy na pewno usunąć pracownika ${employee.name}?`
        });
    }

    const handleDeleteAll = () => {        
        openMessageDialog({
            title: 'Pracownicy',
            text: `Czy na pewno usunąć wszystkich pracowników?`
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
                <CardContent>
                    <DataGrid 
                        columns={columns}
                        rows={rows}
                        isSelection={false}
                        isDelete={true}
                        deleteRow={handleDelete}
                        deleteAllRows={handleDeleteAll}
                    />
                </CardContent>
            </Card>
        </Box>
    );
});

export default Employees;