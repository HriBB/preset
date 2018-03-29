const { Prisma } = require('prisma-binding')
const { GraphQLResolveInfo } = require('graphql')

const typeDefs = `
type Article implements Node {
  id: ID!
  title: String!
  text: String!
  published: Boolean!
  image(where: FileWhereInput): File
  author(where: UserWhereInput): User!
}

type File implements Node {
  id: ID!
  filename: String!
  mimetype: String!
}

type NewsPost implements Node {
  id: ID!
  title: String!
  text: String!
  published: Boolean!
  image(where: FileWhereInput): File
  author(where: UserWhereInput): User!
}

type ParentTestimonial implements Node {
  id: ID!
  title: String!
  text: String!
  published: Boolean!
  image(where: FileWhereInput): File
  author(where: UserWhereInput): User!
}

type Post implements Node {
  id: ID!
  title: String!
  text: String!
  published: Boolean!
  image(where: FileWhereInput): File
  author(where: UserWhereInput): User!
}

type Translation implements Node {
  id: ID!
  lang: LOCALE!
  ns: String!
  key: String!
  value: String
  editor: EDITOR
}

type User implements Node {
  id: ID!
  username: String!
  email: String!
  password: String!
  first_name: String
  last_name: String
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post!]
  image(where: FileWhereInput): File
}

type AggregateArticle {
  count: Int!
}

type AggregateFile {
  count: Int!
}

type AggregateNewsPost {
  count: Int!
}

type AggregateParentTestimonial {
  count: Int!
}

type AggregatePost {
  count: Int!
}

type AggregateTranslation {
  count: Int!
}

type AggregateUser {
  count: Int!
}

"""
A connection to a list of items.
"""
type ArticleConnection {
  """
  Information to aid in pagination.
  """
  pageInfo: PageInfo!
  """
  A list of edges.
  """
  edges: [ArticleEdge]!
  aggregate: AggregateArticle!
}

input ArticleCreateInput {
  title: String!
  text: String!
  published: Boolean!
  image: FileCreateOneInput
  author: UserCreateOneInput!
}

"""
An edge in a connection.
"""
type ArticleEdge {
  """
  The item at the end of the edge.
  """
  node: Article!
  """
  A cursor for use in pagination.
  """
  cursor: String!
}

enum ArticleOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  text_ASC
  text_DESC
  published_ASC
  published_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type ArticlePreviousValues {
  id: ID!
  title: String!
  text: String!
  published: Boolean!
}

type ArticleSubscriptionPayload {
  mutation: MutationType!
  node: Article
  updatedFields: [String!]
  previousValues: ArticlePreviousValues
}

input ArticleSubscriptionWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [ArticleSubscriptionWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [ArticleSubscriptionWhereInput!]
  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]
  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String
  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]
  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: ArticleWhereInput
}

input ArticleUpdateInput {
  title: String
  text: String
  published: Boolean
  image: FileUpdateOneInput
  author: UserUpdateOneInput
}

input ArticleWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [ArticleWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [ArticleWhereInput!]
  id: ID
  """
  All values that are not equal to given value.
  """
  id_not: ID
  """
  All values that are contained in given list.
  """
  id_in: [ID!]
  """
  All values that are not contained in given list.
  """
  id_not_in: [ID!]
  """
  All values less than the given value.
  """
  id_lt: ID
  """
  All values less than or equal the given value.
  """
  id_lte: ID
  """
  All values greater than the given value.
  """
  id_gt: ID
  """
  All values greater than or equal the given value.
  """
  id_gte: ID
  """
  All values containing the given string.
  """
  id_contains: ID
  """
  All values not containing the given string.
  """
  id_not_contains: ID
  """
  All values starting with the given string.
  """
  id_starts_with: ID
  """
  All values not starting with the given string.
  """
  id_not_starts_with: ID
  """
  All values ending with the given string.
  """
  id_ends_with: ID
  """
  All values not ending with the given string.
  """
  id_not_ends_with: ID
  title: String
  """
  All values that are not equal to given value.
  """
  title_not: String
  """
  All values that are contained in given list.
  """
  title_in: [String!]
  """
  All values that are not contained in given list.
  """
  title_not_in: [String!]
  """
  All values less than the given value.
  """
  title_lt: String
  """
  All values less than or equal the given value.
  """
  title_lte: String
  """
  All values greater than the given value.
  """
  title_gt: String
  """
  All values greater than or equal the given value.
  """
  title_gte: String
  """
  All values containing the given string.
  """
  title_contains: String
  """
  All values not containing the given string.
  """
  title_not_contains: String
  """
  All values starting with the given string.
  """
  title_starts_with: String
  """
  All values not starting with the given string.
  """
  title_not_starts_with: String
  """
  All values ending with the given string.
  """
  title_ends_with: String
  """
  All values not ending with the given string.
  """
  title_not_ends_with: String
  text: String
  """
  All values that are not equal to given value.
  """
  text_not: String
  """
  All values that are contained in given list.
  """
  text_in: [String!]
  """
  All values that are not contained in given list.
  """
  text_not_in: [String!]
  """
  All values less than the given value.
  """
  text_lt: String
  """
  All values less than or equal the given value.
  """
  text_lte: String
  """
  All values greater than the given value.
  """
  text_gt: String
  """
  All values greater than or equal the given value.
  """
  text_gte: String
  """
  All values containing the given string.
  """
  text_contains: String
  """
  All values not containing the given string.
  """
  text_not_contains: String
  """
  All values starting with the given string.
  """
  text_starts_with: String
  """
  All values not starting with the given string.
  """
  text_not_starts_with: String
  """
  All values ending with the given string.
  """
  text_ends_with: String
  """
  All values not ending with the given string.
  """
  text_not_ends_with: String
  published: Boolean
  """
  All values that are not equal to given value.
  """
  published_not: Boolean
  image: FileWhereInput
  author: UserWhereInput
}

input ArticleWhereUniqueInput {
  id: ID
}

type BatchPayload {
  """
  The number of nodes that have been affected by the Batch operation.
  """
  count: Long!
}

enum EDITOR {
  Text
  Textarea
}

"""
A connection to a list of items.
"""
type FileConnection {
  """
  Information to aid in pagination.
  """
  pageInfo: PageInfo!
  """
  A list of edges.
  """
  edges: [FileEdge]!
  aggregate: AggregateFile!
}

input FileCreateInput {
  filename: String!
  mimetype: String!
}

input FileCreateOneInput {
  create: FileCreateInput
  connect: FileWhereUniqueInput
}

"""
An edge in a connection.
"""
type FileEdge {
  """
  The item at the end of the edge.
  """
  node: File!
  """
  A cursor for use in pagination.
  """
  cursor: String!
}

enum FileOrderByInput {
  id_ASC
  id_DESC
  filename_ASC
  filename_DESC
  mimetype_ASC
  mimetype_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type FilePreviousValues {
  id: ID!
  filename: String!
  mimetype: String!
}

type FileSubscriptionPayload {
  mutation: MutationType!
  node: File
  updatedFields: [String!]
  previousValues: FilePreviousValues
}

input FileSubscriptionWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [FileSubscriptionWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [FileSubscriptionWhereInput!]
  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]
  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String
  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]
  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: FileWhereInput
}

input FileUpdateDataInput {
  filename: String
  mimetype: String
}

input FileUpdateInput {
  filename: String
  mimetype: String
}

input FileUpdateOneInput {
  create: FileCreateInput
  connect: FileWhereUniqueInput
  disconnect: Boolean
  delete: Boolean
  update: FileUpdateDataInput
  upsert: FileUpsertNestedInput
}

input FileUpsertNestedInput {
  update: FileUpdateDataInput!
  create: FileCreateInput!
}

input FileWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [FileWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [FileWhereInput!]
  id: ID
  """
  All values that are not equal to given value.
  """
  id_not: ID
  """
  All values that are contained in given list.
  """
  id_in: [ID!]
  """
  All values that are not contained in given list.
  """
  id_not_in: [ID!]
  """
  All values less than the given value.
  """
  id_lt: ID
  """
  All values less than or equal the given value.
  """
  id_lte: ID
  """
  All values greater than the given value.
  """
  id_gt: ID
  """
  All values greater than or equal the given value.
  """
  id_gte: ID
  """
  All values containing the given string.
  """
  id_contains: ID
  """
  All values not containing the given string.
  """
  id_not_contains: ID
  """
  All values starting with the given string.
  """
  id_starts_with: ID
  """
  All values not starting with the given string.
  """
  id_not_starts_with: ID
  """
  All values ending with the given string.
  """
  id_ends_with: ID
  """
  All values not ending with the given string.
  """
  id_not_ends_with: ID
  filename: String
  """
  All values that are not equal to given value.
  """
  filename_not: String
  """
  All values that are contained in given list.
  """
  filename_in: [String!]
  """
  All values that are not contained in given list.
  """
  filename_not_in: [String!]
  """
  All values less than the given value.
  """
  filename_lt: String
  """
  All values less than or equal the given value.
  """
  filename_lte: String
  """
  All values greater than the given value.
  """
  filename_gt: String
  """
  All values greater than or equal the given value.
  """
  filename_gte: String
  """
  All values containing the given string.
  """
  filename_contains: String
  """
  All values not containing the given string.
  """
  filename_not_contains: String
  """
  All values starting with the given string.
  """
  filename_starts_with: String
  """
  All values not starting with the given string.
  """
  filename_not_starts_with: String
  """
  All values ending with the given string.
  """
  filename_ends_with: String
  """
  All values not ending with the given string.
  """
  filename_not_ends_with: String
  mimetype: String
  """
  All values that are not equal to given value.
  """
  mimetype_not: String
  """
  All values that are contained in given list.
  """
  mimetype_in: [String!]
  """
  All values that are not contained in given list.
  """
  mimetype_not_in: [String!]
  """
  All values less than the given value.
  """
  mimetype_lt: String
  """
  All values less than or equal the given value.
  """
  mimetype_lte: String
  """
  All values greater than the given value.
  """
  mimetype_gt: String
  """
  All values greater than or equal the given value.
  """
  mimetype_gte: String
  """
  All values containing the given string.
  """
  mimetype_contains: String
  """
  All values not containing the given string.
  """
  mimetype_not_contains: String
  """
  All values starting with the given string.
  """
  mimetype_starts_with: String
  """
  All values not starting with the given string.
  """
  mimetype_not_starts_with: String
  """
  All values ending with the given string.
  """
  mimetype_ends_with: String
  """
  All values not ending with the given string.
  """
  mimetype_not_ends_with: String
}

input FileWhereUniqueInput {
  id: ID
}

enum LOCALE {
  SI
  EN
}

"""
The 'Long' scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
"""
scalar Long

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

"""
A connection to a list of items.
"""
type NewsPostConnection {
  """
  Information to aid in pagination.
  """
  pageInfo: PageInfo!
  """
  A list of edges.
  """
  edges: [NewsPostEdge]!
  aggregate: AggregateNewsPost!
}

input NewsPostCreateInput {
  title: String!
  text: String!
  published: Boolean!
  image: FileCreateOneInput
  author: UserCreateOneInput!
}

"""
An edge in a connection.
"""
type NewsPostEdge {
  """
  The item at the end of the edge.
  """
  node: NewsPost!
  """
  A cursor for use in pagination.
  """
  cursor: String!
}

enum NewsPostOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  text_ASC
  text_DESC
  published_ASC
  published_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type NewsPostPreviousValues {
  id: ID!
  title: String!
  text: String!
  published: Boolean!
}

type NewsPostSubscriptionPayload {
  mutation: MutationType!
  node: NewsPost
  updatedFields: [String!]
  previousValues: NewsPostPreviousValues
}

input NewsPostSubscriptionWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [NewsPostSubscriptionWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [NewsPostSubscriptionWhereInput!]
  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]
  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String
  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]
  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: NewsPostWhereInput
}

input NewsPostUpdateInput {
  title: String
  text: String
  published: Boolean
  image: FileUpdateOneInput
  author: UserUpdateOneInput
}

input NewsPostWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [NewsPostWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [NewsPostWhereInput!]
  id: ID
  """
  All values that are not equal to given value.
  """
  id_not: ID
  """
  All values that are contained in given list.
  """
  id_in: [ID!]
  """
  All values that are not contained in given list.
  """
  id_not_in: [ID!]
  """
  All values less than the given value.
  """
  id_lt: ID
  """
  All values less than or equal the given value.
  """
  id_lte: ID
  """
  All values greater than the given value.
  """
  id_gt: ID
  """
  All values greater than or equal the given value.
  """
  id_gte: ID
  """
  All values containing the given string.
  """
  id_contains: ID
  """
  All values not containing the given string.
  """
  id_not_contains: ID
  """
  All values starting with the given string.
  """
  id_starts_with: ID
  """
  All values not starting with the given string.
  """
  id_not_starts_with: ID
  """
  All values ending with the given string.
  """
  id_ends_with: ID
  """
  All values not ending with the given string.
  """
  id_not_ends_with: ID
  title: String
  """
  All values that are not equal to given value.
  """
  title_not: String
  """
  All values that are contained in given list.
  """
  title_in: [String!]
  """
  All values that are not contained in given list.
  """
  title_not_in: [String!]
  """
  All values less than the given value.
  """
  title_lt: String
  """
  All values less than or equal the given value.
  """
  title_lte: String
  """
  All values greater than the given value.
  """
  title_gt: String
  """
  All values greater than or equal the given value.
  """
  title_gte: String
  """
  All values containing the given string.
  """
  title_contains: String
  """
  All values not containing the given string.
  """
  title_not_contains: String
  """
  All values starting with the given string.
  """
  title_starts_with: String
  """
  All values not starting with the given string.
  """
  title_not_starts_with: String
  """
  All values ending with the given string.
  """
  title_ends_with: String
  """
  All values not ending with the given string.
  """
  title_not_ends_with: String
  text: String
  """
  All values that are not equal to given value.
  """
  text_not: String
  """
  All values that are contained in given list.
  """
  text_in: [String!]
  """
  All values that are not contained in given list.
  """
  text_not_in: [String!]
  """
  All values less than the given value.
  """
  text_lt: String
  """
  All values less than or equal the given value.
  """
  text_lte: String
  """
  All values greater than the given value.
  """
  text_gt: String
  """
  All values greater than or equal the given value.
  """
  text_gte: String
  """
  All values containing the given string.
  """
  text_contains: String
  """
  All values not containing the given string.
  """
  text_not_contains: String
  """
  All values starting with the given string.
  """
  text_starts_with: String
  """
  All values not starting with the given string.
  """
  text_not_starts_with: String
  """
  All values ending with the given string.
  """
  text_ends_with: String
  """
  All values not ending with the given string.
  """
  text_not_ends_with: String
  published: Boolean
  """
  All values that are not equal to given value.
  """
  published_not: Boolean
  image: FileWhereInput
  author: UserWhereInput
}

input NewsPostWhereUniqueInput {
  id: ID
}

"""
An object with an ID
"""
interface Node {
  """
  The id of the object.
  """
  id: ID!
}

"""
Information about pagination in a connection.
"""
type PageInfo {
  """
  When paginating forwards, are there more items?
  """
  hasNextPage: Boolean!
  """
  When paginating backwards, are there more items?
  """
  hasPreviousPage: Boolean!
  """
  When paginating backwards, the cursor to continue.
  """
  startCursor: String
  """
  When paginating forwards, the cursor to continue.
  """
  endCursor: String
}

"""
A connection to a list of items.
"""
type ParentTestimonialConnection {
  """
  Information to aid in pagination.
  """
  pageInfo: PageInfo!
  """
  A list of edges.
  """
  edges: [ParentTestimonialEdge]!
  aggregate: AggregateParentTestimonial!
}

input ParentTestimonialCreateInput {
  title: String!
  text: String!
  published: Boolean!
  image: FileCreateOneInput
  author: UserCreateOneInput!
}

"""
An edge in a connection.
"""
type ParentTestimonialEdge {
  """
  The item at the end of the edge.
  """
  node: ParentTestimonial!
  """
  A cursor for use in pagination.
  """
  cursor: String!
}

enum ParentTestimonialOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  text_ASC
  text_DESC
  published_ASC
  published_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type ParentTestimonialPreviousValues {
  id: ID!
  title: String!
  text: String!
  published: Boolean!
}

type ParentTestimonialSubscriptionPayload {
  mutation: MutationType!
  node: ParentTestimonial
  updatedFields: [String!]
  previousValues: ParentTestimonialPreviousValues
}

input ParentTestimonialSubscriptionWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [ParentTestimonialSubscriptionWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [ParentTestimonialSubscriptionWhereInput!]
  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]
  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String
  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]
  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: ParentTestimonialWhereInput
}

input ParentTestimonialUpdateInput {
  title: String
  text: String
  published: Boolean
  image: FileUpdateOneInput
  author: UserUpdateOneInput
}

input ParentTestimonialWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [ParentTestimonialWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [ParentTestimonialWhereInput!]
  id: ID
  """
  All values that are not equal to given value.
  """
  id_not: ID
  """
  All values that are contained in given list.
  """
  id_in: [ID!]
  """
  All values that are not contained in given list.
  """
  id_not_in: [ID!]
  """
  All values less than the given value.
  """
  id_lt: ID
  """
  All values less than or equal the given value.
  """
  id_lte: ID
  """
  All values greater than the given value.
  """
  id_gt: ID
  """
  All values greater than or equal the given value.
  """
  id_gte: ID
  """
  All values containing the given string.
  """
  id_contains: ID
  """
  All values not containing the given string.
  """
  id_not_contains: ID
  """
  All values starting with the given string.
  """
  id_starts_with: ID
  """
  All values not starting with the given string.
  """
  id_not_starts_with: ID
  """
  All values ending with the given string.
  """
  id_ends_with: ID
  """
  All values not ending with the given string.
  """
  id_not_ends_with: ID
  title: String
  """
  All values that are not equal to given value.
  """
  title_not: String
  """
  All values that are contained in given list.
  """
  title_in: [String!]
  """
  All values that are not contained in given list.
  """
  title_not_in: [String!]
  """
  All values less than the given value.
  """
  title_lt: String
  """
  All values less than or equal the given value.
  """
  title_lte: String
  """
  All values greater than the given value.
  """
  title_gt: String
  """
  All values greater than or equal the given value.
  """
  title_gte: String
  """
  All values containing the given string.
  """
  title_contains: String
  """
  All values not containing the given string.
  """
  title_not_contains: String
  """
  All values starting with the given string.
  """
  title_starts_with: String
  """
  All values not starting with the given string.
  """
  title_not_starts_with: String
  """
  All values ending with the given string.
  """
  title_ends_with: String
  """
  All values not ending with the given string.
  """
  title_not_ends_with: String
  text: String
  """
  All values that are not equal to given value.
  """
  text_not: String
  """
  All values that are contained in given list.
  """
  text_in: [String!]
  """
  All values that are not contained in given list.
  """
  text_not_in: [String!]
  """
  All values less than the given value.
  """
  text_lt: String
  """
  All values less than or equal the given value.
  """
  text_lte: String
  """
  All values greater than the given value.
  """
  text_gt: String
  """
  All values greater than or equal the given value.
  """
  text_gte: String
  """
  All values containing the given string.
  """
  text_contains: String
  """
  All values not containing the given string.
  """
  text_not_contains: String
  """
  All values starting with the given string.
  """
  text_starts_with: String
  """
  All values not starting with the given string.
  """
  text_not_starts_with: String
  """
  All values ending with the given string.
  """
  text_ends_with: String
  """
  All values not ending with the given string.
  """
  text_not_ends_with: String
  published: Boolean
  """
  All values that are not equal to given value.
  """
  published_not: Boolean
  image: FileWhereInput
  author: UserWhereInput
}

input ParentTestimonialWhereUniqueInput {
  id: ID
}

"""
A connection to a list of items.
"""
type PostConnection {
  """
  Information to aid in pagination.
  """
  pageInfo: PageInfo!
  """
  A list of edges.
  """
  edges: [PostEdge]!
  aggregate: AggregatePost!
}

input PostCreateInput {
  title: String!
  text: String!
  published: Boolean!
  image: FileCreateOneInput
  author: UserCreateOneWithoutPostsInput!
}

input PostCreateManyWithoutAuthorInput {
  create: [PostCreateWithoutAuthorInput!]
  connect: [PostWhereUniqueInput!]
}

input PostCreateWithoutAuthorInput {
  title: String!
  text: String!
  published: Boolean!
  image: FileCreateOneInput
}

"""
An edge in a connection.
"""
type PostEdge {
  """
  The item at the end of the edge.
  """
  node: Post!
  """
  A cursor for use in pagination.
  """
  cursor: String!
}

enum PostOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  text_ASC
  text_DESC
  published_ASC
  published_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type PostPreviousValues {
  id: ID!
  title: String!
  text: String!
  published: Boolean!
}

type PostSubscriptionPayload {
  mutation: MutationType!
  node: Post
  updatedFields: [String!]
  previousValues: PostPreviousValues
}

input PostSubscriptionWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [PostSubscriptionWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [PostSubscriptionWhereInput!]
  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]
  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String
  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]
  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: PostWhereInput
}

input PostUpdateInput {
  title: String
  text: String
  published: Boolean
  image: FileUpdateOneInput
  author: UserUpdateOneWithoutPostsInput
}

input PostUpdateManyWithoutAuthorInput {
  create: [PostCreateWithoutAuthorInput!]
  connect: [PostWhereUniqueInput!]
  disconnect: [PostWhereUniqueInput!]
  delete: [PostWhereUniqueInput!]
  update: [PostUpdateWithWhereUniqueWithoutAuthorInput!]
  upsert: [PostUpsertWithWhereUniqueWithoutAuthorInput!]
}

input PostUpdateWithoutAuthorDataInput {
  title: String
  text: String
  published: Boolean
  image: FileUpdateOneInput
}

input PostUpdateWithWhereUniqueWithoutAuthorInput {
  where: PostWhereUniqueInput!
  data: PostUpdateWithoutAuthorDataInput!
}

input PostUpsertWithWhereUniqueWithoutAuthorInput {
  where: PostWhereUniqueInput!
  update: PostUpdateWithoutAuthorDataInput!
  create: PostCreateWithoutAuthorInput!
}

input PostWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [PostWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [PostWhereInput!]
  id: ID
  """
  All values that are not equal to given value.
  """
  id_not: ID
  """
  All values that are contained in given list.
  """
  id_in: [ID!]
  """
  All values that are not contained in given list.
  """
  id_not_in: [ID!]
  """
  All values less than the given value.
  """
  id_lt: ID
  """
  All values less than or equal the given value.
  """
  id_lte: ID
  """
  All values greater than the given value.
  """
  id_gt: ID
  """
  All values greater than or equal the given value.
  """
  id_gte: ID
  """
  All values containing the given string.
  """
  id_contains: ID
  """
  All values not containing the given string.
  """
  id_not_contains: ID
  """
  All values starting with the given string.
  """
  id_starts_with: ID
  """
  All values not starting with the given string.
  """
  id_not_starts_with: ID
  """
  All values ending with the given string.
  """
  id_ends_with: ID
  """
  All values not ending with the given string.
  """
  id_not_ends_with: ID
  title: String
  """
  All values that are not equal to given value.
  """
  title_not: String
  """
  All values that are contained in given list.
  """
  title_in: [String!]
  """
  All values that are not contained in given list.
  """
  title_not_in: [String!]
  """
  All values less than the given value.
  """
  title_lt: String
  """
  All values less than or equal the given value.
  """
  title_lte: String
  """
  All values greater than the given value.
  """
  title_gt: String
  """
  All values greater than or equal the given value.
  """
  title_gte: String
  """
  All values containing the given string.
  """
  title_contains: String
  """
  All values not containing the given string.
  """
  title_not_contains: String
  """
  All values starting with the given string.
  """
  title_starts_with: String
  """
  All values not starting with the given string.
  """
  title_not_starts_with: String
  """
  All values ending with the given string.
  """
  title_ends_with: String
  """
  All values not ending with the given string.
  """
  title_not_ends_with: String
  text: String
  """
  All values that are not equal to given value.
  """
  text_not: String
  """
  All values that are contained in given list.
  """
  text_in: [String!]
  """
  All values that are not contained in given list.
  """
  text_not_in: [String!]
  """
  All values less than the given value.
  """
  text_lt: String
  """
  All values less than or equal the given value.
  """
  text_lte: String
  """
  All values greater than the given value.
  """
  text_gt: String
  """
  All values greater than or equal the given value.
  """
  text_gte: String
  """
  All values containing the given string.
  """
  text_contains: String
  """
  All values not containing the given string.
  """
  text_not_contains: String
  """
  All values starting with the given string.
  """
  text_starts_with: String
  """
  All values not starting with the given string.
  """
  text_not_starts_with: String
  """
  All values ending with the given string.
  """
  text_ends_with: String
  """
  All values not ending with the given string.
  """
  text_not_ends_with: String
  published: Boolean
  """
  All values that are not equal to given value.
  """
  published_not: Boolean
  image: FileWhereInput
  author: UserWhereInput
}

input PostWhereUniqueInput {
  id: ID
}

"""
A connection to a list of items.
"""
type TranslationConnection {
  """
  Information to aid in pagination.
  """
  pageInfo: PageInfo!
  """
  A list of edges.
  """
  edges: [TranslationEdge]!
  aggregate: AggregateTranslation!
}

input TranslationCreateInput {
  lang: LOCALE!
  ns: String!
  key: String!
  value: String
  editor: EDITOR
}

"""
An edge in a connection.
"""
type TranslationEdge {
  """
  The item at the end of the edge.
  """
  node: Translation!
  """
  A cursor for use in pagination.
  """
  cursor: String!
}

enum TranslationOrderByInput {
  id_ASC
  id_DESC
  lang_ASC
  lang_DESC
  ns_ASC
  ns_DESC
  key_ASC
  key_DESC
  value_ASC
  value_DESC
  editor_ASC
  editor_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type TranslationPreviousValues {
  id: ID!
  lang: LOCALE!
  ns: String!
  key: String!
  value: String
  editor: EDITOR
}

type TranslationSubscriptionPayload {
  mutation: MutationType!
  node: Translation
  updatedFields: [String!]
  previousValues: TranslationPreviousValues
}

input TranslationSubscriptionWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [TranslationSubscriptionWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [TranslationSubscriptionWhereInput!]
  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]
  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String
  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]
  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: TranslationWhereInput
}

input TranslationUpdateInput {
  lang: LOCALE
  ns: String
  key: String
  value: String
  editor: EDITOR
}

input TranslationWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [TranslationWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [TranslationWhereInput!]
  id: ID
  """
  All values that are not equal to given value.
  """
  id_not: ID
  """
  All values that are contained in given list.
  """
  id_in: [ID!]
  """
  All values that are not contained in given list.
  """
  id_not_in: [ID!]
  """
  All values less than the given value.
  """
  id_lt: ID
  """
  All values less than or equal the given value.
  """
  id_lte: ID
  """
  All values greater than the given value.
  """
  id_gt: ID
  """
  All values greater than or equal the given value.
  """
  id_gte: ID
  """
  All values containing the given string.
  """
  id_contains: ID
  """
  All values not containing the given string.
  """
  id_not_contains: ID
  """
  All values starting with the given string.
  """
  id_starts_with: ID
  """
  All values not starting with the given string.
  """
  id_not_starts_with: ID
  """
  All values ending with the given string.
  """
  id_ends_with: ID
  """
  All values not ending with the given string.
  """
  id_not_ends_with: ID
  lang: LOCALE
  """
  All values that are not equal to given value.
  """
  lang_not: LOCALE
  """
  All values that are contained in given list.
  """
  lang_in: [LOCALE!]
  """
  All values that are not contained in given list.
  """
  lang_not_in: [LOCALE!]
  ns: String
  """
  All values that are not equal to given value.
  """
  ns_not: String
  """
  All values that are contained in given list.
  """
  ns_in: [String!]
  """
  All values that are not contained in given list.
  """
  ns_not_in: [String!]
  """
  All values less than the given value.
  """
  ns_lt: String
  """
  All values less than or equal the given value.
  """
  ns_lte: String
  """
  All values greater than the given value.
  """
  ns_gt: String
  """
  All values greater than or equal the given value.
  """
  ns_gte: String
  """
  All values containing the given string.
  """
  ns_contains: String
  """
  All values not containing the given string.
  """
  ns_not_contains: String
  """
  All values starting with the given string.
  """
  ns_starts_with: String
  """
  All values not starting with the given string.
  """
  ns_not_starts_with: String
  """
  All values ending with the given string.
  """
  ns_ends_with: String
  """
  All values not ending with the given string.
  """
  ns_not_ends_with: String
  key: String
  """
  All values that are not equal to given value.
  """
  key_not: String
  """
  All values that are contained in given list.
  """
  key_in: [String!]
  """
  All values that are not contained in given list.
  """
  key_not_in: [String!]
  """
  All values less than the given value.
  """
  key_lt: String
  """
  All values less than or equal the given value.
  """
  key_lte: String
  """
  All values greater than the given value.
  """
  key_gt: String
  """
  All values greater than or equal the given value.
  """
  key_gte: String
  """
  All values containing the given string.
  """
  key_contains: String
  """
  All values not containing the given string.
  """
  key_not_contains: String
  """
  All values starting with the given string.
  """
  key_starts_with: String
  """
  All values not starting with the given string.
  """
  key_not_starts_with: String
  """
  All values ending with the given string.
  """
  key_ends_with: String
  """
  All values not ending with the given string.
  """
  key_not_ends_with: String
  value: String
  """
  All values that are not equal to given value.
  """
  value_not: String
  """
  All values that are contained in given list.
  """
  value_in: [String!]
  """
  All values that are not contained in given list.
  """
  value_not_in: [String!]
  """
  All values less than the given value.
  """
  value_lt: String
  """
  All values less than or equal the given value.
  """
  value_lte: String
  """
  All values greater than the given value.
  """
  value_gt: String
  """
  All values greater than or equal the given value.
  """
  value_gte: String
  """
  All values containing the given string.
  """
  value_contains: String
  """
  All values not containing the given string.
  """
  value_not_contains: String
  """
  All values starting with the given string.
  """
  value_starts_with: String
  """
  All values not starting with the given string.
  """
  value_not_starts_with: String
  """
  All values ending with the given string.
  """
  value_ends_with: String
  """
  All values not ending with the given string.
  """
  value_not_ends_with: String
  editor: EDITOR
  """
  All values that are not equal to given value.
  """
  editor_not: EDITOR
  """
  All values that are contained in given list.
  """
  editor_in: [EDITOR!]
  """
  All values that are not contained in given list.
  """
  editor_not_in: [EDITOR!]
}

input TranslationWhereUniqueInput {
  id: ID
}

"""
A connection to a list of items.
"""
type UserConnection {
  """
  Information to aid in pagination.
  """
  pageInfo: PageInfo!
  """
  A list of edges.
  """
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  username: String!
  email: String!
  password: String!
  first_name: String
  last_name: String
  posts: PostCreateManyWithoutAuthorInput
  image: FileCreateOneInput
}

input UserCreateOneInput {
  create: UserCreateInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutPostsInput {
  create: UserCreateWithoutPostsInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutPostsInput {
  username: String!
  email: String!
  password: String!
  first_name: String
  last_name: String
  image: FileCreateOneInput
}

"""
An edge in a connection.
"""
type UserEdge {
  """
  The item at the end of the edge.
  """
  node: User!
  """
  A cursor for use in pagination.
  """
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  username_ASC
  username_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  first_name_ASC
  first_name_DESC
  last_name_ASC
  last_name_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type UserPreviousValues {
  id: ID!
  username: String!
  email: String!
  password: String!
  first_name: String
  last_name: String
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [UserSubscriptionWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [UserSubscriptionWhereInput!]
  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]
  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String
  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]
  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: UserWhereInput
}

input UserUpdateDataInput {
  username: String
  email: String
  password: String
  first_name: String
  last_name: String
  posts: PostUpdateManyWithoutAuthorInput
  image: FileUpdateOneInput
}

input UserUpdateInput {
  username: String
  email: String
  password: String
  first_name: String
  last_name: String
  posts: PostUpdateManyWithoutAuthorInput
  image: FileUpdateOneInput
}

input UserUpdateOneInput {
  create: UserCreateInput
  connect: UserWhereUniqueInput
  delete: Boolean
  update: UserUpdateDataInput
  upsert: UserUpsertNestedInput
}

input UserUpdateOneWithoutPostsInput {
  create: UserCreateWithoutPostsInput
  connect: UserWhereUniqueInput
  delete: Boolean
  update: UserUpdateWithoutPostsDataInput
  upsert: UserUpsertWithoutPostsInput
}

input UserUpdateWithoutPostsDataInput {
  username: String
  email: String
  password: String
  first_name: String
  last_name: String
  image: FileUpdateOneInput
}

input UserUpsertNestedInput {
  update: UserUpdateDataInput!
  create: UserCreateInput!
}

input UserUpsertWithoutPostsInput {
  update: UserUpdateWithoutPostsDataInput!
  create: UserCreateWithoutPostsInput!
}

input UserWhereInput {
  """
  Logical AND on all given filters.
  """
  AND: [UserWhereInput!]
  """
  Logical OR on all given filters.
  """
  OR: [UserWhereInput!]
  id: ID
  """
  All values that are not equal to given value.
  """
  id_not: ID
  """
  All values that are contained in given list.
  """
  id_in: [ID!]
  """
  All values that are not contained in given list.
  """
  id_not_in: [ID!]
  """
  All values less than the given value.
  """
  id_lt: ID
  """
  All values less than or equal the given value.
  """
  id_lte: ID
  """
  All values greater than the given value.
  """
  id_gt: ID
  """
  All values greater than or equal the given value.
  """
  id_gte: ID
  """
  All values containing the given string.
  """
  id_contains: ID
  """
  All values not containing the given string.
  """
  id_not_contains: ID
  """
  All values starting with the given string.
  """
  id_starts_with: ID
  """
  All values not starting with the given string.
  """
  id_not_starts_with: ID
  """
  All values ending with the given string.
  """
  id_ends_with: ID
  """
  All values not ending with the given string.
  """
  id_not_ends_with: ID
  username: String
  """
  All values that are not equal to given value.
  """
  username_not: String
  """
  All values that are contained in given list.
  """
  username_in: [String!]
  """
  All values that are not contained in given list.
  """
  username_not_in: [String!]
  """
  All values less than the given value.
  """
  username_lt: String
  """
  All values less than or equal the given value.
  """
  username_lte: String
  """
  All values greater than the given value.
  """
  username_gt: String
  """
  All values greater than or equal the given value.
  """
  username_gte: String
  """
  All values containing the given string.
  """
  username_contains: String
  """
  All values not containing the given string.
  """
  username_not_contains: String
  """
  All values starting with the given string.
  """
  username_starts_with: String
  """
  All values not starting with the given string.
  """
  username_not_starts_with: String
  """
  All values ending with the given string.
  """
  username_ends_with: String
  """
  All values not ending with the given string.
  """
  username_not_ends_with: String
  email: String
  """
  All values that are not equal to given value.
  """
  email_not: String
  """
  All values that are contained in given list.
  """
  email_in: [String!]
  """
  All values that are not contained in given list.
  """
  email_not_in: [String!]
  """
  All values less than the given value.
  """
  email_lt: String
  """
  All values less than or equal the given value.
  """
  email_lte: String
  """
  All values greater than the given value.
  """
  email_gt: String
  """
  All values greater than or equal the given value.
  """
  email_gte: String
  """
  All values containing the given string.
  """
  email_contains: String
  """
  All values not containing the given string.
  """
  email_not_contains: String
  """
  All values starting with the given string.
  """
  email_starts_with: String
  """
  All values not starting with the given string.
  """
  email_not_starts_with: String
  """
  All values ending with the given string.
  """
  email_ends_with: String
  """
  All values not ending with the given string.
  """
  email_not_ends_with: String
  password: String
  """
  All values that are not equal to given value.
  """
  password_not: String
  """
  All values that are contained in given list.
  """
  password_in: [String!]
  """
  All values that are not contained in given list.
  """
  password_not_in: [String!]
  """
  All values less than the given value.
  """
  password_lt: String
  """
  All values less than or equal the given value.
  """
  password_lte: String
  """
  All values greater than the given value.
  """
  password_gt: String
  """
  All values greater than or equal the given value.
  """
  password_gte: String
  """
  All values containing the given string.
  """
  password_contains: String
  """
  All values not containing the given string.
  """
  password_not_contains: String
  """
  All values starting with the given string.
  """
  password_starts_with: String
  """
  All values not starting with the given string.
  """
  password_not_starts_with: String
  """
  All values ending with the given string.
  """
  password_ends_with: String
  """
  All values not ending with the given string.
  """
  password_not_ends_with: String
  first_name: String
  """
  All values that are not equal to given value.
  """
  first_name_not: String
  """
  All values that are contained in given list.
  """
  first_name_in: [String!]
  """
  All values that are not contained in given list.
  """
  first_name_not_in: [String!]
  """
  All values less than the given value.
  """
  first_name_lt: String
  """
  All values less than or equal the given value.
  """
  first_name_lte: String
  """
  All values greater than the given value.
  """
  first_name_gt: String
  """
  All values greater than or equal the given value.
  """
  first_name_gte: String
  """
  All values containing the given string.
  """
  first_name_contains: String
  """
  All values not containing the given string.
  """
  first_name_not_contains: String
  """
  All values starting with the given string.
  """
  first_name_starts_with: String
  """
  All values not starting with the given string.
  """
  first_name_not_starts_with: String
  """
  All values ending with the given string.
  """
  first_name_ends_with: String
  """
  All values not ending with the given string.
  """
  first_name_not_ends_with: String
  last_name: String
  """
  All values that are not equal to given value.
  """
  last_name_not: String
  """
  All values that are contained in given list.
  """
  last_name_in: [String!]
  """
  All values that are not contained in given list.
  """
  last_name_not_in: [String!]
  """
  All values less than the given value.
  """
  last_name_lt: String
  """
  All values less than or equal the given value.
  """
  last_name_lte: String
  """
  All values greater than the given value.
  """
  last_name_gt: String
  """
  All values greater than or equal the given value.
  """
  last_name_gte: String
  """
  All values containing the given string.
  """
  last_name_contains: String
  """
  All values not containing the given string.
  """
  last_name_not_contains: String
  """
  All values starting with the given string.
  """
  last_name_starts_with: String
  """
  All values not starting with the given string.
  """
  last_name_not_starts_with: String
  """
  All values ending with the given string.
  """
  last_name_ends_with: String
  """
  All values not ending with the given string.
  """
  last_name_not_ends_with: String
  posts_every: PostWhereInput
  posts_some: PostWhereInput
  posts_none: PostWhereInput
  image: FileWhereInput
}

input UserWhereUniqueInput {
  id: ID
  username: String
  email: String
}

type Mutation {
  createUser(data: UserCreateInput!): User!
  createFile(data: FileCreateInput!): File!
  createTranslation(data: TranslationCreateInput!): Translation!
  createPost(data: PostCreateInput!): Post!
  createNewsPost(data: NewsPostCreateInput!): NewsPost!
  createParentTestimonial(data: ParentTestimonialCreateInput!): ParentTestimonial!
  createArticle(data: ArticleCreateInput!): Article!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateFile(data: FileUpdateInput!, where: FileWhereUniqueInput!): File
  updateTranslation(data: TranslationUpdateInput!, where: TranslationWhereUniqueInput!): Translation
  updatePost(data: PostUpdateInput!, where: PostWhereUniqueInput!): Post
  updateNewsPost(data: NewsPostUpdateInput!, where: NewsPostWhereUniqueInput!): NewsPost
  updateParentTestimonial(data: ParentTestimonialUpdateInput!, where: ParentTestimonialWhereUniqueInput!): ParentTestimonial
  updateArticle(data: ArticleUpdateInput!, where: ArticleWhereUniqueInput!): Article
  deleteUser(where: UserWhereUniqueInput!): User
  deleteFile(where: FileWhereUniqueInput!): File
  deleteTranslation(where: TranslationWhereUniqueInput!): Translation
  deletePost(where: PostWhereUniqueInput!): Post
  deleteNewsPost(where: NewsPostWhereUniqueInput!): NewsPost
  deleteParentTestimonial(where: ParentTestimonialWhereUniqueInput!): ParentTestimonial
  deleteArticle(where: ArticleWhereUniqueInput!): Article
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  upsertFile(where: FileWhereUniqueInput!, create: FileCreateInput!, update: FileUpdateInput!): File!
  upsertTranslation(where: TranslationWhereUniqueInput!, create: TranslationCreateInput!, update: TranslationUpdateInput!): Translation!
  upsertPost(where: PostWhereUniqueInput!, create: PostCreateInput!, update: PostUpdateInput!): Post!
  upsertNewsPost(where: NewsPostWhereUniqueInput!, create: NewsPostCreateInput!, update: NewsPostUpdateInput!): NewsPost!
  upsertParentTestimonial(where: ParentTestimonialWhereUniqueInput!, create: ParentTestimonialCreateInput!, update: ParentTestimonialUpdateInput!): ParentTestimonial!
  upsertArticle(where: ArticleWhereUniqueInput!, create: ArticleCreateInput!, update: ArticleUpdateInput!): Article!
  updateManyUsers(data: UserUpdateInput!, where: UserWhereInput!): BatchPayload!
  updateManyFiles(data: FileUpdateInput!, where: FileWhereInput!): BatchPayload!
  updateManyTranslations(data: TranslationUpdateInput!, where: TranslationWhereInput!): BatchPayload!
  updateManyPosts(data: PostUpdateInput!, where: PostWhereInput!): BatchPayload!
  updateManyNewsPosts(data: NewsPostUpdateInput!, where: NewsPostWhereInput!): BatchPayload!
  updateManyParentTestimonials(data: ParentTestimonialUpdateInput!, where: ParentTestimonialWhereInput!): BatchPayload!
  updateManyArticles(data: ArticleUpdateInput!, where: ArticleWhereInput!): BatchPayload!
  deleteManyUsers(where: UserWhereInput!): BatchPayload!
  deleteManyFiles(where: FileWhereInput!): BatchPayload!
  deleteManyTranslations(where: TranslationWhereInput!): BatchPayload!
  deleteManyPosts(where: PostWhereInput!): BatchPayload!
  deleteManyNewsPosts(where: NewsPostWhereInput!): BatchPayload!
  deleteManyParentTestimonials(where: ParentTestimonialWhereInput!): BatchPayload!
  deleteManyArticles(where: ArticleWhereInput!): BatchPayload!
}

type Query {
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  files(where: FileWhereInput, orderBy: FileOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [File]!
  translations(where: TranslationWhereInput, orderBy: TranslationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Translation]!
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post]!
  newsPosts(where: NewsPostWhereInput, orderBy: NewsPostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [NewsPost]!
  parentTestimonials(where: ParentTestimonialWhereInput, orderBy: ParentTestimonialOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [ParentTestimonial]!
  articles(where: ArticleWhereInput, orderBy: ArticleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Article]!
  user(where: UserWhereUniqueInput!): User
  file(where: FileWhereUniqueInput!): File
  translation(where: TranslationWhereUniqueInput!): Translation
  post(where: PostWhereUniqueInput!): Post
  newsPost(where: NewsPostWhereUniqueInput!): NewsPost
  parentTestimonial(where: ParentTestimonialWhereUniqueInput!): ParentTestimonial
  article(where: ArticleWhereUniqueInput!): Article
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  filesConnection(where: FileWhereInput, orderBy: FileOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): FileConnection!
  translationsConnection(where: TranslationWhereInput, orderBy: TranslationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): TranslationConnection!
  postsConnection(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PostConnection!
  newsPostsConnection(where: NewsPostWhereInput, orderBy: NewsPostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): NewsPostConnection!
  parentTestimonialsConnection(where: ParentTestimonialWhereInput, orderBy: ParentTestimonialOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ParentTestimonialConnection!
  articlesConnection(where: ArticleWhereInput, orderBy: ArticleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ArticleConnection!
  """
  Fetches an object given its ID
  """
  node("""
  The ID of an object
  """
  id: ID!): Node
}

type Subscription {
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
  file(where: FileSubscriptionWhereInput): FileSubscriptionPayload
  translation(where: TranslationSubscriptionWhereInput): TranslationSubscriptionPayload
  post(where: PostSubscriptionWhereInput): PostSubscriptionPayload
  newsPost(where: NewsPostSubscriptionWhereInput): NewsPostSubscriptionPayload
  parentTestimonial(where: ParentTestimonialSubscriptionWhereInput): ParentTestimonialSubscriptionPayload
  article(where: ArticleSubscriptionWhereInput): ArticleSubscriptionPayload
}
`

