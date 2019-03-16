export enum MapType {
    Neutral,
    Pressure,
    Velocity,
    Divergence,
}

export enum MapMode {
    Neutral,
    WallEditor,
}

const InteractionContextState = {
    fps: 0,
    settings: {
        drawFieldSize: 25,
        // map type tell map render mode
        mapType: MapType.Neutral,
        // map interaction mode, how clicks interact with map
        mapInteraction: {
            mode: MapMode.Neutral,
            // specific map interaction mode could need some config data
            payload: null as any,
        },
    },
};

export default InteractionContextState;
