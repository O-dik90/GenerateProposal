import { MenuItem, Stack, TextField } from '@mui/material';

import PropTypes from 'prop-types';
import React from 'react';

const FormField = ({
  name,
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
  row,
  touched,
  InputLabelProps,
  placeholder,
  withoutLabel,
  options = [],
  size
}) => {
  if (type === 'select') {
    return (
      <Stack spacing={1}>
        <TextField
          id={name}
          name={name}
          label={label}
          select
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          error={Boolean(touched && error)}
          helperText={touched && error}
          variant={withoutLabel ? 'standard' : 'outlined'}
          placeholder={placeholder}
          size={size}
          InputLabelProps={InputLabelProps}
          defaultValue={''}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.disabled ? <em>{option.label}</em> : option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    );
  }
  if (type === 'textarea') {
    return (
      <Stack spacing={1}>
        <TextField
          id={name}
          name={name}
          label={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          fullWidth
          error={Boolean(touched && error)}
          helperText={touched && error}
          variant={'outlined'}
          size={size}
          multiline
          rows={row || 4}
          InputLabelProps={InputLabelProps}
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <TextField
        id={name}
        name={name}
        label={label}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth
        error={Boolean(touched && error)}
        helperText={touched && error}
        variant={'outlined'}
        size={size}
        InputLabelProps={InputLabelProps}
      />
    </Stack>
  );
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'select', 'textarea', 'date']).isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
  placeholder: PropTypes.string,
  withoutLabel: PropTypes.bool,
  size: PropTypes.string,
  row: PropTypes.number,
  InputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool
    })
  )
};

export default FormField;
