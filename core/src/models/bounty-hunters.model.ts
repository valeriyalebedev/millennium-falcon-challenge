import type { Planet } from "./route-map.model.js";

type BountyArray = { planet: Planet; day: number }[];
type BountyRecord = Record<Planet, Record<number, boolean>>;

export class BountyHunters {
  private readonly data: Record<Planet, Record<number, boolean>> = {};

  constructor(rawData: BountyArray | BountyRecord) {
    if (Array.isArray(rawData)) {
      // If it's an array — convert to Record
      for (const { planet, day } of rawData) {
        const planetData = (this.data[planet] ??= {});
        planetData[day] = true;
      }
    } else {
      // If its a Record — copy directly
      for (const planet in rawData) {
        const planetData = (rawData[planet] ??= {});
        const targetPlanetData = (this.data[planet as Planet] ??= {}); // безопасная инициализация

        for (const dayStr in planetData) {
          const day = parseInt(dayStr, 10);
          targetPlanetData[day] = !!planetData[dayStr];
        }
      }
    }
  }

  isPresent(planet: Planet, day: number): boolean {
    return !!this.data[planet]?.[day];
  }
}
