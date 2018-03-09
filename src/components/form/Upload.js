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

const renderUploadField = (props: Props) => {
  const {
    className,
    errorClassName,
    inputClassName,
    labelClassName,
    input: { value, ...input },
    meta: { touched, error },
    label,
    ...other
  } = props
  return (
    <FormControl className={className} error={touched && !!error}>
      {label &&
        <InputLabel className={labelClassName} htmlFor={input.name} shrink>
          {label}
        </InputLabel>
      }
      <Input
        {...input}
        {...other}
        className={inputClassName}
        inputProps={{ style: { height: 'auto' } }}
        id={input.name}
        type={'file'}
      />
      {touched && error &&
        <FormHelperText className={errorClassName}>
          {error}</FormHelperText>
      }
    </FormControl>
  )
}

export default renderUploadField
