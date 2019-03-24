import React, { useState, useEffect } from 'react';

import { ImageDataCanvas } from './ImageDataCanvas';
import { create, ImageDataContainer } from '../utils/ImageDataUtils';
import { connectContext } from '../../../context/SimulationContext';
import { Color } from '../../../utils/Draw';

interface Props {
    pressure: Float32Array;
    gridSize: number;

    canvasWidth: number;
    canvasHeight: number;
}

const PressureDrawRange = 0.5;

function pressureColor(pressure: number): Color {
    const factor = (pressure + PressureDrawRange) / (2 * PressureDrawRange);
    return [255 * factor, 0, 255 * (1 - factor), 255];
}

export const PressureBackground = connectContext(
    PressureBackgroundComponent,
    ({ state }) => ({
        gridSize: state.simulation.grid.size,
        pressure: state.simulation.artifacts.lastPressureVector,
    })
);

export function PressureBackgroundComponent({
    pressure,
    gridSize,
    canvasWidth,
    canvasHeight,
}: Props) {
    const [imageDataContainer, setImageDataContainer] = useState<
        ImageDataContainer
    >();

    useEffect(
        () => {
            const dataContainer =
                imageDataContainer || create(gridSize, gridSize);

            const imageDataPixels = dataContainer.value.data;

            pressure.forEach((pressureValue, ind) => {
                const imageDataOffset = ind * 4;
                imageDataPixels.set(
                    pressureColor(pressureValue),
                    imageDataOffset
                );
            });

            setImageDataContainer({
                value: dataContainer.value,
            });
        },
        [pressure]
    );

    return imageDataContainer ? (
        <ImageDataCanvas
            id="pressure-canvas"
            pixels={imageDataContainer}
            smoothingEnabled={true}
            width={canvasWidth}
            height={canvasHeight}
        />
    ) : null;
}
