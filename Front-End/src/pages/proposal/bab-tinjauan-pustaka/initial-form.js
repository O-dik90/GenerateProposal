import * as Yup from 'yup';

export const FieldsData = {
  tinjauan: [
    {
      name: 'title',
      label: 'Judul Sub Bab',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 12
    },
    {
      name: 'description',
      label: 'Deskripsi',
      type: 'textarea',
      row: 10,
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 12
    }
  ]
};
