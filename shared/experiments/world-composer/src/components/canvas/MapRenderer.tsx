import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../store/rootState';
import { MapType } from '../../store/reducers/settings/state';
import { PressureBackground } from './background/PressureBackground';
import { VelocityBackground } from './background/VelocityBackground';
import { SolidBackground } from './background/SolidBackground';
import { VelocityFieldRenderer } from './VelocityFieldRenderer';
import { ConfettiRenderer } from './ConfettiRenderer';

interface Props {
    gridSize: number;
    drawFieldSize: number;
    mapType: MapType;
}

export const MapRenderer = connect((state: RootState) => ({
    gridSize: state.simulation.grid.size,
    drawFieldSize: state.simulation.settings.drawFieldSize,
    mapType: state.simulation.settings.mapType,
}))(MapRendererComponent);

function MapRendererComponent({ mapType, gridSize, drawFieldSize }: Props) {
    const canvasSizePx = drawFieldSize * gridSize;

    return (
        <div
            className="map-renderer"
            style={{ width: canvasSizePx, height: canvasSizePx }}
        >
            {renderBackground(mapType, canvasSizePx)}
            {mapType === MapType.Velocity && (
                <VelocityFieldRenderer
                    width={canvasSizePx}
                    height={canvasSizePx}
                />
            )}
            {mapType === MapType.Neutral && (
                <ConfettiRenderer width={canvasSizePx} height={canvasSizePx} />
            )}
            <SolidBackground
                canvasWidth={canvasSizePx}
                canvasHeight={canvasSizePx}
            />
        </div>
    );
}

function renderBackground(mapType: MapType, canvasSizePx: number) {
    switch (mapType) {
        case MapType.Neutral:
            return null;
        case MapType.Pressure:
            return (
                <PressureBackground
                    canvasWidth={canvasSizePx}
                    canvasHeight={canvasSizePx}
                />
            );
        case MapType.Velocity:
            return (
                <VelocityBackground
                    canvasWidth={canvasSizePx}
                    canvasHeight={canvasSizePx}
                />
            );
    }
}
