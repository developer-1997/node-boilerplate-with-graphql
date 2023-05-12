const { Kind, GraphQLScalarType } = require("graphql");

module.exports = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime Scaler Type",

  serialize(value) {
    return new Date(value).toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.Kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});
