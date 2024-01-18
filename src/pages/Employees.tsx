import { memo } from "react";
import { useTheme } from '@mui/material/styles';
import EmployeesFilter from "../components/EmployeesFilter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DataGrid from "../components/DataGrid";



// const columns: GridColDef[] = [   
//     {
//       field: 'login',
//       headerName: 'Login',
//       width: 150,      
//     },
//     {
//       field: 'name',
//       headerName: 'Imię i nazwisko',
//       width: 150,      
//     },
//     {
//       field: 'type',
//       headerName: 'Typ',
//       //type: 'number',
//       width: 110,
//       editable: true,
//     },
    
//   ];
  
//   const rows = [
//     { id: 1, login: 'admin', name: 'Rafał Wielicki', type: 'Administrator' },
//     { id: 2, login: 'andy', name: 'Andrzej Jurkowski', type: 'Kierownik' },
//     { id: 3, login: 'piotr', name: 'Piotr Trybuchowicz', type: 'Administrator' },
//   ];





  
  
const Employees = memo(() => {
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
                <CardContent>
                    <DataGrid 
                        isCheckbox={false}
                    />

                    
                    


                </CardContent>
            </Card>
        </Box>
    );
});

export default Employees;