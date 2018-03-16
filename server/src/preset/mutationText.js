// @flow weak

const models = require('./models')

const f = ({ name, type, required }) => 
  `${name}: ${type === 'File' ? 'Upload' : type}${required ? '!' : ''}`

const mutationText = `${models.map(({ name, fields }, i) => `
  create${name}(${fields.map(f).join(', ')}): ${name}
  update${name}(id: ID!, ${fields.map(f).join(', ')}): ${name}
  delete${name}(id: ID!): ${name}
`).join('')}`

module.exports = mutationText
