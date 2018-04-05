// @flow

import React from 'react'
import type { Node } from 'react'
import { Link } from 'react-router-dom'
import IconButton from 'material-ui/IconButton'

type Props = {
  to: string,
  children: Node,
}

const IconLink = ({ children, to, ...other }: Props) => {
  return (
    <IconButton
      color={'inherit'}
      {...other}
      component={Link}
      to={to}
    >
      {children}
    </IconButton>
  )
}

export default IconLink
