import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    deleteComments(id: Int!): MutationResponse!
  }
`;
