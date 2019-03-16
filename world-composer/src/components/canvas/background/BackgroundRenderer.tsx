import React, { useState, useEffect, useContext } from 'react';

import {
    MACGridData,
    coords,
    interpolateVelocity,
} from '../../../data/atmosphere/MACGrid';
import { magnitude } from '../../../utils/Math';
import { DataContainer } from '../../../utils/Immutable';
import SimulationContext from '../../../context/SimulationContext';
import { MapType } from '../../../context/interaction/state';
// import { PressureBackground } from './PressureBackground';
import { DivergenceBackground } from './DivergenceBackground';
import { VelocityBackground } from './VelocityBackground';

interface Props {
    width: number;
    height: number;
    mapType: MapType;
}

export function BackgroundRenderer({ width, height, mapType }: Props) {
    const { grid, engine } = useContext(SimulationContext);
    // const [pressureContainer, setPressureContainer] = useState({
    //     value: atmo.pressureVector,
    // });
    const [divergenceContainer, setDivergenceContainer] = useState({
        value: engine.lastDivergenceVector,
    });
    const [velocityMagnitudeField, setVelocityMagnitudeField] = useState<
        DataContainer<Float32Array>
    >({ value: getAtmoVelocityMagnitudeVector(grid) });

    useEffect(
        () => {
            switch (mapType) {
                // case MapType.Pressure:
                //     setPressureContainer({
                //         value: grid.pressureVector,
                //     });
                case MapType.Divergence:
                    setDivergenceContainer({
                        value: engine.lastDivergenceVector,
                    });
                    break;
                case MapType.Velocity:
                    setVelocityMagnitudeField({
                        value: getAtmoVelocityMagnitudeVector(grid),
                    });
                    break;
            }
        },
        [engine.step]
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
                    bgWidth={grid.size}
                    bgHeight={grid.size}
                />
            );
        case MapType.Divergence:
            return (
                <DivergenceBackground
                    divergence={divergenceContainer}
                    canvasWidth={width}
                    canvasHeight={height}
                    bgWidth={grid.size}
                    bgHeight={grid.size}
                />
            );
        default:
            return null;
    }
}

function getAtmoVelocityMagnitudeVector(grid: MACGridData) {
    return new Float32Array(grid.size ** 2).map((_, ind) =>
        grid.solids[ind] === 1
            ? 0
            : magnitude(interpolateVelocity(grid, coords(grid, ind)))
    );
}
