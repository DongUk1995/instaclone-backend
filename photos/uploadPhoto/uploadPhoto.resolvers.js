import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hastagObjs = []; //해시태그 기본 값은 아무것도 없는 배열이다
        if (caption) {
          ///댓글이 존재하고 그 caption에 해시태그를 추출
          hastagObjs = processHashtags(caption);
        }
        ///댓글에 해시 태크가 존재하면 해시 태그를 생성하고 이미 존재할 수 있으니깐 해시태크를 get or create 작업을 할 것이다.
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hastagObjs.length > 0 && {
              hashtags: {
                connectOrCreate: hastagObjs,
              },
            }),
          },
        });

        //나중에 사진을 저장할 것이다. parsing 된 hashtags와 함게
        // 그 후에 그사진에 해당 해시태그를 추가 할 것이다.
      }
    ),
  },
};
