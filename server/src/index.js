// @flow weak

const { resolve } = require('path')
const preset = resolve(__dirname, '..', '..', 'preset', 'src')
console.log(preset)
require('app-module-path').addPath(__dirname)
require('app-module-path').addPath(preset)

const express = require('express')
const mkdirp = require('mkdirp')
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

mkdirp.sync(config.uploads.path)

server.express.use('/uploads', express.static(config.uploads.path))

server.start(config.server, () => console.log('Server is running on http://localhost:4000'))
