import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    editComments: protectedResolver(
      async (_, { id, payload }, { loggedInUser }) => {
        const comment = await client.comment.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
          },
        });
        if (!comment) {
          return { ok: false, error: "Comment not found" };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            errror: "인가되지 않는 계정입니다.",
          };
        } else {
          await client.comment.update({
            where: {
              id,
            },
            data: {
              payload,
            },
          });
          return {
            ok: true,
          };
        }
      }
    ),
  },
};
