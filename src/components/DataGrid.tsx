import * as React from 'react';
//import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
//import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
//import Toolbar from '@mui/material/Toolbar';
//import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
//import IconButton from '@mui/material/IconButton';
//import Tooltip from '@mui/material/Tooltip';
//import DeleteIcon from '@mui/icons-material/Delete';
//import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material';
import { InView } from 'react-intersection-observer';

export interface IBaseRow {
    id: number;    
}

export interface IColumn {    
    id: string;
    label: string;
    numeric: boolean;
    disablePadding: boolean;
    visible: boolean;
    width: {
        mobile: string;
        desktop: string;
    }
}

interface IDataGridProps { 
    maxHeight: number, 
    columns: IColumn[],  
    rows: any[],
    isSelection: boolean;
    isDelete: boolean;
    deleteRow: (row: object) => void;
    deleteAllRows: () => void;
    fetchNextData: () => void;
    setSorting: (column: string, order: Order) => void;
    onRowClick: (id: number) => void;
}

export interface IDataGridRef { 
    updateSorting: (column: string | null, order: Order | null) => void; 
}

interface IHeadProps {
    columns: IColumn[],
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    isSelection: boolean;
    isDelete: boolean;
    isRows: boolean,
    deleteAllRows: () => void;
}

// interface IEnhancedTableToolbarProps {
//     numSelected: number;
// }
  
export type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
  
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        
        if (order !== 0) {
            return order;
        }
    
        return a[1] - b[1];
    });
  
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props: IHeadProps) {
    const theme = useTheme();

    const { 
        onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, 
        isSelection, isDelete, columns, deleteAllRows, isRows 
    } = props;
  
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    const handleDeleteAll = (event: React.MouseEvent<unknown>) => {        
        deleteAllRows();

        event.stopPropagation();
    };

    return (
        <TableHead>
            <TableRow 
                sx={{ 
                    height: '34px'
                    // '& .MuiTableCell-root': {
                    //     //lineHeight: '40px !important',
                    //     height: '40px !important',
                    //     //padding: '0 !important',

                    //     //maxHeight: '40px !important',
                    //     //whiteSpace: 'normal',

                    //  },
                    //  '&:last-child td, &:last-child th': {
                    //     border: 0 
                    //  }
                }}
            >
                {
                    isSelection &&
                    <TableCell 
                        padding="checkbox"
                        sx={{
                            backgroundColor: 'white',
                        }}
                    >
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}                            
                        />
                    </TableCell>
                }
                {
                    columns && columns.map((column) => (
                        column.visible && 
                        <TableCell
                            key={column.id}                            
                            align={column.numeric ? 'right' : 'left'}
                            padding={column.disablePadding ? 'none' : 'normal'}                            
                            sortDirection={orderBy === column.id ? order : false}
                            sx = {{                                
                                // '& .MuiTableCell-root': {
                                //     lineHeight: '30px !important',
                                //     height: '30px !important',
                                //     padding: '0 !important',

                                //     maxHeight: '30px !important',
                                //     whiteSpace: 'normal',

                                // },
                                // '&:last-child td, &:last-child th': {
                                //     border: 0 
                                // },        
                                backgroundColor: 'white',
                                padding: 0,  
                                paddingLeft: column.disablePadding ? (isSelection ? 0 : 1) : 0,
                                width: column.width.desktop,
                                [theme.breakpoints.down('sm')]: {
                                    width: column.width.mobile,
                                },                                  
                            }} 
                        >
                            <TableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? order : 'asc'}
                                onClick={createSortHandler(column.id)}
                                IconComponent={KeyboardArrowDownIcon}
                                sx={{
                                    color: 'var(--color-grey)',
                                    fontWeight: 550
                                }}
                            >
                                {column.label}
                                {
                                    orderBy === column.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null
                                }
                            </TableSortLabel>
                        </TableCell>                        
                    ))
                }
                {                
                    isDelete && isRows &&
                    <TableCell
                        scope="row" 
                        key="deleteButton"
                        onClick={(event) => handleDeleteAll(event)}
                        align="right" 
                        padding="none"   
                        width="30px"
                        sx = {{
                            // backgroundColor: 'aqua',
                            // '& .MuiTableCell-root': {
                            //     lineHeight: '30px !important',
                            //     height: '30px !important',
                            //     padding: '0 !important',

                            //     maxHeight: '30px !important',
                            //     whiteSpace: 'normal',

                            // },
                            // '&:last-child td, &:last-child th': {
                            //     border: 0 
                            // },
                            backgroundColor: 'white',
                            paddingRight: 1,                                                       
                            paddingTop: 1,
                            cursor: 'pointer',
                            color: 'var(--color-grey)',
                            "&:hover": {
                                color: 'var(--color-red)'
                            }
                        }}                                                                                      
                    >
                        <ClearIcon />                                             
                    </TableCell>                 
                }
            </TableRow>
        </TableHead>
    );
}

