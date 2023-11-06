import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    editComments(id: Int!, payload: String!): MutationResponse!
  }
`;
