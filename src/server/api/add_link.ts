import { randomUUID } from "crypto";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);
  const link: any = { id: "", title: "", url: "" };

  // id
  link.id = randomUUID();

  // title
  const title = body?.find((i) => i.name === "title")?.data.toString();
  if (title) link.title = title;

  // url
  const url = body?.find((i) => i.name === "url")?.data.toString();
  if (url) link.url = url;

  const jsonPath = "./links.json";
  const data = await fs.readFileSync(jsonPath, {
    encoding: "utf-8",
  });
  const db: Array<any> = await JSON.parse(data);
  db.push(link);
  await fs.writeFileSync(jsonPath, await JSON.stringify(db), {
    encoding: "utf-8",
  });

  return "success";
});
