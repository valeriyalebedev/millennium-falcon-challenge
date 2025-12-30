import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const { combine, timestamp, printf } = format;

//Define log format
const logFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp, level, message }) => `${timestamp}: [${level}] ${message}`)
);

// create logs folder if it doesn't exist
const logsDir = path.resolve(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.resolve(
  process.cwd(),
  "logs",
  "onboard_computer.log"
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console({level: "info"}),
    new transports.File({ filename: logFilePath, level: "debug" }) 
  ],
});

export default logger;
