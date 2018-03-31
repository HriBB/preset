
import fs from 'fs'
import path from 'path'

import {
  getModel,
  getListQuery,
  getItemQuery,
  getCreateMutation,
  getUpdateMutation,
  getDeleteMutation,
} from '../utils'

const file = path.resolve(__dirname, 'data.json')
const json = fs.readFileSync(file, 'utf8')
const data = JSON.parse(json).data

describe('Preset', () => {
  describe('utils', () => {
    it('can get model data', () => {
      const model = getModel(data)
      expect(model.name).toBeDefined()
      expect(model.models).toBeDefined()
    })
    it('can create model list query', () => {
      const model = getModel(data)
      const query = getListQuery(model)
      // query
      expect(query).toBeDefined()
      expect(query.kind).toBe('Document')
      // definition
      const [definition] = query.definitions
      expect(query.definitions.length).toBe(1)
      expect(definition.kind).toBe('OperationDefinition')
      expect(definition.name.value).toBe('posts')
      // selection set
      const [selection] = definition.selectionSet.selections
      expect(definition.selectionSet.selections.length).toBe(1)
      expect(selection.name.value).toBe('posts')
      // selection set arguments
      expect(selection.arguments.length).toBe(0)
      // selection set selections
      const { selectionSet: { selections } } = selection
      expect(selections[0].name.value).toBe('id')
      expect(selections[1].name.value).toBe('title')
      expect(selections[2].name.value).toBe('text')
      expect(selections[3].name.value).toBe('image')
      expect(selections[3].selectionSet).toBeDefined()
      expect(selections[4].name.value).toBe('published')
    })
    it('can create model item query', () => {
      const model = getModel(data)
      const query = getItemQuery(model)
      // query
      expect(query).toBeDefined()
      expect(query.kind).toBe('Document')
      // definition
      const [definition] = query.definitions
      expect(query.definitions.length).toBe(1)
      expect(definition.kind).toBe('OperationDefinition')
      expect(definition.name.value).toBe('post')
      // variables 
      const [variable] = definition.variableDefinitions
      expect(definition.variableDefinitions.length).toBe(1)
      expect(variable.kind).toBe('VariableDefinition')
      expect(variable.variable.name.value).toBe('id')
      expect(variable.type.kind).toBe('NonNullType')
      expect(variable.type.type.name.value).toBe('ID')
      // selection set
      const [selection] = definition.selectionSet.selections
      expect(definition.selectionSet.selections.length).toBe(1)
      expect(selection.name.value).toBe('post')
      // selection set arguments
      expect(selection.arguments.length).toBe(1)
      expect(selection.arguments[0].name.value).toBe('id')
      expect(selection.arguments[0].value.name.value).toBe('id')
      // selection set selections
      const { selectionSet: { selections } } = selection
      expect(selections[0].name.value).toBe('id')
      expect(selections[1].name.value).toBe('title')
      expect(selections[2].name.value).toBe('text')
      expect(selections[3].name.value).toBe('image')
      expect(selections[3].selectionSet).toBeDefined()
      expect(selections[4].name.value).toBe('published')
    })
    it('can create model create mutation', () => {
      const model = getModel(data)
      const mutation = getCreateMutation(model)
      // mutation
      expect(mutation).toBeDefined()
      expect(mutation.kind).toBe('Document')
      // definition
      const [definition] = mutation.definitions
      expect(mutation.definitions.length).toBe(1)
      expect(definition.kind).toBe('OperationDefinition')
      expect(definition.name.value).toBe('createPost')
      // variables 
      const variables = definition.variableDefinitions
      expect(definition.variableDefinitions.length).toBe(4)
      expect(variables[0].variable.name.value).toBe('title')
      expect(variables[0].type.kind).toBe('NonNullType')
      expect(variables[0].type.type.name.value).toBe('Text')
      expect(variables[1].variable.name.value).toBe('text')
      expect(variables[1].type.kind).toBe('NonNullType')
      expect(variables[1].type.type.name.value).toBe('Textarea')
      expect(variables[2].variable.name.value).toBe('image')
      expect(variables[2].type.kind).toBe('NamedType')
      expect(variables[2].type.name.value).toBe('Upload')
      expect(variables[3].variable.name.value).toBe('published')
      expect(variables[3].type.kind).toBe('NonNullType')
      expect(variables[3].type.type.name.value).toBe('Checkbox')
      // selection set
      const [selection] = definition.selectionSet.selections
      expect(definition.selectionSet.selections.length).toBe(1)
      expect(selection.name.value).toBe('createPost')
      // selection set arguments
      expect(selection.arguments.length).toBe(4)
      expect(selection.arguments[0].name.value).toBe('title')
      expect(selection.arguments[0].value.name.value).toBe('title')
      expect(selection.arguments[1].name.value).toBe('text')
      expect(selection.arguments[1].value.name.value).toBe('text')
      expect(selection.arguments[2].name.value).toBe('image')
      expect(selection.arguments[2].value.name.value).toBe('image')
      expect(selection.arguments[3].name.value).toBe('published')
      expect(selection.arguments[3].value.name.value).toBe('published')
      // selection set selections
      const { selectionSet: { selections } } = selection
      expect(selections[0].name.value).toBe('id')
      expect(selections[1].name.value).toBe('title')
      expect(selections[2].name.value).toBe('text')
      expect(selections[3].name.value).toBe('image')
      expect(selections[3].selectionSet).toBeDefined()
      expect(selections[4].name.value).toBe('published')
    })
    it('can create model update mutation', () => {
      const model = getModel(data)
      const mutation = getUpdateMutation(model)
      // mutation
      expect(mutation).toBeDefined()
      expect(mutation.kind).toBe('Document')
      // definition
      const [definition] = mutation.definitions
      expect(mutation.definitions.length).toBe(1)
      expect(definition.kind).toBe('OperationDefinition')
      expect(definition.name.value).toBe('updatePost')
      // variables 
      const variables = definition.variableDefinitions
      expect(definition.variableDefinitions.length).toBe(5)
      expect(variables[0].variable.name.value).toBe('id')
      expect(variables[0].type.type.name.value).toBe('ID')
      expect(variables[0].type.kind).toBe('NonNullType')
      expect(variables[1].variable.name.value).toBe('title')
      expect(variables[1].type.type.name.value).toBe('Text')
      expect(variables[1].type.kind).toBe('NonNullType')
      expect(variables[2].variable.name.value).toBe('text')
      expect(variables[2].type.type.name.value).toBe('Textarea')
      expect(variables[2].type.kind).toBe('NonNullType')
      expect(variables[3].variable.name.value).toBe('image')
      expect(variables[3].type.name.value).toBe('Upload')
      expect(variables[3].type.kind).toBe('NamedType')
      expect(variables[4].variable.name.value).toBe('published')
      expect(variables[4].type.type.name.value).toBe('Checkbox')
      expect(variables[4].type.kind).toBe('NonNullType')
      // selection set
      const [selection] = definition.selectionSet.selections
      expect(definition.selectionSet.selections.length).toBe(1)
      expect(selection.name.value).toBe('updatePost')
      // selection set arguments
      expect(selection.arguments.length).toBe(5)
      expect(selection.arguments[0].name.value).toBe('id')
      expect(selection.arguments[0].value.name.value).toBe('id')
      expect(selection.arguments[1].name.value).toBe('title')
      expect(selection.arguments[1].value.name.value).toBe('title')
      expect(selection.arguments[2].name.value).toBe('text')
      expect(selection.arguments[2].value.name.value).toBe('text')
      expect(selection.arguments[3].name.value).toBe('image')
      expect(selection.arguments[3].value.name.value).toBe('image')
      expect(selection.arguments[4].name.value).toBe('published')
      expect(selection.arguments[4].value.name.value).toBe('published')
      // selection set selections
      const { selectionSet: { selections } } = selection
      expect(selections.length).toBe(5)
      expect(selections[0].name.value).toBe('id')
      expect(selections[1].name.value).toBe('title')
      expect(selections[2].name.value).toBe('text')
      expect(selections[3].name.value).toBe('image')
      expect(selections[3].selectionSet).toBeDefined()
      expect(selections[4].name.value).toBe('published')
    })
    it('can create model delete mutation', () => {
      const model = getModel(data)
      const mutation = getDeleteMutation(model)
      // mutation
      expect(mutation).toBeDefined()
      expect(mutation.kind).toBe('Document')
      // definition
      const [definition] = mutation.definitions
      expect(mutation.definitions.length).toBe(1)
      expect(definition.kind).toBe('OperationDefinition')
      expect(definition.name.value).toBe('deletePost')
      // variables 
      const variables = definition.variableDefinitions
      expect(definition.variableDefinitions.length).toBe(1)
      expect(variables[0].variable.name.value).toBe('id')
      expect(variables[0].type.type.name.value).toBe('ID')
      expect(variables[0].type.kind).toBe('NonNullType')
      // selection set
      const [selection] = definition.selectionSet.selections
      expect(definition.selectionSet.selections.length).toBe(1)
      expect(selection.name.value).toBe('deletePost')
      // selection set arguments
      expect(selection.arguments.length).toBe(1)
      expect(selection.arguments[0].name.value).toBe('id')
      expect(selection.arguments[0].value.name.value).toBe('id')
      // selection set selections
      const { selectionSet: { selections } } = selection
      expect(selections.length).toBe(1)
      expect(selections[0].name.value).toBe('id')
    })
  })
})
