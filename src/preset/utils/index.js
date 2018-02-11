// @flow

exports.getNameField = ({ fields }: any) => {
  for (let field of fields) {
    if (field.type === 'Text') {
      return field.name
    }
  }
}

exports.getMutationArgs = (fields: any) => (
  fields.map(f => `$${f.name}: ${f.type}${f.null?'':'!'}`).join(', ')
)

exports.getMutationFields = (fields: any) => (
  fields.map(f => `${f.name}: $${f.name}`).join(', ')
)

exports.hasQuery = (proxy: any, query: any) => {
  return !!proxy.watches.find(watch => 
    watch.query.definitions[0].name.value === query.definitions[0].name.value
  )
}

