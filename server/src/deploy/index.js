// @flow weak

const { exec } = require('child_process')
const { resolve } = require('path')
const shortid = require('shortid')

const config = require('config')
const { readSchema } = require('utils')

const typeDefs = readSchema(resolve(__dirname, 'schema.graphql'))

let deployInProgress = false
let deployStack = []

const queries = {
  deploy: (parent, args, ctx, info) => {
    if (deployInProgress) {
      return [{
        id: `${deployInProgress}-0`,
        data: 'Deploy in progress ...',
      }]
    }
    return []
  }
}

const mutations = {
  deploy: async (parent, args, { pubsub }, info) => {
    if (deployInProgress) {
      throw new Error('Deploy is already in progress')
    }
    deployInProgress = shortid.generate()
    const command = `cd ${config.website.path} && yarn build`
    const child = exec(command)
    let i = 1
    child.stdout.on('data', data => {
      pubsub.publish('deploy', { deploy: { id: `${deployInProgress}-${i++}`, data }})
    })
    child.once('error', error => {
      pubsub.publish('deploy', { deploy: { id: `${deployInProgress}-${i++}`, data: error }})
      pubsub.publish('deploy', { deploy: { id: `${deployInProgress}-${i++}`, data: 'error' }})
      deployInProgress = false
    })
    child.once('exit', code => {
      pubsub.publish('deploy', { deploy: { id: `${deployInProgress}-${i++}`, data: `code=${code}` }})
      pubsub.publish('deploy', { deploy: { id: `${deployInProgress}-${i++}`, data: 'done' }})
      deployInProgress = false
    })
  },
}

const subscriptions = {
  deploy: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('deploy')
    },
  },
}

module.exports = {
  typeDefs,
  queries,
  mutations,
  directives: {},
  resolvers: {},
  subscriptions,
}