// function EnhancedTableToolbar(props: IEnhancedTableToolbarProps) {
//     const { numSelected } = props;

//     return (
//         <Toolbar
//             sx={{
//                 pl: { sm: 2 },
//                 pr: { xs: 1, sm: 1 },
//                 ...(numSelected > 0 && {
//                 bgcolor: (theme) =>
//                     alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
//                 }),
//             }}
//         >
//         {
//             numSelected > 0 ? (
//                 <Typography
//                     sx={{ flex: '1 1 100%' }}
//                     color="inherit"
//                     variant="subtitle1"
//                     component="div"
//                 >
//                     {numSelected} selected
//                 </Typography>
//             ) : (
//                 <Typography
//                     sx={{ flex: '1 1 100%' }}
//                     variant="h6"
//                     id="tableTitle"
//                     component="div"
//                 >
//                     Toolbar
//                 </Typography>
//             )
//         }
//         {numSelected > 0 ? (
//             <Tooltip title="Delete">
//             <IconButton>
//                 <DeleteIcon />
//             </IconButton>
//             </Tooltip>
//         ) : (
//             <Tooltip title="Filter list">
//             <IconButton>
//                 <FilterListIcon />
//             </IconButton>
//             </Tooltip>
//         )}
//         </Toolbar>
//     );
// }

