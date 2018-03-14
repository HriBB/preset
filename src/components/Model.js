// @flow

import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Query } from 'react-apollo'
import { Trans } from '@lingui/react'

import List from 'components/List'
import Create from 'components/Create'
import Update from 'components/Update'

import { Header, Error, Spinner } from 'components/ux'
import { modelQuery } from 'preset/queries'

const Model = (props: any) => {
  const { match } = props
  return (
    <Query query={modelQuery} variables={{ name: match.params.model }}>
      {({ error, loading, data }) => {
        if (error) {
          return (
            <Fragment>
              <Header title={<Trans>Error</Trans>} />
              <Error>{error.message}</Error>
            </Fragment>
          )
        }
        if (loading) {
          return (
            <Fragment>
              <Header />
              <Spinner />
            </Fragment>
          )
        }
        if (!data.model) {
          return (
            <Fragment>
              <Header title={<Trans>Error</Trans>} />
              <Trans>Model {match.params.model} not found!</Trans>
            </Fragment>
          )
        }
        const { model } = data
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
