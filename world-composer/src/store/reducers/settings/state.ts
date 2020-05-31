export enum MapType {
    Neutral,
    Pressure,
    Velocity,
}

export enum MapMode {
    Neutral,
    WallEditor,
    SourcesAndSinks,
}

export default {
    // how fast time will pass for simulation, x1 means normal
    timeFactor: 1,
    // how many loops will be done when approximating solution of pressure
    // equtations
    calcDetailsFactor: 10,
    drawFieldSize: 25,
    // map type tell map render mode
    mapType: MapType.Neutral,
    // map interaction mode, how clicks interact with map
    mapInteraction: {
        mode: MapMode.Neutral,
        // specific map interaction mode could need some config data
        data: null as any,
    },
};
