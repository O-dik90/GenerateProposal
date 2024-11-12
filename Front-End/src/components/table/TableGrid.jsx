import { ArrowDownOutlined, ArrowRightOutlined, CheckOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const TableGrid = ({ columns, rows, expand, action, onEdit, onDelete, actionEdit, onUpdate }) => {
  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table aria-label="collapsible table" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {expand && <TableCell align="center" width={48} />}
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
              <TableCell align="center" sx={{ width: 100 }}>
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
              onDelete={() => onDelete(row)}
              onUpdate={() => onUpdate(row)}
              action={action}
              actionEdit={actionEdit}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CollapsibleRow = ({ row, columns, expand, onEdit, onDelete, onUpdate, actionEdit, action }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {expand && (
          <TableCell>
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
          <TableCell align="center" sx={{ width: 100 }}>
            {!actionEdit && (
              <IconButton aria-label="edit" size="small" color="primary" onClick={onEdit}>
                <EditFilled />
              </IconButton>
            )}
            {actionEdit && (
              <IconButton aria-label="update" size="small" color="info" onClick={onUpdate}>
                <CheckOutlined />
              </IconButton>
            )}
            <IconButton aria-label="delete" size="small" color="error" onClick={onDelete}>
              <DeleteFilled />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={columns.length + (expand ? 2 : 1)}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ padding: 2, width: '100%' }}>
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
  actionEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func
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
  actionEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func
};

export default TableGrid;
