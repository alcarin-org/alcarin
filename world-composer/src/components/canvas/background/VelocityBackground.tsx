import React, { useState, useEffect } from 'react';

import * as MACGrid from '../../../data/atmosphere/MACGrid';
import { ImageDataCanvas } from './ImageDataCanvas';
import { createImageData } from '../utils/CanvasUtils';
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
    const [imageData, setImageData] = useState<ImageData>();

    useEffect(
        () => {
            setImageData(createImageData(grid.size, grid.size));
        },
        [grid.size]
    );

    if (!imageData) {
        return null;
    }

    const magnitudeVector = new Float32Array(grid.size ** 2).map((_, ind) =>
        grid.solids[ind] === 1
            ? 0
            : magnitude(
                  MACGrid.interpolateVelocity(grid, MACGrid.coords(grid, ind))
              )
    );

    const imageDataPixels = imageData.data;

    magnitudeVector.forEach((velocityMagnitudeValue, ind) =>
        imageDataPixels.set(velocityColor(velocityMagnitudeValue), ind * 4)
    );

    return (
        <ImageDataCanvas
            id="velocity-canvas"
            pixels={imageData}
            smoothingEnabled={true}
            width={canvasWidth}
            height={canvasHeight}
        />
    );
}
