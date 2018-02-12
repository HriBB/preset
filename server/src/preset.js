// @flow weak

const path = require('path')
const keyBy = require('lodash.keyby')

const { buildASTSchema, parse } = require('graphql')
const { importSchema } = require('graphql-import')
const { GraphQLUpload } = require('apollo-upload-server')
const GraphQLJSON = require('graphql-type-json')
const GraphQLScalar = require('graphql-scalar-types').default

const config = require('config')
const { getUserId } = require('user')
const { getModels } = require('utils')

const schema = importSchema(path.resolve(__dirname, 'schema.graphql'))
const ast = buildASTSchema(parse(schema))
const models = getModels(ast)
const modelsByName = keyBy(models, 'name')

const queryText = `
  files: [File]
  file(id: ID!): File
  models: [Model]
  model(name: String!): Model
  ${models.map(m => `
  ${m.listQueryName}: [${m.name}]
  ${m.itemQueryName}(id: ID!): ${m.name}
  `).join('')}
`

const queries = Object.assign(
  {
    files: (parent, args, ctx, info) => {
      return ctx.db.query.files({}, info)
    },
    file: (parent, { id }, ctx, info) => {
      return ctx.db.query.file({ where: { id } }, info)
    },
    models: (parent, { name }, ctx, info) => {
      return models
    },
    model: (parent, { name }, ctx, info) => {
      if (!modelsByName[name]) {
        throw new Error(`Model ${name} not found!`)
      }
      return modelsByName[name]
    },
  },
  models.reduce((queries, { itemQueryName, listQueryName }) => {
    queries[itemQueryName] = (parent, { id }, ctx, info) => {
      return ctx.db.query[itemQueryName]({ where: { id } }, info)
    }
    queries[listQueryName] = (parent, args, ctx, info) => {
      return ctx.db.query[listQueryName]({}, info)
    }
    return queries
  }, {})
)

const mutationText = models.map((m, i) => `
  create${m.name}(${m.fields.map(f => `${f.name}: ${f.type}${f.required?'!':''}`).join(', ')}): ${m.name}
  update${m.name}(id: ID!, ${m.fields.map(f => `${f.name}: ${f.type}${f.required?'!':''}`).join(', ')}): ${m.name}
  delete${m.name}(id: ID!): ${m.name}
`).join('')

const mutations = models.reduce((mutations, model) => {
  const { name, createMutationName, updateMutationName, deleteMutationName } = model
  mutations[createMutationName] = (parent, args, ctx, info) => {
    const userId = getUserId(ctx)
    return ctx.db.mutation[createMutationName](
      {
        data: {
          ...args,
          author: { connect: { id: userId } },
        },
      },
      info
    )
  }
  mutations[updateMutationName] = async (parent, { id, ...data }, ctx, info) => {
    const userId = getUserId(ctx)
    const exists = await ctx.db.exists[name]({ id })
    if (!exists) {
      throw new Error(`${name} not found or you're not the owner!`)
    }
    return ctx.db.mutation[updateMutationName](
      {
        data,
        where: { id },
      },
      info,
    )
  }
  mutations[deleteMutationName] = async (parent, { id }, ctx, info) => {
    const userId = getUserId(ctx)
    const exists = await ctx.db.exists[name]({ id })
    if (!exists) {
      throw new Error(`${name} not found or you're not the owner!`)
    }
    return ctx.db.mutation[deleteMutationName]({ where: { id } })
  }
  return mutations
}, {})

const directives = {
  model(resolve, src, args, context) {
    return resolve()
  },
  field(resolve, src, args, context) {
    return resolve()
  },
}

const resolvers = {
  File: {
    url: ({ filename }) => `${config.uploads.url}/${filename}`,
  },
  Upload: GraphQLUpload,
  Text: GraphQLScalar.string('Text').description('Text').min(1).max(255).create(),
  Textarea: GraphQLScalar.string('Textarea').description('Textarea').min(1).max(5000).create(),
  Checkbox: GraphQLScalar.boolean('Checkbox').description('Checkbox').create(),
}

module.exports = {
  schema,
  queryText,
  mutationText,
  queries,
  mutations,
  directives,
  resolvers,
}


