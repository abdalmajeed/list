import fs from "fs";

export default defineEventHandler(async (event) => {
  const jsonPaths = ["./db.json", "./links.json"];

  const result = { services: [], links: [] };
  for await (const jsonPath of jsonPaths) {
    if (!(await fs.existsSync(jsonPath))) {
      await fs.writeFileSync(jsonPath, await JSON.stringify([]), {
        encoding: "utf-8",
      });
    }
    const data = await fs.readFileSync(jsonPath, {
      encoding: "utf-8",
    });
    const db = await JSON.parse(data);
    if (jsonPath === "./db.json") result.services = db;
    else result.links = db;
  }

  return result;
});
