import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password: newPassword, token }
    ) => {
      const { id } = await jwt.verify(token, process.env.SECRECT_KEY); // 토근 안에 서명된 아이디를 확인 할 수있다. 토큰을 해독한다.
      // const verifiedToken인데 임마를 출력하면 {id:1, iat: xxxx}가 나온다. 즉 오브젝트가 나오기 때문에 우리는 id가 필요하니깐 {id}를 사용해서 id꺼내서 사용하는 것
      let uglyPassword = null;
      if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
      }
      const updatedUser = await client.user.update({
        where: {
          id,
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(uglyPassword && { password: uglyPassword }),
        },
      });
      if (updatedUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "프로필 수정 실패 하였습니다.",
        };
      }
    },
  },
};
