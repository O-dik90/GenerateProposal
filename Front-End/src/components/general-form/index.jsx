import * as Yup from 'yup';

import { Button, Grid } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';

import FormField from './FormField';
import PropTypes from 'prop-types';

const GenForm = ({ formFields = [], buttonDisable = false, onSubmit, titleButton = 'Simpan', initialValuesUpdate = {} }) => {
  const initialValues = useMemo(() => {
    return Object.keys(initialValuesUpdate).length
      ? initialValuesUpdate
      : formFields.reduce((acc, field) => {
          acc[field.name] = field.initialValue || '';
          return acc;
        }, {});
  }, [formFields, initialValuesUpdate]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape(
      formFields.reduce((acc, field) => {
        acc[field.name] = field.validation;
        return acc;
      }, {})
    );
  }, [formFields]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        if (onSubmit) {
          await onSubmit(values);
        }
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, handleBlur, handleChange, values, touched, errors }) => {
        const handleCustomChange = (e) => {
          handleChange(e);
        };

        return (
          <Form noValidate>
            <Grid container spacing={2}>
              {formFields.map(({ name, label, type, options, withoutLabel = false, placeholder, width, row = 5 }) => (
                <Grid item xs={12} sm={width || 12} key={name}>
                  <FormField
                    name={name}
                    label={label}
                    type={type}
                    value={values[name] || ''}
                    onBlur={handleBlur}
                    onChange={handleCustomChange}
                    error={errors[name]}
                    touched={touched[name]}
                    placeholder={placeholder}
                    row={row}
                    withoutLabel={withoutLabel}
                    options={options}
                    InputLabelProps={{ shrink: type === 'date' ? true : undefined }}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  disableElevation
                  disabled={isSubmitting || !isValid || buttonDisable}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isSubmitting ? 'Loading...' : titleButton}
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

GenForm.propTypes = {
  formFields: PropTypes.array.isRequired,
  buttonDisable: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  titleButton: PropTypes.string,
  initialValuesUpdate: PropTypes.object
};

export default GenForm;
