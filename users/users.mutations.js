import bcrypt from "bcrypt";
import client from "../client";
import Jwt from "jsonwebtoken";
export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      // 확인 유저 네임이 있거나 이메일일 이미 있는 것을 데이터베이스 안에 _ 중복확인 제한
      try {
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
          throw new Error("이 아이디와 패스워드는 이미 존재합니다.");
        }
        // 만약에 없다면 hash password
        const uglyPassword = await bcrypt.hash(password, 10);
        // save adn return the user
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
      // find user with args.username
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "유저를 찾을 수 없습니다.",
        };
      }
      //check password with args.password()
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "잘못된 패스워드 입니다.",
        };
      }
      const token = await Jwt.sign({ id: user.id }, process.env.SECRECT_KEY);
      return {
        ok: true,
        token,
      };
      //issue a token and send it to the user
    },
  },
};
