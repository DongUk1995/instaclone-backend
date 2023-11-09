require("dotenv").config();
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import logger from "morgan";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import pkg from "body-parser";
import { resolvers, typeDefs } from "./schema";
import { getUser } from "./users/users.utils";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const { json } = pkg;
const PORT = process.env.PORT;
const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      if (!ctx.connectionParams?.token) {
        return { loggedInUser: null };
      }
      const loggedInUser = await getUser(ctx.connectionParams?.token);
      return {
        loggedInUser,
      };
    },
    onConnect: async (ctx) => {
      if (!ctx.connectionParams?.token) {
        throw new Error("token is missing");
      }
    },
    onDisconnect(ctx, code, reason) {},
  },
  wsServer
);

async function startServer() {
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    csrfPrevention: false,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    json(),
    graphqlUploadExpress(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        if (req) {
          return {
            loggedInUser: await getUser(req.headers.token),
          };
        }
      },
    })
  );
  app.use("/static", express.static("uploads"));

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀  Server ready at: http://localhost:${PORT}/graphql`);
}

startServer();
