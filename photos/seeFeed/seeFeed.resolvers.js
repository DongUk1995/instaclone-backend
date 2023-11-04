import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeFeed: protectedResolver((_, __, { loggedInUser }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            { userId: loggedInUser.id },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    ),
  },
};

// 팔로워 목록에 내 이름이 있는 유저들의 photo를 찾으면 돼 팔로잉하는 사람들의 포토를 본다 ?
