// @flow

const getNameField = ({ fields }: any) => {
  for (let field of fields) {
    if (field.type === 'Text') {
      return field.name
    }
  }
}

const getModelFields = (fields: any) =>
  `{ id ${fields
    .map(
      ({ name, fields }) =>
        fields && fields.length ? `${name} ${getModelFields(fields)}` : name
    )
    .join(' ')} }`

const getMutationArgs = (fields: any) =>
  fields
    .map(
      f =>
        `$${f.name}: ${f.type === 'File' ? 'Upload' : f.type}${
          f.required ? '!' : ''
        }`
    )
    .join(', ')

const getMutationFields = (fields: any) =>
  fields.map(f => `${f.name}: $${f.name}`).join(', ')

const hasQuery = (client: any, query: any) =>
  client.queryManager.queryIdsByName[query.definitions[0].name.value]

module.exports = {
  getNameField,
  getModelFields,
  getMutationArgs,
  getMutationFields,
  hasQuery,
}
