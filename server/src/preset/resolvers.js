// @flow weak

const { GraphQLUpload } = require('apollo-upload-server')
const GraphQLJSON = require('graphql-type-json')
const GraphQLScalar = require('graphql-scalar-types').default

const config = require('config')

module.exports = {
  File: {
    url: ({ filename }) => `${config.uploads.url}/${filename}`,
  },
  JSON: GraphQLJSON,
  Upload: GraphQLUpload,
  Text: GraphQLScalar.string('Text').description('Text').min(1).max(255).create(),
  Textarea: GraphQLScalar.string('Textarea').description('Textarea').min(1).max(5000).create(),
  Checkbox: GraphQLScalar.boolean('Checkbox').description('Checkbox').create(),
}
