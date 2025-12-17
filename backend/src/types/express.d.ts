declare global{
    namespace Express{
        interface Locals{
            config: Config;
            routeMap: RouteMap;
        }
    }
}

export{}