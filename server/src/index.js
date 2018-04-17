// @flow weak

const express = require('express')
const mkdirp = require('mkdirp')
const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

require('app-module-path').addPath(__dirname)
const config = require('config')
const schema = require('schema')

const server = new GraphQLServer({
  schema,
  context: req => ({
    ...req,
    db: new Prisma(config.db),
  }),
})

mkdirp.sync(config.uploads.path)

server.express.use('/uploads', express.static(config.uploads.path))

server.start(config.server, () => console.log('Server is running on http://localhost:4000'))

process.on('beforeExit', () => {
  console.log('beforeExitt')
})
