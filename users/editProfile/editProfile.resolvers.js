import { createWriteStream } from "fs";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";
import { uploadPhoto } from "../../shared/shared.utils";

const editProfileResolver = async (
  _,
  { username, email, name, password: newPassword, location, avatar },
  { loggedInUser }
) => {
  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await uploadPhoto(avatar, loggedInUser.id);
  }
  /* const { filename, createReadStream } = await avatar;
  const newFileName = `${loggedInUser.id}-${Date.now()}-${filename}`;
  const readStream = createReadStream();
  const writeStream = createWriteStream(
    process.cwd() + "/uploads/" + newFileName
  );
  readStream.pipe(writeStream);
  avatarUrl = `http://localhost:${process.env.PORT}/static/${newFileName}`;
 */
  let newCryptPassword = null;
  if (newPassword) {
    newCryptPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      username,
      email,
      name,
      location,
      ...(avatarUrl && { avatar: avatarUrl }),
      ...(newCryptPassword && { password: newCryptPassword }),
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not update profile.",
    };
  }
};

export default {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectedResolver(editProfileResolver),
  },
};