const DataGrid = React.forwardRef((props: IDataGridProps, ref) => {
    const { 
        maxHeight, 
        columns, 
        rows, 
        isSelection, 
        isDelete, 
        deleteRow,
        deleteAllRows, 
        fetchNextData,
        setSorting,
        onRowClick 
    } = props;

    const [order, setOrder] = React.useState<Order>('asc');    
    const [orderBy, setOrderBy] = React.useState<string>('');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    //const [page, setPage] = React.useState(0);  
    //const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    const NoDataText = styled('div')(({ theme }) => ({ 
        ...theme.typography.subtitle2,
        fontSize: 13, 
        fontWeight: 600,      
        textAlign: 'center',
        color: theme.palette.grey[400],
        padding: theme.spacing(3),
    }));

    const handleRequestSort = (
        _: React.MouseEvent<unknown>,
        column: string,
    ) => {
        const isAsc = orderBy === column && order === 'asc';
        const newOrder = isAsc ? 'desc' : 'asc';

        setOrder(newOrder);
        setOrderBy(column);
        setSorting(column, newOrder);
    };

    React.useImperativeHandle(ref, () => ({
        updateSorting(column: string | null, order: Order | null) {
            if (!column || !order) {
                return;
            }

            setOrder(order);
            setOrderBy(column);
        }    
    }));

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSelection) {
            return;
        }
                
        if (event.target.checked) {
            const newSelected = rows.map((n: IBaseRow) => n.id);
            setSelected(newSelected);
            return;
        }

        setSelected([]);
    };

    const handleRowClick = (_: React.MouseEvent<unknown>, id: number) => {
        onRowClick(id);
    };

    const handleRowSelect = (e: React.MouseEvent<unknown>, id: number) => {
        if (!isSelection) {
            return;
        }
        
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);

        e.stopPropagation();
    };

    const handleDelete = (event: React.MouseEvent<unknown>, row: object) => {
        deleteRow(row);

        event.stopPropagation();
    };    

    const handleIntersect = (inView: boolean) => {
        if (!inView || !rows.length) {
            return;
        }

        fetchNextData();
    }

    // const handleChangePage = (event: unknown, newPage: number) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };  

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows =
    //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    // const visibleRows = React.useMemo(
    //     () =>
    //     stableSort(rows, getComparator(order, orderBy)).slice(
    //         page * rowsPerPage,
    //         page * rowsPerPage + rowsPerPage,
    //     ),
    //     [order, orderBy, page, rowsPerPage],
    // );

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)),
        [rows, order, orderBy],
    );       
    
    return (
        <Box 
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                width: '100%',                                 
                maxHeight: {maxHeight},                                 
            }}
        >            
            {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
            <TableContainer sx={{                     
                    display: 'flex',
                    minWidth: 400,
                    //maxHeight: '100%', 
                    overflow: 'auto',                       
                }}>
                <Table                    
                    stickyHeader
                    aria-labelledby="tableTitle"
                    size='medium'                                  
                >
                    <EnhancedTableHead
                        columns={columns}
                        numSelected={selected.length}                        
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        isSelection={isSelection}
                        isDelete={isDelete}
                        isRows={visibleRows.length > 0}
                        deleteAllRows={deleteAllRows}
                    />                   
                    <TableBody>
                    {
                        visibleRows.map((row, rowIndex) => {
                            const isItemSelected = isSelected(Number(row.id));
                            const labelId = `enhanced-table-checkbox-${rowIndex}`;

                            return (                                
                                <TableRow
                                    hover
                                    onClick={(event) => handleRowClick(event, Number(row.id))}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                    sx={{ 
                                        cursor: 'pointer', 
                                        height: '34px'
                                        // '& .MuiTableCell-root': {
                                        //     height: '10px',
                                        //     padding: '0'
                                        //  },
                                        //  '&:last-child td, &:last-child th': {
                                        //     border: 0 
                                        //  }
                                    }}
                                >
                                    {
                                        isSelection &&
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                onClick={(event) => handleRowSelect(event, Number(row.id))}
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />                                    
                                        </TableCell>
                                    }                                    
                                    {
                                        columns && columns.map((column, columnIndex) => (
                                            column.visible && 
                                            <TableCell
                                                id={columnIndex === 1 ? labelId : undefined}
                                                scope="row"                                                 
                                                key={column.id}
                                                align={column.numeric ? 'right' : 'left'} 
                                                padding={column.disablePadding ? 'none' : 'normal'}                                                        
                                                sx = {{
                                                    padding: 0,
                                                    paddingLeft: column.disablePadding ? (isSelection ? 0 : 1) : 0
                                                }}                                               
                                            >
                                                {Object.values(row)[columnIndex]}                                                 
                                                {
                                                    //instersection object - trigger event to fetch another data chunk
                                                    columnIndex === 1 && 
                                                    rowIndex === (visibleRows.length - 1) && 
                                                    <InView onChange={(inView: boolean) => handleIntersect(inView)} />
                                                }
                                            </TableCell>
                                        ))
                                    }   
                                    {                
                                        isDelete && (visibleRows.length > 0) &&
                                        <TableCell
                                            scope="row" 
                                            key="deleteButton"
                                            onClick={(event) => handleDelete(event, row)}
                                            align="right" 
                                            padding="none"                                        
                                            sx = {{                                                
                                                paddingRight: 1,
                                                paddingTop: '4px',
                                                color: 'var(--color-grey)',
                                                "&:hover": {
                                                    color: 'var(--color-red)'
                                                }
                                            }}                                                                                     
                                        >
                                            <ClearIcon />                                             
                                        </TableCell>                 
                                    }
                                </TableRow>                            
                            );
                        })
                    }
                    {/* {
                        visibleRows && (visibleRows.length > 0) &&
                        <TableRow >
                            <TableCell >
                                <InView onChange={(inView: boolean) => handleIntersect(inView)} />
                            </TableCell>
                        </TableRow>
                    } */}
                    {/* {
                        emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )
                    } */}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                (!visibleRows || !visibleRows.length) && <NoDataText>Brak danych</NoDataText>
            }
            {/* <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
            
            {/* <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}
        </Box>
    );
});

export default DataGrid;