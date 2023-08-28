import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const folder = (await fs.existsSync("./public"))
    ? "./public"
    : "./src/public";

  if (event?.context.params?.name) {
    const filePath = folder + "/" + event?.context.params?.name;
    return sendStream(event, fs.createReadStream(filePath));
  }
  return "not found!";
});
