import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';

import PropTypes from 'prop-types';
import React from 'react';
import { formatCurrency } from 'utils/format-currency';

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
  size,
  currency = false,
  currencySymbol = 'Rp'
}) => {
  const handleCurrencyInputChange = (e) => {
    let rawValue = e.target.value.replace(/[^\d]/g, '');
    onChange({ target: { name, value: rawValue } });
  };
  if (currency) {
    return (
      <Stack spacing={1}>
        <TextField
          id={name}
          name={name}
          label={label}
          type="text"
          value={formatCurrency(value)}
          onChange={handleCurrencyInputChange}
          onBlur={onBlur}
          fullWidth
          error={Boolean(touched && error)}
          helperText={touched && error}
          variant={withoutLabel ? 'standard' : 'outlined'}
          placeholder={placeholder}
          size={size}
          InputLabelProps={InputLabelProps}
          InputProps={{
            startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
        />
      </Stack>
    );
  }

  // Select type handling
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

  // Textarea type handling
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
          rows={row}
          InputLabelProps={InputLabelProps}
        />
      </Stack>
    );
  }

  // Default text field handling
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
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'select', 'textarea', 'date', 'currency']).isRequired,
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
  ),
  currency: PropTypes.bool,
  currencySymbol: PropTypes.string,
  decimalPrecision: PropTypes.number,
  locale: PropTypes.string
};

export default FormField;
