// @flow

const getNameField = ({ fields }: any) => {
  for (let field of fields) {
    if (field.type === 'Text') {
      return field.name
    }
  }
}

const getModelFields = (fields: any) =>
  `{ id ${fields.map(({ name, fields }) =>
    fields && fields.length ? `${name} ${getModelFields(fields)}` : name
  ).join(' ')} }`

const getModelInitialValues = (model: any) =>
  model.fields.reduce((values, field) => {
    if (field.default) {
      values[field.name] = field.default
    } else if (field.type === 'Checkbox') {
      values[field.name] = false
    }
    return values
  }, {})

const getMutationArgs = (fields: any) =>
  fields.map(f =>
    `$${f.name}: ${f.type === 'File' ? 'Upload' : f.type}${
      f.required ? '!' : ''
    }`
  ).join(', ')

const getMutationFields = (fields: any) =>
  fields.map(f => `${f.name}: $${f.name}`).join(', ')

const hasQuery = (client: any, query: any) =>
  client.queryManager.queryIdsByName[query.definitions[0].name.value]

const getCreateVariables = ({ model }: any, data: any) =>
  model.fields.reduce((obj, { name, type, list }) => {
    if (!data.hasOwnProperty(name)) {
      obj[name] = null
    } else if (type === 'File') {
      obj[name] = list ? data[name] : data[name] && data[name].length ? data[name][0] : null
    } else {
      obj[name] = data[name]
    }
    return obj
  }, {})

const getUpdateVariables = (props: any, data: any) => ({
  id: data.id, 
  ...getCreateVariables(props, data),
})

const getCreateUpdateHandler = (props: any) => (proxy: any, { data: result }: any) => {
  const { client, listQuery, createMutationName } = props
  const newItem = result[createMutationName]
  if (hasQuery(client, listQuery)) {
    const data = proxy.readQuery({ query: listQuery })
    data.items.push(newItem)
    proxy.writeQuery({ query: listQuery, data })
  }
}

const getUpdateUpdateHandler = (id: any, props: any) => (proxy: any, { data: result }: any) => {
  const { client, listQuery, updateMutationName } = props
  const newItem = result[updateMutationName]
  if (hasQuery(client, listQuery)) {
    const data = proxy.readQuery({ query: listQuery })
    const index = data.items.findIndex(i => i.id === id)
    data.items[index] = newItem
    proxy.writeQuery({ query: listQuery, data })
  }
}

module.exports = {
  getNameField,
  getModelFields,
  getModelInitialValues,
  getMutationArgs,
  getMutationFields,
  getCreateVariables,
  getUpdateVariables,
  getCreateUpdateHandler,
  getUpdateUpdateHandler,
  hasQuery,
}
