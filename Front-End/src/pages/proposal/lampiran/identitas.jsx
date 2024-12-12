import { MenuItem, Select, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { masterGender, masterLampiranRole } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import { GeneralForm } from 'components/form/GeneralForm';
import { ID_INIT } from './initial';
import TableGrid from 'components/table/TableGrid';

const Identitas = () => {
  const { gender } = useSelector((state) => state.app.masterData);
  const { role } = useSelector((state) => state.app.masterData.lampiran);
  const dispatch = useDispatch(),
    [object, setObject] = React.useState(ID_INIT),
    [data, setData] = useState([]),
    [errors, setErrors] = useState({});
  const Fields = {
    personal: [
      { name: 'name', label: 'Nama Lengkap', type: 'text', size: 6 },
      { name: 'email', label: 'Alamat Email', type: 'email', size: 3 },
      { name: 'phone', label: 'No Telepon/HP', type: 'text', size: 3 },
      { name: 'id_no', label: 'NIM / NIDM', type: 'text', size: 4 },
      {
        name: 'gender',
        label: 'Jenis Kelamin',
        type: 'select',
        options: [
          { value: 'L', label: 'Laki-laki' },
          { value: 'P', label: 'Perempuan' }
        ],
        size: 2
      },
      { name: 'place_of_birth', label: 'Tempat Lahir', type: 'text', size: 3 },
      { name: 'birthday', label: 'Tanggal Lahir', type: 'date', size: 3 }
    ]
  };

  const validate = () => {
    const newErrors = {};
    if (!object.name) newErrors.name = 'Nama wajib diisi. Untuk Dosen disertakan gelar';
    if (!object.email) newErrors.email = 'Email wajib diisi';
    if (!object.phone) newErrors.phone = 'No Telepon wajib diisi';

    return newErrors;
  };

  const handleIdentitas = {
    onchange: (e) => {
      const { name, value } = e.target;
      setObject((prevData) => ({
        ...prevData,
        [name]: value
      }));
    },
    add: (e) => {
      e.preventDefault();
      const newErrors = validate();

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        console.log('Form Data Submitted:', object);
        setErrors({});
        setData((prev) => [...prev, { ...object, no: prev.length === 0 ? 1 : prev.length + 1 }]);
      }
      setObject(ID_INIT);
    },
    edit: (param) => {
      setObject(param);
    },
    update: () => {
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      }

      setData((prev) => {
        const updatedData = [...prev];
        const index = updatedData.findIndex((item) => item.no === object.no);
        if (index !== -1) {
          updatedData[index] = { ...object, no: object.no };
        }
        return updatedData;
      });
      setErrors({});
      setObject(ID_INIT);
    },
    delete: (param) => {
      const updatedData = [...data];
      updatedData.splice(param, 1);
      setData(updatedData);
    }
  };

  useEffect(() => {
    const loadMasterData = async () => {
      if (role.length <= 0) {
        await dispatch(masterLampiranRole({ source_name: 'ROLE_IDENTITAS' }));
      }
      if (gender.length <= 0) {
        await dispatch(masterGender({ source_name: 'GENDER' }));
      }
    };

    loadMasterData();
  }, [dispatch, gender, role]);

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <Stack direction="column" spacing={2}>
      <Select
        id="role_person"
        displayEmpty
        value={object.role_person}
        onChange={handleIdentitas.onchange}
        sx={{ width: '15rem' }}
        name="role_person"
      >
        <MenuItem disabled value="">
          <em>Pilih Keanggotaan</em>
        </MenuItem>
        {role.map((item) => (
          <MenuItem key={item.id} value={item.code}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
      <GeneralForm
        buttonForm="Tambah Data"
        buttonDisable={false}
        formData={object}
        errors={errors}
        Fields={Fields.personal}
        handleChange={handleIdentitas.onchange}
        handleSubmit={handleIdentitas.add}
      />
      <TableGrid
        key={`grid-Identitas`}
        columns={[
          { name: 'No', field: 'no', width: '4rem' },
          { name: 'Jabatan', field: 'role_person', width: '6rem' },
          { name: 'Nama Lengkap', field: 'name' }
        ]}
        rows={data}
        expand={false}
        action
        onEdit={handleIdentitas.edit}
        onDelete={handleIdentitas.delete}
        onUpdate={handleIdentitas.update}
        detail={''}
      />
    </Stack>
  );
};

export { Identitas };
