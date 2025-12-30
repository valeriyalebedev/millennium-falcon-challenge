import { MilleniumFalconConfig } from "../models/millenium-falcon-config.model.js";

export function validateMilenniumFalconConfig(
  data: unknown
): MilleniumFalconConfig {
  const obj = data as any;

  if (typeof obj !== "object" || obj === null) {
    throw new Error("Invalid MilleniumFalconConfig: not an object");
  }

  if (typeof obj.autonomy !== "number" || obj.autonomy <= 0) {
    throw new Error(
      "Invalid MilleniumFalconConfig: autonomy must be a positive number"
    );
  }

  if (typeof obj.departure !== "string" || obj.departure.trim() === "") {
    throw new Error(
      "Invalid MilleniumFalconConfig: departure must be a non-empty string"
    );
  }

  if (typeof obj.arrival !== "string" || obj.arrival.trim() === "") {
    throw new Error(
      "Invalid MilleniumFalconConfig: arrival must be a non-empty string"
    );
  }

  if (typeof obj.routes_db !== "string" || obj.routes_db.trim() === "") {
    throw new Error(
      "Invalid MilleniumFalconConfig: routes_db must be a non-empty string"
    );
  }
  return obj as MilleniumFalconConfig;
}
