import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../client";

export default {
  Mutation: {
    // 사용자가 우리에게 줄 데이터
    crateAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        // 먼저 사용자나 이메일이 데이터베이스에 있는지 확인한다.
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("이 아이디와 비번은 이미 존재합니다."); // throw를 하면 밑에 return은 실행 되지 않는다. 폭탄같은 거다 폭탄 터짐 좆댐
        }
        // 해시 패스워드
        const uglyPassword = await bcrypt.hash(password, 10);
        return client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
      } catch (e) {
        return e;
      }
    },
    login: async (_, { username, password }) => {
      // 유저를 먼저 찾고
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "아이디를 찾을 수 없습니다..",
        };
      }
      // 패스워드를 체크하고
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "비밀번호가 잘못 되었습니다.",
        };
      }
      // 만약 둘다 문제 없으면 토큰을 발생해서 유저에게 리턴
      const token = await jwt.sign({ id: user.id }, process.env.SECRECT_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
