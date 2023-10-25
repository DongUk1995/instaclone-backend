require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";

const PORT = process.env.PORT;
const server = new ApolloServer({
  schema,
  context: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk4MjM4NjI2fQ.dGgFGGHb-LPlbTpC5JWJ5H23LcruEoHUSDqX0IvmKls",
  },
});
server
  .listen(PORT)
  .then(() => console.log(`😗server is running on http://localhost:${PORT}/`));
