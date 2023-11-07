import AWS from "aws-sdk";

export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Buket: "sns-uploads",
      key: objectName,
      ACL: "public-read",
      Body: "readStream",
    })
    .promise();
  return Location;
};
