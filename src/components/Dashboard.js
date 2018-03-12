// @flow

import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { CardHeader } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import UserIcon from 'material-ui-icons/Person'

import Header from 'components/Header'
import Content from 'components/Content'

const Dashboard = (props: any) => {
  const { user } = props
  return (
    <Fragment>
      <Header title={'Dashboard'}>
        <IconButton component={Link} to={`/user`} color={'inherit'}>
          <UserIcon />
        </IconButton>
      </Header>
      <Content>
        <CardHeader
          avatar={<Avatar aria-label={'Dashboard'}>{'D'}</Avatar>}
          title={`Welcome ${user.username}`}
        />
      </Content>
    </Fragment>
  )
}

export default Dashboard
