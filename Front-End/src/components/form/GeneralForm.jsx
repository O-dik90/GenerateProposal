import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';

import PropTypes from 'prop-types';
import React from 'react';

const GeneralForm = ({ buttonForm, buttonDisable, formData, errors, Fields, handleChange, handleSubmit }) => {
  const renderField = (field) => {
    if (field.type === 'select') {
      // Render Select Dropdown
      return (
        <TextField
          select
          label={field.label}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          error={!!errors[field.name]}
          helperText={errors[field.name] || ''}
        >
          {field.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    // Render TextField or TextArea
    return (
      <TextField
        label={field.label}
        name={field.name}
        type={field.type !== 'textarea' ? field.type : undefined}
        multiline={field.type === 'textarea'}
        rows={field.rows || 3}
        value={formData[field.name] || ''}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors[field.name]}
        helperText={errors[field.name] || ''}
        InputProps={field.inputProps}
      />
    );
  };

  return (
    <Box component="form" noValidate onSubmit={(e) => handleSubmit(e)} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {Fields.map((field, index) => (
          <Grid item xs={12} sm={field.size || 12} key={index}>
            {renderField(field)}
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3, mb: 2 }}>
        <Button variant="contained" color="primary" type="submit" disabled={buttonDisable}>
          {buttonForm}
        </Button>
      </Box>
    </Box>
  );
};

GeneralForm.propTypes = {
  buttonForm: PropTypes.string.isRequired,
  buttonDisable: PropTypes.bool,
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object,
  Fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      size: PropTypes.number,
      type: PropTypes.oneOf(['text', 'email', 'number', 'date', 'textarea', 'select']),
      rows: PropTypes.number,
      inputProps: PropTypes.object,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export { GeneralForm };
