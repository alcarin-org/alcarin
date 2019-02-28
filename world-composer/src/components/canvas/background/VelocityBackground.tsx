import React, { useState, useEffect } from 'react';

import { ImageDataCanvas } from './ImageDataCanvas';
import { create, ImageDataContainer } from '../utils/ImageDataUtils';
import { DataContainer } from '../../../utils/Immutable';
import { Color } from '../utils/CanvasUtils';

interface Props {
    velocityMagnitudeField: DataContainer<Float64Array>;
    bgWidth: number;
    bgHeight: number;

    canvasWidth: number;
    canvasHeight: number;
}

const VelocityDrawRange = 2.5;

function velocityColor(velocityMagnitude: number): Color {
    const factor =
        (velocityMagnitude + VelocityDrawRange) / (2 * VelocityDrawRange);
    return [255 * factor, 0, 255 * (1 - factor), 255];
}

export function VelocityBackground({
    velocityMagnitudeField,
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

            velocityMagnitudeField.value.forEach(
                (velocityMagnitudeValue, ind) => {
                    const imageDataOffset = ind * 4;
                    imageDataPixels.set(
                        velocityColor(velocityMagnitudeValue),
                        imageDataOffset
                    );
                }
            );

            setImageDataContainer({
                value: dataContainer.value,
            });
        },
        [velocityMagnitudeField]
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
