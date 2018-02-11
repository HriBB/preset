// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'

type Props = {
  //className?: string,
  //errorClassName?: string,
  //inputClassName?: string,
  //labelClassName?: string,
  //label?: string,
  //maxRows?: number,
} & FieldProps

const renderUploadField = (props: Props) => {
  const { input: { value, ...input }, meta, ...other } = props
  return (
    <input {...input} {...other} type={'file'} />
  )
}

export default renderUploadField
