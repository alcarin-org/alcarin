import React, { useState, useEffect } from 'react';

import {
    MACGridData,
    coords,
    interpolateVelocity,
} from '../../../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../../../data/engine/AtmosphereEngine';
import { magnitude } from '../../../utils/Math';
import { DataContainer } from '../../../utils/Immutable';

import { MapType } from '../utils/CanvasUtils';

import { PressureBackground } from './PressureBackground';
import { DivergenceBackground } from './DivergenceBackground';
import { VelocityBackground } from './VelocityBackground';

interface Props {
    atmo: MACGridData;
    driver: AtmosphereEngine;
    mapType: MapType;
    width: number;
    height: number;
}

export function BackgroundRenderer({
    atmo,
    driver,
    mapType,
    width,
    height,
}: Props) {
    // const [pressureContainer, setPressureContainer] = useState({
    //     value: atmo.pressureVector,
    // });
    const [divergenceContainer, setDivergenceContainer] = useState({
        value: driver.lastDivergenceVector,
    });
    const [velocityMagnitudeField, setVelocityMagnitudeField] = useState<
        DataContainer<Float64Array>
    >({ value: getAtmoVelocityMagnitudeVector(atmo) });

    useEffect(
        () => {
            switch (mapType) {
                // case MapType.Pressure:
                //     setPressureContainer({
                //         value: atmo.pressureVector,
                //     });
                case MapType.Divergence:
                    setDivergenceContainer({
                        value: driver.lastDivergenceVector,
                    });
                case MapType.Velocity:
                    setVelocityMagnitudeField({
                        value: getAtmoVelocityMagnitudeVector(atmo),
                    });
            }
        },
        [driver.step]
    );

    switch (mapType) {
        case MapType.Pressure:
            console.warn('todo: handle temp pressure');
            return null;
        // (
        //     <PressureBackground
        //         pressure={pressureContainer}
        //         canvasWidth={width}
        //         canvasHeight={height}
        //         bgWidth={atmo.size}
        //         bgHeight={atmo.size}
        //     />
        // );
        case MapType.Velocity:
            return (
                <VelocityBackground
                    velocityMagnitudeField={velocityMagnitudeField}
                    canvasWidth={width}
                    canvasHeight={height}
                    bgWidth={atmo.size}
                    bgHeight={atmo.size}
                />
            );
        case MapType.Divergence:
            return (
                <DivergenceBackground
                    divergence={divergenceContainer}
                    canvasWidth={width}
                    canvasHeight={height}
                    bgWidth={atmo.size}
                    bgHeight={atmo.size}
                />
            );
        default:
            return null;
    }
}

function getAtmoVelocityMagnitudeVector(grid: MACGridData) {
    return new Float64Array(grid.size ** 2).map((_, ind) =>
        grid.solids[ind] === 1
            ? 0
            : magnitude(interpolateVelocity(grid, coords(grid, ind)))
    );
}
