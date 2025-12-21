import type { Planet } from "./route-map.model.js";

export class BountyHunters{
    constructor(
        private readonly data: Record<Planet, Record<number,boolean>>
    ){}

    isPresent(planet: Planet, day:number) :boolean {
        return !!this.data[planet]?.[day];
    }
}