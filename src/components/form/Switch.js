// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'
import FormControlLabel from 'material-ui/Form/FormControlLabel'
import FormHelperText from 'material-ui/Form/FormHelperText'
import FormControl from 'material-ui/Form/FormControl'
import Switch from 'material-ui/Switch'

type Props = {
  className?: string,
  errorClassName?: string,
  inputClassName?: string,
  labelClassName?: string,
  label?: string,
  maxRows?: number,
} & FieldProps

const FormSwitch = (props: Props) => {
  const {
    className,
    errorClassName,
    inputClassName,
    labelClassName,
    input: { value, ...input },
    label,
    maxRows,
    meta: { touched, error },
    ...other
  } = props

  return (
    <FormControl className={className} error={touched && !!error}>
      {label ? (
        <FormControlLabel
          control={
            <Switch
              {...input}
              {...other}
              checked={value}
              className={inputClassName}
              id={input.name}
            />
          }
          label={label}
        />
      ) : (
        <Switch
          {...input}
          {...other}
          checked={value}
          className={inputClassName}
          id={input.name}
        />
      )}
      {touched &&
        error && (
          <FormHelperText className={errorClassName}>{error}</FormHelperText>
        )}
    </FormControl>
  )
}

export default FormSwitch
