import React, { useState, useEffect } from 'react';

import { ImageDataCanvas } from './ImageDataCanvas';
import { create, ImageDataContainer } from '../utils/ImageDataUtils';
import { DataContainer } from '../../../utils/Immutable';
import { Color } from '../../../utils/Draw';

interface Props {
    divergence: DataContainer<Float32Array>;
    bgWidth: number;
    bgHeight: number;

    canvasWidth: number;
    canvasHeight: number;
}

const DivergenceDrawRange = 0.1;

function divergenceColor(divergence: number): Color {
    const factor =
        (divergence + DivergenceDrawRange) / (2 * DivergenceDrawRange);
    return [255 * factor, 0, 255 * (1 - factor), 255];
}

export function DivergenceBackground({
    divergence,
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

            divergence.value.forEach((divergenceValue, ind) => {
                const imageDataOffset = ind * 4;
                imageDataPixels.set(
                    divergenceColor(divergenceValue),
                    imageDataOffset
                );
            });

            setImageDataContainer({
                value: dataContainer.value,
            });
        },
        [divergence]
    );

    return imageDataContainer ? (
        <ImageDataCanvas
            id="divergence-canvas"
            pixels={imageDataContainer}
            smoothingEnabled={true}
            width={canvasWidth}
            height={canvasHeight}
        />
    ) : null;
}
