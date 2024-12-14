import * as Yup from 'yup';
export const SampleFields = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter email address',
    validation: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    width: 2
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    validation: Yup.string().max(255).required('Password is required'),
    width: 2
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your name',
    validation: Yup.string().max(255).required('Name is required'),
    width: 6
  },
  {
    name: 'numbering',
    label: 'Numbering',
    withoutLabel: true,
    type: 'number',
    placeholder: 'Enter a number',
    validation: Yup.number().required('Numbering is required').min(1, 'Numbering must be greater than or equal to 1'),
    width: 2
  },
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    InputLabelProps: { shrink: true },
    placeholder: 'Isi Tanggal',
    validation: Yup.date().required('Date is required'),
    width: 2
  },
  {
    name: 'newselector',
    label: 'New Selector',
    type: 'select',
    options: [
      { value: '', label: 'Pilihan', disabled: true },
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' }
    ],
    placeholder: 'Select an option',
    validation: Yup.string().required('New Selector is required'),
    width: 2
  },
  {
    name: 'year',
    label: 'Year',
    type: 'text',
    placeholder: 'Enter year',
    validation: Yup.string()
      .matches(/^[0-9]+$/, 'Year must be a number') // Validate input contains only numbers
      .test('is-valid-year', `Year must be between 1900 and ${new Date().getFullYear()}`, (value) => {
        const year = Number(value);
        return year >= 1900 && year <= new Date().getFullYear();
      })
      .required('Year is required'),
    width: 2
  }
];
