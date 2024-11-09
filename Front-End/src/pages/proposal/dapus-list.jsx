import React, { useState } from 'react';

const Table = () => {
  const [newData, setNewData] = useState([]);

  const HandleEdit = (dataToSend, index) => {
    onSendData(dataToSend, index);
    //setIsEdit(true)
    //console.log(IsEdit);
  };

  const HandleDelete = (e) => {
    const deletedata = data.filter((item, index) => {
      return index !== e;
    });
    setNewData(deletedata);
    onRealData(deletedata);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Penulis</th>
          <th>Judul</th>
          <th>Penerbit</th>
          <th>Tahun Terbit</th>
          <th>Volume</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {...newData.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.author}</td>
            <td>{item.title_journal}</td>
            <td>{item.publisher}</td>
            <td>{item.publish_year}</td>
            <td>{item.volume}</td>
            <td>
              <button onClick={() => HandleEdit(item, index)}>Edit</button> <button onClick={() => HandleDelete(index)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
