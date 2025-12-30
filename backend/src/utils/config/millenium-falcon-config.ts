import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { MilleniumFalconConfig } from 'core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadConfig(): MilleniumFalconConfig{
  const configPath = path.resolve(__dirname, "./millennium-falcon.json");
  const raw = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(raw) as MilleniumFalconConfig;

  config.routes_db = path.resolve(__dirname, config.routes_db);

  return config;
}
