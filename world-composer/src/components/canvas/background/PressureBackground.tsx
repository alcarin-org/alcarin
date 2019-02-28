import React, { useState, useEffect } from 'react';

import { ImageDataCanvas } from './ImageDataCanvas';
import { create, ImageDataContainer } from '../utils/ImageDataUtils';
import { DataContainer } from '../../../utils/Immutable';
import { Color } from '../utils/CanvasUtils';

interface Props {
    pressure: DataContainer<Float64Array>;
    bgWidth: number;
    bgHeight: number;

    canvasWidth: number;
    canvasHeight: number;
}

const PressureDrawRange = 0.5;

function pressureColor(pressure: number): Color {
    const factor = (pressure + PressureDrawRange) / (2 * PressureDrawRange);
    return [255 * factor, 0, 255 * (1 - factor), 255];
}

export function PressureBackground({
    pressure,
    bgWidth,
    bgHeight,
    canvasWidth,
    canvasHeight,
}: Props) {
    const [imageDataContainer, setImageDataContainer] = useState<
        ImageDataContainer
    >();

    useEffect(
        () => {
            const dataContainer =
                imageDataContainer || create(bgWidth, bgHeight);

            const imageDataPixels = dataContainer.value.data;

            pressure.value.forEach((pressureValue, ind) => {
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
