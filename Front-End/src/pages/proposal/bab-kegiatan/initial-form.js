import * as Yup from 'yup';

export const FieldsData = {
  kegiatan: [
    {
      name: 'activity',
      label: 'Nama Kegiatan',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'person',
      label: 'Penanggungjawab Kegiatan',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    }
  ]
};
