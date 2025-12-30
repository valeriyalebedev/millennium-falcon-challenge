import winstonLogger from "./logger.js";
import type { Logger } from "core";

export const coreLogger: Logger = {
  info: (msg: string) => winstonLogger.info(msg),
  debug: (msg: string) => winstonLogger.debug(msg),
  warn: (msg: string) => winstonLogger.warn(msg),
  error: (msg: string) => winstonLogger.error(msg)
};