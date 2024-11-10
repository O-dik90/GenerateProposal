import { ArrowDownOutlined, ArrowRightOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const TableGrid = ({ columns, rows, expand, action, onEdit }) => {
  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table aria-label="collapsible table" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {expand && <TableCell align="center" sx={{ width: 48, minWidth: 48 }} />}
            {columns.map((item, index) => (
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
              <TableCell align="center" sx={{ width: 100, minWidth: 100 }}>
                Action
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <CollapsibleRow
              key={index}
              row={row}
              columns={columns}
              expand={expand}
              onEdit={() => onEdit(row)}
              onDelete={() => console.log('Delete clicked', row.name)}
              action={action}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CollapsibleRow = ({ row, columns, expand, onEdit, onDelete, action }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {expand && (
          <TableCell sx={{ width: 48, minWidth: 48 }}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <ArrowDownOutlined /> : <ArrowRightOutlined />}
            </IconButton>
          </TableCell>
        )}
        {columns.map((column, colIndex) => (
          <TableCell
            align="justify"
            key={colIndex}
            sx={{
              width: column.width || 'auto',
              minWidth: column.minWidth || 100,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {row[column.field]}
          </TableCell>
        ))}
        {action && (
          <TableCell align="center" sx={{ width: 100, minWidth: 100 }}>
            <IconButton aria-label="edit" size="small" color="primary" onClick={onEdit}>
              <EditFilled />
            </IconButton>
            <IconButton aria-label="delete" size="small" color="error" onClick={onDelete}>
              <DeleteFilled />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={columns.length + (expand ? 2 : 1)}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, width: '100%' }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Update PropTypes to include new width properties
TableGrid.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      width: PropTypes.string,
      minWidth: PropTypes.number
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  expand: PropTypes.bool,
  action: PropTypes.bool,
  onEdit: PropTypes.func
};

CollapsibleRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      width: PropTypes.string,
      minWidth: PropTypes.number
    })
  ).isRequired,
  expand: PropTypes.bool.isRequired,
  action: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default TableGrid;
