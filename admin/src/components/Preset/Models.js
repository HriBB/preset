// @flow

import React from 'react'
import { Query } from 'react-apollo'

import modelsQuery from './Models.graphql'

const PresetModels = ({ children }: any) => (
  <Query query={modelsQuery}>
    {({ error, loading, data }) => 
      children({
        error,
        loading,
        models: !error && !loading && data
          ? data.schema.types.filter(type => (
              type.interfaces &&
              type.interfaces.length &&
              type.interfaces[0].name === 'Node'
            ))
          : [],
      })
    }
  </Query>
)

export default PresetModels
