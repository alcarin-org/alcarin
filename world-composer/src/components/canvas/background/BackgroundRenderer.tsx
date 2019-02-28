import React, { useState, useEffect } from 'react';

import { Atmosphere } from '../../../data/Atmosphere';
import { VelocityDrivenAtmo } from '../../../data/VelocityDrivenAtmo';
import { magnitude } from '../../../utils/Math';
import { DataContainer } from '../../../utils/Immutable';

import { MapType } from '../utils/CanvasUtils';

import { PressureBackground } from './PressureBackground';
import { DivergenceBackground } from './DivergenceBackground';
import { VelocityBackground } from './VelocityBackground';

interface Props {
    atmo: Atmosphere;
    driver: VelocityDrivenAtmo;
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
    const [pressureContainer, setPressureContainer] = useState({
        value: atmo.pressureVector,
    });
    const [divergenceContainer, setDivergenceContainer] = useState({
        value: driver.lastDivergenceVector,
    });
    const [velocityMagnitudeField, setVelocityMagnitudeField] = useState<
        DataContainer<Float64Array>
    >({ value: getAtmoVelocityMagnitudeVector(atmo) });

    useEffect(
        () => {
            switch (mapType) {
                case MapType.Pressure:
                    setPressureContainer({
                        value: atmo.pressureVector,
                    });
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
            return (
                <PressureBackground
                    pressure={pressureContainer}
                    canvasWidth={width}
                    canvasHeight={height}
                    bgWidth={atmo.size}
                    bgHeight={atmo.size}
                />
            );
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

function getAtmoVelocityMagnitudeVector(atmo: Atmosphere) {
    return atmo.pressureVector.map((_, ind) =>
        atmo.solidsVector[ind] === 1
            ? 0
            : magnitude(atmo.interpolateVelocity(atmo.coords(ind)))
    );
}
