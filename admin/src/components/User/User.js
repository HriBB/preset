// @flow

import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Profile from './Profile'
import List from './List'

const User = ({ user }: any) => {
  return (
    <Switch>
      <Route exact path={'/user'} component={Profile} />
      <Route path={'/user/list'} component={List} />
    </Switch>
  )
}

export default User
