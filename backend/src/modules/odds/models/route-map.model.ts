export type Planet = string;

export class RouteMap{
    private routes: Record<Planet, Record<Planet,number>>;
    constructor(
        routes : Record<Planet, Record<Planet,number>>
    ){
        this.routes = routes;
    }

    getDestinations(from: Planet): Record<Planet, number> {
        return this.routes[from] || {};
    }

    get routesData(){
        return this.routes
    }
}