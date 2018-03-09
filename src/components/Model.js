// @flow

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Query } from 'react-apollo'

import List from 'components/List'
import Create from 'components/Create'
import Update from 'components/Update'

import { Error, Spinner } from 'components/ux'
import { modelQuery } from 'preset/queries'

const Model = (props: any) => {
  const { match } = props
  return (
    <Query query={modelQuery} variables={{ name: match.params.model }}>
      {({ error, loading, data }) => {
        if (error) return <Error>{error.message}</Error>
        if (loading) return <Spinner />
        const { model } = data
        if (!model)
          return <Error>{`Model ${match.params.model} not found!`}</Error>
        return (
          <Switch>
            <Route
              exact
              path={`/${model.name}`}
              render={matchProps => <List {...matchProps} model={model} />}
            />
            <Route
              path={`/${model.name}/create`}
              render={matchProps => <Create {...matchProps} model={model} />}
            />
            <Route
              path={`/${model.name}/:id`}
              render={matchProps => <Update {...matchProps} model={model} />}
            />
          </Switch>
        )
      }}
    </Query>
  )
}

export default Model
