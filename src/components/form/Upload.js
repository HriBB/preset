// @flow

import React from 'react'
import type { FieldProps } from 'redux-form'

const renderUploadField = (props: FieldProps) => {
  const { input: { value, ...input }, meta, ...other } = props
  return (
    <input {...input} {...other} type={'file'} />
  )
}

export default renderUploadField
