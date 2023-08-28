import fs from "fs";

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);

  // id
  const id = body?.find((i) => i.name === "id")?.data.toString();
  if (!id) return { error: "id is required!" };

  const jsonPath = "./links.json";
  const data = await fs.readFileSync(jsonPath, {
    encoding: "utf-8",
  });
  const db: Array<any> = await JSON.parse(data);
  const linkIndex = db.findIndex((i) => i.id === id);
  const folder = (await fs.existsSync("./public"))
    ? "./public"
    : "./src/public";

  if (linkIndex >= 0) db.splice(linkIndex, 1);
  await fs.writeFileSync(jsonPath, await JSON.stringify(db), {
    encoding: "utf-8",
  });

  return "success";
});
