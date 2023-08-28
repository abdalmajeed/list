import { randomUUID } from "crypto";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);
  const service: any = { id: "", title: "", description: "", img: "" };

  // id
  service.id = randomUUID();

  // title
  const title = body?.find((i) => i.name === "title")?.data.toString();
  if (title) service.title = title;

  // decription
  const description = body
    ?.find((i) => i.name === "description")
    ?.data.toString();
  if (description) service.description = description;

  // image
  const file = body?.find((i) => i.filename);

  if (file) {
    const folder = (await fs.existsSync("./public"))
      ? "./public"
      : "./src/public";
    const time = new Date().getMilliseconds();
    const filename = "/" + time + "_" + randomUUID();
    await fs.writeFileSync(folder + filename, file.data, {
      encoding: "utf-8",
    });
    service.img = filename;
  } else delete service.img;

  const jsonPath = "./db.json";
  const data = await fs.readFileSync(jsonPath, {
    encoding: "utf-8",
  });
  const db: Array<any> = await JSON.parse(data);
  db.push(service);
  await fs.writeFileSync(jsonPath, await JSON.stringify(db), {
    encoding: "utf-8",
  });

  return "success";
});
