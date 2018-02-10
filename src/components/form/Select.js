// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'
import Select from 'material-ui/Select'
import Input from 'material-ui/Input'
import InputLabel from 'material-ui/Input/InputLabel'
import FormControl from 'material-ui/Form/FormControl'
import FormHelperText from 'material-ui/Form/FormHelperText'

const renderTextField = (props: FieldProps) => {
  const {
    children,
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
      <Select
        {...other}
        {...input}
        className={inputClassName}
        input={<Input id={input.name} value={input.value} />}
      >
        {children}
      </Select>
      {touched && error &&
        <FormHelperText className={errorClassName}>{error}</FormHelperText>
      }
    </FormControl>
  )
}

export default renderTextField
