// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'
import FormHelperText from 'material-ui/Form/FormHelperText'
import FormControl from 'material-ui/Form/FormControl'
import InputLabel from 'material-ui/Input/InputLabel'
import Input from 'material-ui/Input'

type Props = {
  className?: string,
  errorClassName?: string,
  inputClassName?: string,
  labelClassName?: string,
  label?: string,
  maxRows?: number,
} & FieldProps

const renderTextField = (props: Props) => {
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
    <FormControl className={className} error={touched && !!error}>
      {label && (
        <InputLabel className={labelClassName} htmlFor={input.name} shrink>
          {label}
        </InputLabel>
      )}
      <Input
        {...input}
        {...other}
        id={input.name}
        className={inputClassName}
        multiline
        rows={6}
        rowsMax={18}
      />
      {touched &&
        error && (
          <FormHelperText className={errorClassName}>{error}</FormHelperText>
        )}
    </FormControl>
  )
}

export default renderTextField
