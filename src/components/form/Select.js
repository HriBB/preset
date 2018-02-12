// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'
import FormHelperText from 'material-ui/Form/FormHelperText'
import FormControl from 'material-ui/Form/FormControl'
import InputLabel from 'material-ui/Input/InputLabel'
import Select from 'material-ui/Select'
import Input from 'material-ui/Input'

type Props = {
  children: any,
  className?: string,
  errorClassName?: string,
  inputClassName?: string,
  labelClassName?: string,
  label?: string,
  maxRows?: number,
} & FieldProps

const renderTextField = (props: Props) => {
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
    <FormControl className={className} error={touched && !!error}>
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
