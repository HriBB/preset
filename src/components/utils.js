// @flow

import parse from 'parse-key-value'

export function getSchemaModules(schema) {
  return schema.types.filter(type =>
    type.kind === 'OBJECT' &&
    type.interfaces.length &&
    type.interfaces[0].name === 'Node'
  )
}

export function getTypeNameField({ fields }) {
  for (let field of fields) {
    if (
      field.type.ofType.kind === 'SCALAR' &&
      field.type.ofType.name === 'String'
    ) {
      return field.name
    }
  }
}

export function getTypeQueryFields({ fields }) {
  return fields
    .filter(({ name, args }) => 
      name !== 'password' &&
      args.length === 0
    )
    .map(({ name }) => name)
    .join(' ')
}

export function getTypeFormFields__old({ fields }) {
  return fields
    .filter(({ name, type: { ofType }}) =>
      name !== 'password' &&
      ofType.kind === 'SCALAR' &&
      ofType.name !== 'ID'
    )
    .map(({ name, type: { ofType } }) => {
      let component, type
      switch (ofType.name) {
        case 'String':
          component = 'input'
          type = 'text'
          break
        case 'Text':
          component = 'textarea'
          type = 'text'
          break
        case 'Boolean':
          component = 'input'
          type = 'checkbox'
          break
        case 'Int':
          component = 'input'
          type = 'number'
          break
        case 'Enum':
          component = 'select'
          type = 'select'
          break
        default:
          component = 'text'
          type = 'text'
          break
      }
      return { component, name, type }
    })
}

export function getTypeFormFields({ fields }) {
  return fields
    .filter(({ name, description, type }) =>
      type.ofType.kind === 'SCALAR' &&
      description
    )
    .map(({ name, description }) => {
      return {
        name,
        ...parse(description)
      }
    })
}