require("dotenv").config();
import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";

const PORT = process.env.PORT;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      protectResolver,
    }; // req의 정보를 받아아와서 getUser에 token을 주고 loggedInUser에 리턴
  },
});
server
  .listen(PORT)
  .then(() => console.log(`😗server is running on http://localhost:${PORT}✅`));
