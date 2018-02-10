// @flow weak

const { GraphQLServer } = require('graphql-yoga')
const { addDirectiveResolveFunctionsToSchema } = require('graphql-directive')
const { Prisma } = require('prisma-binding')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId } = require('./utils')
const GraphQLScalar = require('graphql-scalar-types').default

const Text = GraphQLScalar.string('Text').description('Textarea').min(3).max(5000).create();

module.exports = {
  Query: {
    viewer(parent, args, ctx, info) {
      try {
        const id = getUserId(ctx)
        return ctx.db.query.user({ where: { id } }, info)
      } catch (e) {
        return null
      }
    },
    post(parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id } }, info)
    },
    posts(parent, args, ctx, info) {
      return ctx.db.query.posts({}, info)
    },
    user(parent, { id }, ctx, info) {
      return ctx.db.query.user({ where: { id } }, info)
    },
    users(parent, args, ctx, info) {
      return ctx.db.query.users({}, info)
    },
  },
  Mutation: {
    async signup(parent, args, ctx, info) {
      const password = await bcrypt.hash(args.password, 10)
      const user = await ctx.db.mutation.createUser({
        data: { ...args, password },
      })
      return {
        token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
        user,
      }
    },
    async login(parent, { username, password }, ctx, info) {
      const user = await ctx.db.query.user({ where: { username } })
      if (!user) {
        throw new Error(`No such user found for username: ${username}`)
      }
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Invalid password')
      }
      return {
        token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
        user,
      }
    },
    async createPost(parent, { title, text, isPublished }, ctx, info) {
      const userId = getUserId(ctx)
      return ctx.db.mutation.createPost(
        {
          data: {
            title,
            text,
            isPublished,
            author: { connect: { id: userId } },
          },
        },
        info
      )
    },
    async updatePost(parent, { id, title, text, isPublished }, ctx, info) {
      const userId = getUserId(ctx)
      const postExists = await ctx.db.exists.Post({ id })
      if (!postExists) {
        throw new Error(`Post not found or you're not the author`)
      }
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: {
            title,
            text,
            isPublished,
          },
        },
        info,
      )
    },
    async deletePost(parent, { id }, ctx, info) {
      const userId = getUserId(ctx)
      const postExists = await ctx.db.exists.Post({ id })
      if (!postExists) {
        throw new Error(`Post not found or you're not the author`)
      }
      return ctx.db.mutation.deletePost({ where: { id } })
    },
    async createUser(parent, { username, email, password }, ctx, info) {
      const userId = getUserId(ctx)
      return ctx.db.mutation.createUser(
        {
          data: {
            username,
            email,
            password,
          }
        },
        info
      )
    },
    async deleteUser(parent, { id }, ctx, info) {
      const userId = getUserId(ctx)
      const userExists = await ctx.db.exists.User({ id })
      if (!userExists) {
        throw new Error(`User not found`)
      }
      if (id === userId) {
        throw new Error(`Cannot delete yourself`)
      }
      return ctx.db.mutation.deleteUser({ where: { id } })
    },
  },
  AuthPayload: {
    user: async ({ user: { id } }, args, ctx, info) => {
      return ctx.db.query.user({ where: { id } }, info)
    },
  },
  Text,
}
