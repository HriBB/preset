// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'
import FormControlLabel from 'material-ui/Form/FormControlLabel'
import FormHelperText from 'material-ui/Form/FormHelperText'
import FormGroup from 'material-ui/Form/FormGroup'
import Switch from 'material-ui/Switch'

const FormSwitch = (props: FieldProps) => {
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
  console.log(props)

  return (
    <FormGroup className={className}>
      {label
        ? <FormControlLabel
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
        : <Switch
            {...input}
            {...other}
            checked={value}
            className={inputClassName}
            id={input.name}
          />
      }
      {touched && error &&
        <FormHelperText className={errorClassName}>{error}</FormHelperText>
      }
    </FormGroup>
  )
}

export default FormSwitch
