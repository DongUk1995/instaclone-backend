import client from "../client";
export default {
  User: {
    // 팔로잉은 자신의 팔료워 리스트에 내 아이다가 있는 사람들
    totalFollowing: ({ id }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }), // 팔로워는 자신의 팔료잉 리스트에 내 아이다가 있는 사람들
    totalFollowers: ({ id }) =>
      client.user.count({
        where: {
          following: { some: { id } },
        },
      }),
    //1. context에 로그인 된 user를 불러온다
    //2. 만약 로그인 된 유저라면 리턴 아이디 === 로그드.아이디 값을 반환 한다.
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    // isFollowing은 현재 보고 있는 아이디 loggedInuser는 현재 로그인한 유저
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      /* const exists = await client.user
        .findUnique({ where: { username: loggedInUser.username } })
        .following({ where: { id } }); */
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: { id },
          },
        },
      });
      //return exists !== 0;
      return Boolean(exists);
    }, // 현재 우리는 먼저 로그인 되어있는 유저를 찾고 로그인 된 유저의 팔로잉 리스트 안에 우리가 보고 있는 사람의 id가 있는지 검색해 본다.
  },
};
