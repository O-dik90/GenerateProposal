import { ArrowDownOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const TableForm = ({ columns, rows, expand, action, detail }) => {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedRows = useMemo(() => rows, [rows]);
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        overflowX: 'auto',
        '& .MuiTableCell-root': {
          whiteSpace: 'nowrap'
        }
      }}
    >
      <Table aria-label="collapsible table" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {expand && <TableCell align="center" width={48} />}
            {memoizedColumns?.map((item, index) => (
              <TableCell
                align="center"
                key={index}
                sx={{
                  width: item.width || 'auto',
                  minWidth: item.minWidth || 100,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.name}
              </TableCell>
            ))}
            {action && (
              <TableCell align="center" sx={{ width: 150 }}>
                Aksi
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {memoizedRows?.map((row, index) => (
            <CollapsibleRow key={index} row={row} columns={columns} expand={expand} action={action} detail={detail} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CollapsibleRow = ({ row, columns, expand, detail }) => {
  const [open, setOpen] = useState(false);

  const toggleRow = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {expand && (
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={toggleRow}>
              {open ? <ArrowDownOutlined /> : <ArrowRightOutlined />}
            </IconButton>
          </TableCell>
        )}
        {columns?.map((column, colIndex) => (
          <TableCell
            align={column.align || 'justify'}
            key={colIndex}
            sx={{
              width: column.width || 'auto',
              minWidth: column.minWidth || 100,
              maxWidth: column.maxWidth || 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              padding: '8px 16px'
            }}
          >
            {column.cell ? column.cell(row[column.field], row) : row[column.field]}
          </TableCell>
        ))}
      </TableRow>
      {detail && (
        <TableRow>
          <TableCell sx={{ py: 0 }} colSpan={columns.length + (expand ? 2 : 1)}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {typeof detail === 'function' ? detail(row) : detail}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

TableForm.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      width: PropTypes.string,
      minWidth: PropTypes.number,
      align: PropTypes.string,
      cell: PropTypes.func
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  expand: PropTypes.bool.isRequired,
  action: PropTypes.bool,
  detail: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
};

CollapsibleRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      width: PropTypes.string,
      minWidth: PropTypes.number,
      align: PropTypes.string,
      cell: PropTypes.func
    })
  ).isRequired,
  expand: PropTypes.bool.isRequired,
  action: PropTypes.bool,
  detail: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
};

export { TableForm };
