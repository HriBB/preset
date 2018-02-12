// @flow weak

require('app-module-path').addPath(__dirname)

const { static } = require('express')
const { resolve } = require('path')
const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const config = require('config')
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

const uploads = resolve(__dirname, '..', 'uploads')
server.express.use('/uploads', static(uploads))

server.start(config.server, () => console.log('Server is running on http://localhost:4000'))
