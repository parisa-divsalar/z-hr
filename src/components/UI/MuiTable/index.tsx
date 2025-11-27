import { useState, ReactNode } from 'react';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';

type Order = 'asc' | 'desc';

interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  minWidth?: number;
  render?: (value: any, row: any) => ReactNode;
}

interface MuiTableProps {
  columns: Column[];
  data: any[];
  pagination?: boolean;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  onRowClick?: (row: any) => void;
  stickyHeader?: boolean;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 1px 1px rgba(0, 0, 0, 0.06)',
  border: `1px solid ${theme.palette.grey[100]}`,
  backgroundColor: '#fff',
  overflow: 'hidden',

  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: 0,
  },

  [theme.breakpoints.down('md')]: {
    borderRadius: '8px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },

  '& td': {
    borderBottom: 'none',
    fontSize: '14px',
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },

  '& th': {
    borderBottom: 'none',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    fontSize: '14px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    backgroundColor: '#fff',
  },

  [theme.breakpoints.down('sm')]: {
    '& td, & th': {
      fontSize: '12px',
    },
  },
}));

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
        <KeyboardArrowLeft />
      </IconButton>
    </Box>
  );
}

const MuiTable = ({
  columns,
  data,
  pagination = true,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  onRowClick,
  stickyHeader = false,
}: MuiTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<Order>('asc');

  const handleRequestSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortData = (array: any[]) => {
    if (!orderBy) return array;

    return [...array].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedData = sortData(data);
  const displayedData = pagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;

  return (
    <Box>
      <StyledTableContainer>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <StyledTableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'} style={{ minWidth: column.minWidth }}>
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </StyledTableRow>
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ border: 'none', py: 0, height: '1px' }}>
                <Divider sx={{ borderColor: 'grey.100' }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row, rowIndex) => (
              <StyledTableRow
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render ? column.render(value, row) : value}
                    </TableCell>
                  );
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {pagination && (
        <Box sx={{ direction: 'ltr', display: 'flex', justifyContent: 'flex-start' }}>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component='div'
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage='Rows per page:'
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
            ActionsComponent={TablePaginationActions}
          />
        </Box>
      )}
    </Box>
  );
};

export default MuiTable;
