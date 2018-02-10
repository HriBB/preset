// @flow

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import List from './List'
import Edit from './Edit'

const query = gql`
  query ModuleQuery($name: String!) {
    type: __type(name: $name) {
      kind
      name
      description
      fields {
        name
        description
        type {
          ofType {	
            kind
            name
            fields {
              name
            }
          }
        }
        args {
          name
        }
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
        const { type } = data
        return (
          <div>
            <Switch>
              <Route exact path={`/${type.name}`} render={matchProps =>
                <List {...matchProps} type={type} />
              }/>
              <Route path={`/${type.name}/:id`} render={matchProps =>
                <Edit {...matchProps} type={type} />
              }/>
            </Switch>
          </div>
        )
      }}
    </Query>
  )
}

export default Module
