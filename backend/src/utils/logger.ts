import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, json } = format;

//Define log format based on environment
//DEV format
const devFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp, level, message }) => `${timestamp}: [${level}] ${message}`)
);

//PROD format
const prodFormat = combine(
  timestamp(),
  json()
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new transports.Console({level: 'info'}),
    new transports.File({ filename: './logs/onboard_computer.log', level: 'debug' }) 
  ],
});

export default logger;
