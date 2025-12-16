import type { Planet } from "./route-map.model.js";

/**
 * Each state of the journey is defined by the current planet, day, remaining fuel, and number of hunters encountered
 * 
 */
export class State{
    constructor(
        public readonly planet: Planet,
        public readonly day: number,
        public readonly fuel: number,
        public readonly hunters: number
    ){}

    key(): string {
        return `${this.planet}-${this.day}-${this.fuel}-${this.hunters}`;
    }
}