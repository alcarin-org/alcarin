import React, { useState, useEffect } from 'react';

import * as MACGrid from '../../../data/atmosphere/MACGrid';
import { ImageDataCanvas } from './ImageDataCanvas';
import { create, ImageDataContainer } from '../utils/ImageDataUtils';
import { Color } from '../../../utils/Draw';
import { connectContext } from '../../../context/SimulationContext';
import { magnitude } from '../../../utils/Math';

interface Props {
    grid: MACGrid.MACGridData;

    canvasWidth: number;
    canvasHeight: number;
}

const VelocityDrawRange = 2.5;

function velocityColor(velocityMagnitude: number): Color {
    const factor =
        (velocityMagnitude + VelocityDrawRange) / (2 * VelocityDrawRange);
    return [255 * factor, 0, 255 * (1 - factor), 255];
}

export const VelocityBackground = connectContext(
    VelocityBackgroundComponent,
    ({ state }) => ({
        grid: state.simulation.grid,
    })
);

export function VelocityBackgroundComponent({
    canvasWidth,
    canvasHeight,
    grid,
}: Props) {
    const [imageDataContainer, setImageDataContainer] = useState<
        ImageDataContainer
    >();

    const magnitudeVector = new Float32Array(grid.size ** 2).map((_, ind) =>
        grid.solids[ind] === 1
            ? 0
            : magnitude(
                  MACGrid.interpolateVelocity(grid, MACGrid.coords(grid, ind))
              )
    );

    useEffect(
        () => {
            const dataContainer =
                imageDataContainer || create(grid.size, grid.size);

            const imageDataPixels = dataContainer.value.data;

            magnitudeVector.forEach((velocityMagnitudeValue, ind) => {
                const imageDataOffset = ind * 4;
                imageDataPixels.set(
                    velocityColor(velocityMagnitudeValue),
                    imageDataOffset
                );
            });

            setImageDataContainer({
                value: dataContainer.value,
            });
        },
        [magnitudeVector]
    );

    return imageDataContainer ? (
        <ImageDataCanvas
            id="velocity-canvas"
            pixels={imageDataContainer}
            smoothingEnabled={true}
            width={canvasWidth}
            height={canvasHeight}
        />
    ) : null;
}
