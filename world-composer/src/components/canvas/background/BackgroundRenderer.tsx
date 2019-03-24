import React from 'react';

import { connectContext } from '../../../context/SimulationContext';
import { MapType } from '../../../context/state';
import { PressureBackground } from './PressureBackground';
import { VelocityBackground } from './VelocityBackground';

interface Props {
    width: number;
    height: number;

    mapType: MapType;
}

export const BackgroundRenderer = connectContext(
    BackgroundRendererComponent,
    ({ state }) => ({
        mapType: state.settings.mapType,
    })
);

function BackgroundRendererComponent({ width, height, mapType }: Props) {
    switch (mapType) {
        case MapType.Pressure:
            return (
                <PressureBackground canvasWidth={width} canvasHeight={height} />
            );
        case MapType.Velocity:
            return (
                <VelocityBackground canvasWidth={width} canvasHeight={height} />
            );
        default:
            return null;
    }
}
