const http = require("http");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const cors = require("cors");
const connectDB = require("./utils/connectDB");
const typeDefs = require("./schemas/index.js");
const app = require("./app.js");
const { Mutation, Query } = require("./resolvers/index.js");
const DateTime = require("./resolvers/datetime.js");
const getAuthUser = require("./middleware/authUser.js");

const httpServer = http.createServer(app);

const corsOptions = {
  origin: [
    "https://studio.apollographql.com",
    "http://localhost:8000",
    "http://localhost:3000",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

const resolvers = {
  DateTime,
  Query,
  Mutation,
};

(async function () {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req, res }) => ({ req, res, getAuthUser }),
  });

  // CONNECT DB
  await connectDB();

  // START APOLLO SERVER
  await server.start();

  server.applyMiddleware({ app, cors: corsOptions });

  const port = process.env.PORT || 8000;

  await new Promise((resolve) => httpServer.listen(port, "0.0.0.0", resolve));
  console.log(
    `?Server started at http://localhost:${port}${server.graphqlPath}`
  );
})();

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION ?? Shutting down...");
  console.error("Error?", err.message);

  httpServer.close(async () => {
    process.exit(1);
  });
});
