import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRECT_KEY);
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

// const plus = (a,b) => a+b -> 함수 plus가 있고 a,b 라는 argument를 받으면 a+b는 리턴
export function protectedResolver(ourResolver) {
  return function (root, args, context, info) {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: "실핼하실려면 로그인 해주세요.",
      };
    }
    return ourResolver(root, args, context, info);
  };
}
