import bcrypt from "bcrypt";
import client from "../../client";
import jwt from "jsonwebtoken";
import { protectResolver } from "../users.utils";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, email, password: newPassword },
      { loggedInUser }
    ) => {
      protectResolver(loggedInUser);
      let uglyPassword = null;
      if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
      }
      const updateUser = await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          firstName,
          lastName,
          email,
          ...(uglyPassword && { password: uglyPassword }), // ...(uglyPassword && {password: uglyPassword}) uglyPassword가 눌이면 참이다 뒤에꺼 실행
        },
      });
      if (updateUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "프로필을 업데이트 할 수 없습니다.",
        };
      }
    },
  },
};
