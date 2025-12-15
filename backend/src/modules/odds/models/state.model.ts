import type { Planet } from "./route-map.model.js";

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