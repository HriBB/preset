// @flow

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import List from 'components/List'
import Create from 'components/Create'
import Edit from 'components/Edit'

import { Error, Spinner } from 'components/ux'

const query = gql`
  query ModelQuery($name: String!) {
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

const Model = (props: any) => {
  const { match } = props
  return (
    <Query query={query} variables={{ name: match.params.model }}>
      {({ error, loading, data }) => {
        if (error) return (<Error>{error.message}</Error>)
        if (loading) return (<Spinner />)
        const { model } = data
        if (!model) return (<Error>{`Model ${match.params.model} not found!`}</Error>)
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

export default Model
