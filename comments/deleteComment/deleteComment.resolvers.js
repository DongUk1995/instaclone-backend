import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deleteComments: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const comment = await client.comment.findUnique({
        where: {
          id,
        },
      });
      if (!comment) {
        return {
          ok: false,
          error: "Photo not found",
        };
      } else if (comment.userId !== loggedInUser.id) {
        return {
          ok: false,
          error: "Not authorized",
        };
      } else {
        await client.comment.delete({
          where: {
            id,
          },
        });
        return { ok: true };
      }
    }),
  },
};
