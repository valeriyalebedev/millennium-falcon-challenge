export type Planet = string;

export class RouteMap{
    constructor(
        public readonly routes : Record<Planet, Record<Planet,number>>
    ){}

    getDestinations(from: Planet): Record<Planet, number> {
        return this.routes[from] || {};
    }
}