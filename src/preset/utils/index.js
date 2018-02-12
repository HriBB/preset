// @flow

exports.getNameField = ({ fields }: any) => {
  for (let field of fields) {
    if (field.type === 'Text') {
      return field.name
    }
  }
}

exports.getMutationArgs = (fields: any) => (
  fields.map(f => `$${f.name}: ${f.type}${f.required?'!':''}`).join(', ')
)

exports.getMutationFields = (fields: any) => (
  fields.map(f => `${f.name}: $${f.name}`).join(', ')
)

exports.hasQuery = (client: any, query: any) => {
  if (!client) {
    throw new Error('Missing client')
  }
  if (!query) {
    throw new Error('Missing query')
  }
  return client.queryManager.queryIdsByName[query.definitions[0].name.value]
}

