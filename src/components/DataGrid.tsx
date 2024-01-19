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

export interface IBaseRow {
    id: number;    
}

export interface IColumn {    
    id: string;
    label: string;
    numeric: boolean;
    disablePadding: boolean;
    visible: boolean;
}

interface IDataGridProps {  
    columns: IColumn[],  
    rows: any[],
    isCheckbox: boolean;
}

interface IHeadProps {
    columns: IColumn[],
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    isCheckbox: boolean;
}

// interface IEnhancedTableToolbarProps {
//     numSelected: number;
// }
  
type Order = 'asc' | 'desc';











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
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, isCheckbox, columns } = props;
  
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {
                    isCheckbox &&
                    <TableCell padding="checkbox">
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
                                paddingLeft: column.disablePadding ? (isCheckbox ? 0 : 1) : 0
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

export default function DataGrid(props: IDataGridProps) {
    const { columns, rows, isCheckbox } = props;

    const [order, setOrder] = React.useState<Order>('asc');    
    const [orderBy, setOrderBy] = React.useState<string>('calories');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    //const [page, setPage] = React.useState(0);  
    //const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (
        _: React.MouseEvent<unknown>,
        property: string,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n: IBaseRow) => n.id);
            setSelected(newSelected);
            return;
        }

        setSelected([]);
    };

  const handleClick = (_: React.MouseEvent<unknown>, id: number) => {
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
    };

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
        [order, orderBy],
    );

    return (
        <Box 
            sx={{ 
                width: '100%' 
            }}
        >            
            {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
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
                        isCheckbox={isCheckbox}
                    />
                    <TableBody>
                    {
                        visibleRows.map((row, index) => {
                            const isItemSelected = isSelected(Number(row.id));
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, Number(row.id))}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    {
                                        isCheckbox &&
                                        <TableCell padding="checkbox">                                                                        
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />                                    
                                        </TableCell>
                                    }                                    
                                    {
                                        columns && columns.map((column, index) => (
                                            column.visible && 
                                            <TableCell
                                                component="th"
                                                id={index <= 1 ? labelId : undefined}
                                                scope="row" 
                                                key={column.id}
                                                align={column.numeric ? 'right' : 'left'} 
                                                padding={column.disablePadding ? 'none' : 'normal'}                                                        
                                                sx = {{
                                                    paddingLeft: column.disablePadding ? (isCheckbox ? 0 : 1) : 0
                                                }}                                               
                                            >
                                                {Object.values(row)[index]}                                                
                                            </TableCell>
                                        ))
                                    }                                    
                                </TableRow>
                            );
                        })
                    }
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
}