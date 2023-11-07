require("dotenv").config();
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import logger from "morgan";
import express from "express";
import http from "http";
import cors from "cors";
import pkg from "body-parser";
import { resolvers, typeDefs } from "./schema";
import { getUser } from "./users/users.utils";

const { json } = pkg;
const PORT = process.env.PORT;
const app = express();
const httpServer = http.createServer(app);
async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    csrfPrevention: false,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    json(),
    logger("tiny"),
    graphqlUploadExpress(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          loggedInUser: await getUser(req.headers.token),
        };
      },
    })
  );
  app.use("/static", express.static("uploads"));

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀  Server ready at: http://localhost:${PORT}/graphql`);
}

startApolloServer(typeDefs, resolvers);
