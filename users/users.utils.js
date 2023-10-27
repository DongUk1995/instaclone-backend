import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null; // 토큰이 없는 경우도 있으니깐
    }
    const { id } = await jwt.verify(token, process.env.SECRECT_KEY); // 토근 안에 서명된 아이디를 확인 할 수있다. 토큰을 해독한다.
    // const verifiedToken인데 임마를 출력하면 {id:1, iat: xxxx}가 나온다. 즉 오브젝트가 나오기 때문에 우리는 id가 필요하니깐 {id}를 사용해서 id꺼내서 사용하는 것
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export function protectedResolver(ourResolver) {
  return function (root, args, context, info) {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: "Please log in to perform this action.",
      };
    }
    return ourResolver(root, args, context, info);
  };
}
