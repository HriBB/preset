// @flow weak

const models = require('./models')

const queryText = `
  files: [File]
  file(id: ID!): File
  models: [Model]
  model(name: String!): Model
  translations(lang: String! ns: [String]): JSON
  ${models.map(model => `
  ${model.listQueryName}: [${model.name}]
  ${model.itemQueryName}(id: ID!): ${model.name}
`).join('')}`

module.exports = queryText
