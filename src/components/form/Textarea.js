// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'
import Input from 'material-ui/Input'
import InputLabel from 'material-ui/Input/InputLabel'
import FormControl from 'material-ui/Form/FormControl'
import FormHelperText from 'material-ui/Form/FormHelperText'

const renderTextField = (props: FieldProps) => {
  const {
    className,
    errorClassName,
    inputClassName,
    labelClassName,
    input,
    label,
    maxRows,
    meta: { touched, error },
    ...other
  } = props
  return (
    <FormControl className={className} error={!!error}>
      {label &&
        <InputLabel className={labelClassName} htmlFor={input.name}>
          {label}
        </InputLabel>
      }
      <Input
        {...input}
        {...other}
        id={input.name}
        className={inputClassName}
        multiline
        rows={10}
        rowsMax={20}
      />
      {touched && error &&
        <FormHelperText className={errorClassName}>{error}</FormHelperText>
      }
    </FormControl>
  )
}

export default renderTextField
