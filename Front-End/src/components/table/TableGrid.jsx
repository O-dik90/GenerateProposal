import { ArrowDownOutlined, ArrowRightOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const TableGrid = ({ columns, rows, expand }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {expand == true && <TableCell align="center" sx={{ width: '3rem' }} />}
            {columns.map((item, index) => (
              <TableCell align="center" key={index}>
                {item.name}
              </TableCell>
            ))}
            <TableCell align="center" sx={{ width: '7rem' }}>
              Aksi
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <CollapsibleRow key={index} row={row} columns={columns} expand={expand} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CollapsibleRow = ({ row, columns, expand }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {expand == true && (
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <ArrowDownOutlined /> : <ArrowRightOutlined />}
            </IconButton>
          </TableCell>
        )}
        {columns.map((column, colIndex) => (
          <TableCell align="Right" key={colIndex}>
            {row[column.field]}
          </TableCell>
        ))}
        <TableCell align="center">
          <IconButton variant="contained" color="secondary" onClick={() => alert(`owner row : ${row.name}`)}>
            <EditFilled />
          </IconButton>
          <IconButton variant="contained" color="error" onClick={() => alert(`delete row : ${row.name}`)}>
            <DeleteFilled />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow style={{ paddingBottom: 0, paddingTop: 0 }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
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

// PropTypes for TableGrid
TableGrid.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  expand: PropTypes.bool
};

// PropTypes for CollapsibleRow
CollapsibleRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired
    })
  ).isRequired,
  expand: PropTypes.bool.isRequired
};

export default TableGrid;
