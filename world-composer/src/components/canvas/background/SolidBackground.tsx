import React, { useState, useEffect } from 'react';

import { ImageDataCanvas } from './ImageDataCanvas';
import { createImageData } from '../utils/CanvasUtils';
import { Color } from '../../../utils/Draw';
import { connectContext } from '../../../context/SimulationContext';

interface Props {
    solids: Int8Array;
    gridSize: number;

    canvasWidth: number;
    canvasHeight: number;
}

const SolidColor: Color = [100, 100, 100, 255];
const TransparentColor: Color = [50, 50, 50, 0];

export const SolidBackground = connectContext(
    SolidBackgroundComponent,
    ({ state }) => ({
        solids: state.simulation.grid.solids,
        gridSize: state.simulation.grid.size,
    })
);

function SolidBackgroundComponent({
    solids,
    gridSize,
    canvasWidth,
    canvasHeight,
}: Props) {
    const [imageData, setImageData] = useState<ImageData>();

    useEffect(
        () => {
            setImageData(createImageData(gridSize, gridSize));
        },
        [gridSize]
    );

    if (!imageData) {
        return null;
    }

    const imageDataPixels = imageData.data;

    solids.forEach((isSolid, ind) =>
        imageDataPixels.set(
            isSolid === 1 ? SolidColor : TransparentColor,
            ind * 4
        )
    );

    return (
        <ImageDataCanvas
            id="solid-canvas"
            pixels={imageData}
            smoothingEnabled={false}
            width={canvasWidth}
            height={canvasHeight}
        />
    );
}
