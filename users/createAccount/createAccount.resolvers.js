import bcrypt from "bcrypt";
import client from "../../client";

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
  },
};
