// @flow

import React from 'react'
import { CardHeader } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'

const Dashboard = (props: any) => {
  return (
    <CardHeader
      avatar={
        <Avatar aria-label={'Dashboard'}>
          {'D'}
        </Avatar>
      }
      title={'Dashboard'}
    />
  )
}

export default Dashboard
