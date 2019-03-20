import React, { useState, useEffect } from 'react';

import { ImageDataCanvas } from './ImageDataCanvas';
import { create, ImageDataContainer } from '../utils/ImageDataUtils';
import { Color } from '../../../utils/Draw';
import { connectContext } from '../../../context/SimulationContext';

interface Props {
    solids: Int8Array;
    bgWidth: number;
    bgHeight: number;

    canvasWidth: number;
    canvasHeight: number;
}

const SolidColor: Color = [100, 100, 100, 255];
const TransparentColor: Color = [50, 50, 50, 0];

export const SolidBackground = connectContext(
    SolidBackgroundComponent,
    ({ state }) => ({
        solids: state.simulation.grid.solids,
    })
);

function SolidBackgroundComponent({
    solids,
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

            solids.forEach((isSolid, ind) => {
                const imageDataOffset = ind * 4;
                imageDataPixels.set(
                    isSolid === 1 ? SolidColor : TransparentColor,
                    imageDataOffset
                );
            });
            setImageDataContainer({
                // new container, but same, mutated data inside (for performance)
                value: dataContainer.value,
            });
        },
        [solids]
    );

    return imageDataContainer ? (
        <ImageDataCanvas
            id="solid-canvas"
            pixels={imageDataContainer}
            smoothingEnabled={false}
            width={canvasWidth}
            height={canvasHeight}
        />
    ) : null;
}
