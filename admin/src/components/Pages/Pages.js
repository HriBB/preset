// @flow

import React from 'react'
import { Route, Switch } from 'react-router-dom'

import List from './List'
import Create from './Create'
import Update from './Update'

const Pages = ({ match, data }: any) => {
  return (
    <Switch>
      <Route exact path={'/pages/'} component={List} />
      <Route path={'/pages/create'} component={Create} />
      <Route path={'/pages/:id'} component={Update} />
    </Switch>
  )
}

export default Pages
