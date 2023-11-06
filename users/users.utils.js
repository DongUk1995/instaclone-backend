import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRECT_KEY);
    const user = await client.user.findUnique({
      where: { id },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
// 밑에 이놈이 리솔버를 실행할 때 가로챈다 즉 : 배열로 result해야하는데 임마가 가로채서 ok:flase로 딕렉토리 출력으로 Iterable에러라고 나온다.
export const protectedResolver =
  (ourResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action.",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
