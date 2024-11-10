import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

// import validateField from './validation';

const TableForm = ({ buttonForm, Fields, onSubmit, formData, handleChange }) => {
  // const [formData, setFormData] = useState({
  //   author: '',
  //   title_journal: '',
  //   publisher: '',
  //   publish_year: '',
  //   volume: '',
  //   price: '',
  //   publish_date: '',
  //   category: '',
  //   description: ''
  // });

  // const [errors, setErrors] = useState({});

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   formData((prevData) => ({
  //     ...prevData,
  //     [name]: value
  //   }));

  // const error = validateField(name, value);
  // setErrors((prev) => ({
  //   ...prev,
  //   [name]: error
  // }));
  // };

  // const handleSubmit = (e) => {
  // e.preventDefault();

  // // Validate all fields
  // const newErrors = {};
  // Object.keys(formData).forEach((key) => {
  //   const error = validateField(key, formData[key]);
  //   if (error) newErrors[key] = error;
  // });

  // if (Object.keys(newErrors).length === 0) {
  //   onSubmit?.(formData);
  //   console.log('ok');
  //   // Reset form after successful submission
  //   setFormData({
  //     author: '',
  //     title_journal: '',
  //     publisher: '',
  //     publish_year: '',
  //     volume: '',
  //     price: '',
  //     publish_date: '',
  //     category: '',
  //     description: ''
  //   });
  // } else {
  //   setErrors(newErrors);
  // }
  // };

  const renderField = (field) => {
    if (field.type === 'select') {
      return (
        <TextField
          select
          label={field.label}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          // error={!!errors[field.name]}
          // helperText={errors[field.name]}
        >
          {field.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (field.type === 'date') {
      return (
        <span>
          <DatePicker
            label={field.label}
            value={formData[field.name] || null} // Add null fallback
            onChange={(newValue) => {
              const dateValue = newValue instanceof Date ? newValue.toISOString() : newValue;
              handleChange({ target: { name: field.name, value: dateValue } });
            }}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
          />
        </span>
      );
    }

    return (
      <TextField
        label={field.label}
        name={field.name}
        type={field.type}
        multiline={field.type === 'textarea'}
        rows={field.rows}
        variant="outlined"
        value={formData[field.name]}
        onChange={handleChange}
        fullWidth
        // error={!!errors[field.name]}
        // helperText={errors[field.name]}
        InputProps={field.inputProps}
      />
    );
  };

  return (
    <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {Fields.map((field, index) => (
          <Grid item xs={12} sm={field.size} key={index}>
            {renderField(field)}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, mb: 2 }}>
        <Button variant="contained" color="success" type="submit">
          {buttonForm}
        </Button>
      </Box>
    </Box>
  );
};

TableForm.propTypes = {
  buttonForm: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  Fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,

      size: PropTypes.number.isRequired,
      type: PropTypes.oneOf(['text', 'number', 'date', 'textarea', 'select']),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired,
  onSubmit: PropTypes.func,
  handleChange: PropTypes.func
};

export default TableForm;
