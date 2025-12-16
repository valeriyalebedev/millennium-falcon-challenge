import path from "path";
import fs, { cp } from "fs";
import { fileURLToPath } from "url";

export interface Config {
  autonomy: number;
  departure: string;
  arrival: string;
  routes_db: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadConfig(): Config {
  const configPath = path.resolve(__dirname, "./millennium-falcon.json");
  const raw = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(raw) as Config;

  config.routes_db = path.resolve(__dirname, config.routes_db);

  return config;
}
