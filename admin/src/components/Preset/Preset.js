// @flow

import React from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { query } from 'react-apollo/query-hoc'
import { Route, Switch } from 'react-router-dom'

import { getModel } from './utils'

import { ErrorView, LoadingView, NotFoundView } from 'components/ux'

import List from './List'
import Create from './Create'
import Update from './Update'
import modelQuery from './Preset.graphql'

const Preset = ({ match, data }: any) => {
  const model = getModel(data)
  return (
    <Switch>
      <Route
        exact
        path={`/model/${model.name}`}
        render={matchProps => <List {...matchProps} model={model} />}
      />
      <Route
        path={`/model/${model.name}/create`}
        render={matchProps => <Create {...matchProps} model={model} />}
      />
      <Route
        path={`/model/${model.name}/:id`}
        render={matchProps => <Update {...matchProps} model={model} />}
      />
    </Switch>
  )
}

export default compose(
  query(modelQuery, {
    options: ({ match }) => ({
      variables: { name: match.params.model },
    }),
  }),
  branch(
    ({ data }) => data.loading,
    renderComponent(LoadingView),
  ),
  branch(
    ({ data }) => data.error,
    renderComponent(ErrorView),
  ),
  branch(
    ({ data }) => !data.model,
    renderComponent(NotFoundView),
  ),
)(Preset)
