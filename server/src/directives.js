// @flow weak

const { addDirectiveResolveFunctionsToSchema } = require('graphql-directive')

exports.createDirectives = (schema) => {
  addDirectiveResolveFunctionsToSchema(schema, {
    async field(resolve, source, { label }, { user }) {
      return resolve();
    }
  });
}