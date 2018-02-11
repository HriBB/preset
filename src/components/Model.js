// @flow

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import List from 'components/List'
import Create from 'components/Create'
import Edit from 'components/Edit'

const query = gql`
  query ModuleQuery($name: String!) {
    model: model(name: $name) {
      name
      label
      itemQueryName
      listQueryName
      createMutationName
      updateMutationName
      deleteMutationName
      fields {
        name
        label
        type
        null
      }
    }
  }
`

const Module = (props: any) => {
  const { match } = props
  return (
    <Query query={query} variables={{ name: match.params.module }}>
      {({ error, loading, data }) => {
        if (error) return (<p>{error.message}</p>)
        if (loading) return (<p>Loading ...</p>)
        const { model } = data
        return (
          <Switch>
            <Route exact path={`/${model.name}`} render={matchProps =>
              <List {...matchProps} model={model} />
            }/>
            <Route path={`/${model.name}/create`} render={matchProps =>
              <Create {...matchProps} model={model} />
            }/>
            <Route path={`/${model.name}/:id`} render={matchProps =>
              <Edit {...matchProps} model={model} />
            }/>
          </Switch>
        )
      }}
    </Query>
  )
}

export default Module
