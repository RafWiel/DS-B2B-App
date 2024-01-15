import { Box, Card, CardContent, Grid, InputAdornment, TextField } from "@mui/material";
import { memo } from "react";

import { useTheme } from '@mui/material/styles';
import EmployeesFilter from "../components/EmployeesFilter";

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [   
    {
      field: 'login',
      headerName: 'Login',
      width: 150,      
    },
    {
      field: 'name',
      headerName: 'Imię i nazwisko',
      width: 150,      
    },
    {
      field: 'type',
      headerName: 'Typ',
      //type: 'number',
      width: 110,
      editable: true,
    },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
  ];
  
  const rows = [
    { id: 1, login: 'admin', name: 'Rafał Wielicki', type: 'Administrator' },
    { id: 2, login: 'andy', name: 'Andrzej Jurkowski', type: 'Kierownik' },
    { id: 3, login: 'piotr', name: 'Piotr Trybuchowicz', type: 'Administrator' },
  ];

  
const Employees = memo(() => {
    const theme = useTheme();    

    return (
        <Box         
            sx={{
                backgroundColor: 'aqua',
                width: 1,
                height: '100%',
                display: 'inline-block',
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
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}                                                                        
                    />
                </CardContent>
            </Card>
        </Box>
    );
});

export default Employees;