module.exports.Prisma = class Binding extends Prisma {
  
  constructor({ endpoint, secret, fragmentReplacements, debug }) {
    super({ typeDefs, endpoint, secret, fragmentReplacements, debug });

    var self = this
    this.exists = {
      User(where) {
        return super.existsDelegate('query', 'users', { where }, {}, '{ id }')
      },
      File(where) {
        return super.existsDelegate('query', 'files', { where }, {}, '{ id }')
      },
      Translation(where) {
        return super.existsDelegate('query', 'translations', { where }, {}, '{ id }')
      },
      Post(where) {
        return super.existsDelegate('query', 'posts', { where }, {}, '{ id }')
      },
      NewsPost(where) {
        return super.existsDelegate('query', 'newsPosts', { where }, {}, '{ id }')
      },
      ParentTestimonial(where) {
        return super.existsDelegate('query', 'parentTestimonials', { where }, {}, '{ id }')
      },
      Article(where) {
        return super.existsDelegate('query', 'articles', { where }, {}, '{ id }')
      }
    }

    this.query = {
      users(args, info) { 
        return self.delegate('query', 'users', args, {}, info)
      },
      files(args, info) { 
        return self.delegate('query', 'files', args, {}, info)
      },
      translations(args, info) { 
        return self.delegate('query', 'translations', args, {}, info)
      },
      posts(args, info) { 
        return self.delegate('query', 'posts', args, {}, info)
      },
      newsPosts(args, info) { 
        return self.delegate('query', 'newsPosts', args, {}, info)
      },
      parentTestimonials(args, info) { 
        return self.delegate('query', 'parentTestimonials', args, {}, info)
      },
      articles(args, info) { 
        return self.delegate('query', 'articles', args, {}, info)
      },
      user(args, info) { 
        return self.delegate('query', 'user', args, {}, info)
      },
      file(args, info) { 
        return self.delegate('query', 'file', args, {}, info)
      },
      translation(args, info) { 
        return self.delegate('query', 'translation', args, {}, info)
      },
      post(args, info) { 
        return self.delegate('query', 'post', args, {}, info)
      },
      newsPost(args, info) { 
        return self.delegate('query', 'newsPost', args, {}, info)
      },
      parentTestimonial(args, info) { 
        return self.delegate('query', 'parentTestimonial', args, {}, info)
      },
      article(args, info) { 
        return self.delegate('query', 'article', args, {}, info)
      },
      usersConnection(args, info) { 
        return self.delegate('query', 'usersConnection', args, {}, info)
      },
      filesConnection(args, info) { 
        return self.delegate('query', 'filesConnection', args, {}, info)
      },
      translationsConnection(args, info) { 
        return self.delegate('query', 'translationsConnection', args, {}, info)
      },
      postsConnection(args, info) { 
        return self.delegate('query', 'postsConnection', args, {}, info)
      },
      newsPostsConnection(args, info) { 
        return self.delegate('query', 'newsPostsConnection', args, {}, info)
      },
      parentTestimonialsConnection(args, info) { 
        return self.delegate('query', 'parentTestimonialsConnection', args, {}, info)
      },
      articlesConnection(args, info) { 
        return self.delegate('query', 'articlesConnection', args, {}, info)
      },
      node(args, info) { 
        return self.delegate('query', 'node', args, {}, info)
      }
    }
      
    this.mutation = {
      createUser(args, info) { 
        return self.delegate('mutation', 'createUser', args, {}, info)
      },
      createFile(args, info) { 
        return self.delegate('mutation', 'createFile', args, {}, info)
      },
      createTranslation(args, info) { 
        return self.delegate('mutation', 'createTranslation', args, {}, info)
      },
      createPost(args, info) { 
        return self.delegate('mutation', 'createPost', args, {}, info)
      },
      createNewsPost(args, info) { 
        return self.delegate('mutation', 'createNewsPost', args, {}, info)
      },
      createParentTestimonial(args, info) { 
        return self.delegate('mutation', 'createParentTestimonial', args, {}, info)
      },
      createArticle(args, info) { 
        return self.delegate('mutation', 'createArticle', args, {}, info)
      },
      updateUser(args, info) { 
        return self.delegate('mutation', 'updateUser', args, {}, info)
      },
      updateFile(args, info) { 
        return self.delegate('mutation', 'updateFile', args, {}, info)
      },
      updateTranslation(args, info) { 
        return self.delegate('mutation', 'updateTranslation', args, {}, info)
      },
      updatePost(args, info) { 
        return self.delegate('mutation', 'updatePost', args, {}, info)
      },
      updateNewsPost(args, info) { 
        return self.delegate('mutation', 'updateNewsPost', args, {}, info)
      },
      updateParentTestimonial(args, info) { 
        return self.delegate('mutation', 'updateParentTestimonial', args, {}, info)
      },
      updateArticle(args, info) { 
        return self.delegate('mutation', 'updateArticle', args, {}, info)
      },
      deleteUser(args, info) { 
        return self.delegate('mutation', 'deleteUser', args, {}, info)
      },
      deleteFile(args, info) { 
        return self.delegate('mutation', 'deleteFile', args, {}, info)
      },
      deleteTranslation(args, info) { 
        return self.delegate('mutation', 'deleteTranslation', args, {}, info)
      },
      deletePost(args, info) { 
        return self.delegate('mutation', 'deletePost', args, {}, info)
      },
      deleteNewsPost(args, info) { 
        return self.delegate('mutation', 'deleteNewsPost', args, {}, info)
      },
      deleteParentTestimonial(args, info) { 
        return self.delegate('mutation', 'deleteParentTestimonial', args, {}, info)
      },
      deleteArticle(args, info) { 
        return self.delegate('mutation', 'deleteArticle', args, {}, info)
      },
      upsertUser(args, info) { 
        return self.delegate('mutation', 'upsertUser', args, {}, info)
      },
      upsertFile(args, info) { 
        return self.delegate('mutation', 'upsertFile', args, {}, info)
      },
      upsertTranslation(args, info) { 
        return self.delegate('mutation', 'upsertTranslation', args, {}, info)
      },
      upsertPost(args, info) { 
        return self.delegate('mutation', 'upsertPost', args, {}, info)
      },
      upsertNewsPost(args, info) { 
        return self.delegate('mutation', 'upsertNewsPost', args, {}, info)
      },
      upsertParentTestimonial(args, info) { 
        return self.delegate('mutation', 'upsertParentTestimonial', args, {}, info)
      },
      upsertArticle(args, info) { 
        return self.delegate('mutation', 'upsertArticle', args, {}, info)
      },
      updateManyUsers(args, info) { 
        return self.delegate('mutation', 'updateManyUsers', args, {}, info)
      },
      updateManyFiles(args, info) { 
        return self.delegate('mutation', 'updateManyFiles', args, {}, info)
      },
      updateManyTranslations(args, info) { 
        return self.delegate('mutation', 'updateManyTranslations', args, {}, info)
      },
      updateManyPosts(args, info) { 
        return self.delegate('mutation', 'updateManyPosts', args, {}, info)
      },
      updateManyNewsPosts(args, info) { 
        return self.delegate('mutation', 'updateManyNewsPosts', args, {}, info)
      },
      updateManyParentTestimonials(args, info) { 
        return self.delegate('mutation', 'updateManyParentTestimonials', args, {}, info)
      },
      updateManyArticles(args, info) { 
        return self.delegate('mutation', 'updateManyArticles', args, {}, info)
      },
      deleteManyUsers(args, info) { 
        return self.delegate('mutation', 'deleteManyUsers', args, {}, info)
      },
      deleteManyFiles(args, info) { 
        return self.delegate('mutation', 'deleteManyFiles', args, {}, info)
      },
      deleteManyTranslations(args, info) { 
        return self.delegate('mutation', 'deleteManyTranslations', args, {}, info)
      },
      deleteManyPosts(args, info) { 
        return self.delegate('mutation', 'deleteManyPosts', args, {}, info)
      },
      deleteManyNewsPosts(args, info) { 
        return self.delegate('mutation', 'deleteManyNewsPosts', args, {}, info)
      },
      deleteManyParentTestimonials(args, info) { 
        return self.delegate('mutation', 'deleteManyParentTestimonials', args, {}, info)
      },
      deleteManyArticles(args, info) { 
        return self.delegate('mutation', 'deleteManyArticles', args, {}, info)
      }
    }
      
    this.subscription = {
      user(args, infoOrQuery) { 
        return self.delegateSubscription('user', args, {}, infoOrQuery)
      },
      file(args, infoOrQuery) { 
        return self.delegateSubscription('file', args, {}, infoOrQuery)
      },
      translation(args, infoOrQuery) { 
        return self.delegateSubscription('translation', args, {}, infoOrQuery)
      },
      post(args, infoOrQuery) { 
        return self.delegateSubscription('post', args, {}, infoOrQuery)
      },
      newsPost(args, infoOrQuery) { 
        return self.delegateSubscription('newsPost', args, {}, infoOrQuery)
      },
      parentTestimonial(args, infoOrQuery) { 
        return self.delegateSubscription('parentTestimonial', args, {}, infoOrQuery)
      },
      article(args, infoOrQuery) { 
        return self.delegateSubscription('article', args, {}, infoOrQuery)
      }
    }
  }
  
  delegate(operation, field, args, context, info) {
    return super.delegate(operation, field, args, context, info)
  }
}