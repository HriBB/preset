// @flow weak

const { GraphQLUpload } = require('apollo-upload-server')
const GraphQLJSON = require('graphql-type-json')
const GraphQLScalar = require('graphql-scalar-types').default

const config = require('config')

module.exports = {
  JSON: GraphQLJSON,
  Upload: GraphQLUpload,
  Text: GraphQLScalar.string('Text').min(1).max(255).create(),
  Textarea: GraphQLScalar.string('Textarea').min(1).max(5000).create(),
  Checkbox: GraphQLScalar.boolean('Checkbox').create(),
  File: {
    url: ({ filename }) => `${config.uploads.url}/${filename}`,
  },
  Node: {
    __resolveType: (obj) => {
      console.log('__resolveType', obj)
      return 'Node'
    },
  },
}
