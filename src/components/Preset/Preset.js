// @flow

import React from 'react'
import { Query } from 'react-apollo'
import { Trans } from '@lingui/react'
import { Route, Switch } from 'react-router-dom'

import { Body, Header, Error, Spinner } from 'components/ux'
import List from './List'
import Create from './Create'
import Update from './Update'
import { getModel } from './utils'
import modelQuery from './Preset.graphql'

const Preset = ({ match }: any) => (
  <Query query={modelQuery} variables={{ name: match.params.model }}>
    {({ error, loading, data }) => {
      if (error) {
        return (
          <Body>
            <Header title={<Trans>Error</Trans>} />
            <Error>{error.message}</Error>
          </Body>
        )
      }
      if (loading) {
        return (
          <Body>
            <Header />
            <Spinner />
          </Body>
        )
      }
      if (!data.model) {
        return (
          <Body>
            <Header title={<Trans>Error</Trans>} />
            <Error>
              <Trans>Model not found</Trans>
            </Error>
          </Body>
        )
      }
      const model = getModel(data)
      return (
        <Body>
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
        </Body>
      )
    }}
  </Query>
)

export default Preset
