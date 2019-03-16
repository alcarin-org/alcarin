export enum MapType {
    Neutral,
    Pressure,
    Velocity,
    Divergence,
    Wall,
}

export interface MapSettings {
    drawFieldSize: number;
    mapType: MapType;
}

export interface InteractionContextState {
    fps: number;
    settings: MapSettings;
}

const InteractionContextState = {
    fps: 0,
    settings: {
        drawFieldSize: 25,
        mapType: MapType.Neutral,
    },
};

export default InteractionContextState;
