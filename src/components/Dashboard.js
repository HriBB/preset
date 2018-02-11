// @flow

import React from 'react'
import { CardHeader } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'

const Dashboard = (props: any) => {
  const { user } = props
  return (
    <CardHeader
      avatar={
        <Avatar aria-label={'Dashboard'}>
          {'D'}
        </Avatar>
      }
      title={`Welcome ${user.username}`}
    />
  )
}

export default Dashboard
