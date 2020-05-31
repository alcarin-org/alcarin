import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ImageDataCanvas } from './ImageDataCanvas';
import { createImageData } from '../utils/CanvasUtils';
import { RootState } from '../../../store/rootState';
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

export const PressureBackground = connect((state: RootState) => ({
    gridSize: state.simulation.grid.size,
    pressure: state.simulation.artifacts.lastPressureVector,
}))(PressureBackgroundComponent);

export function PressureBackgroundComponent({
    pressure,
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

    pressure.forEach((pressureValue, ind) =>
        imageDataPixels.set(pressureColor(pressureValue), ind * 4)
    );

    return (
        <ImageDataCanvas
            id="pressure-canvas"
            pixels={imageData}
            smoothingEnabled={true}
            width={canvasWidth}
            height={canvasHeight}
        />
    );
}
