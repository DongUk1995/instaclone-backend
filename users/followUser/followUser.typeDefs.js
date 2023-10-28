import { gql } from "apollo-server-express";

export default gql`
  type Mutaiton {
    followUser(toFollow: String): FollowUserResult
  }
`;
