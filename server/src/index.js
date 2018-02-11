// @flow weak

require('app-module-path').addPath(__dirname)

const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const schema = require('schema')

const server = new GraphQLServer({
  schema,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: './src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      debug: true,
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
