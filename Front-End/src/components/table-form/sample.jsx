import React from 'react';
import { TableForm } from '.';

const columns = [
  {
    name: 'Name',
    field: 'name',
    width: '200px'
  },
  {
    name: 'Age',
    field: 'age',
    width: '100px'
  },
  {
    name: 'Status',
    field: 'status',
    cell: (value, row) => (
      <span style={{ color: value === 'Active' ? 'blue' : 'red' }}>
        {value} {row.age > 30 ? '(Senior)' : ''}
      </span>
    )
  }
];

const rows = [
  { name: 'John Doe', age: 25, status: 'Active' },
  { name: 'Jane Smith', age: 35, status: 'Inactive' }
];

const detailRenderer = (row) => (
  <div>
    <p>
      <strong>Name:</strong> {row.name}
    </p>
    <p>
      <strong>Age:</strong> {row.age}
    </p>
    <p>
      <strong>Status:</strong> {row.status}
    </p>
  </div>
);

const App = () => {
  return <TableForm columns={columns} rows={rows} expand={true} detail={detailRenderer} />;
};

export default App;
