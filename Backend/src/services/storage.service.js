const ImageKit = require("@imagekit/nodejs").default;
const { toFile } = require("@imagekit/nodejs");

require("dotenv").config();

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(buffer) {
  const result = await imagekit.files.upload({
    file: await toFile(buffer, "image.jpg"),
    fileName: "image.jpg",
  });

  return result;
}

module.exports = uploadFile;