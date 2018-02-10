// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'
import FormControlLabel from 'material-ui/Form/FormControlLabel'
import FormHelperText from 'material-ui/Form/FormHelperText'
import FormGroup from 'material-ui/Form/FormGroup'
import Checkbox from 'material-ui/Checkbox'

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

  return (
    <FormGroup className={className}>
      {label
        ? <FormControlLabel
            control={
              <Checkbox
                {...input}
                {...other}
                checked={value}
                className={inputClassName}
                id={input.name}
              />
            }
            label={label}
          />
        : <Checkbox
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
