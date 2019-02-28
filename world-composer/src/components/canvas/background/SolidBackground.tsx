import React, { useState, useEffect } from 'react';

import { BackgroundRenderer } from './BackgroundRenderer';
import { create, ImageDataContainer } from '../utils/ImageDataUtils';
import { Color } from '../utils/DrawUtils';

interface Props {
    solids: Int8Array;
    solidsWidth: number;
    solidsHeight: number;

    canvasWidth: number;
    canvasHeight: number;
}

const SolidColor: Color = [100, 100, 100, 255];
const NeutralColor: Color = [50, 50, 50, 255];

export function SolidBackground({
    solids,
    solidsWidth,
    solidsHeight,
    canvasWidth,
    canvasHeight,
}: Props) {
    const [imageDataContainer, setImageDataContainer] = useState<
        ImageDataContainer
    >();

    useEffect(
        () => {
            const dataContainer =
                imageDataContainer || create(solidsWidth, solidsHeight);

            const imageDataPixels = dataContainer.imageData.data;

            solids.forEach((isSolid, ind) => {
                const imageDataOffset = ind * 4;
                imageDataPixels.set(
                    isSolid === 1 ? SolidColor : NeutralColor,
                    imageDataOffset
                );
            });
            setImageDataContainer({
                imageData: dataContainer.imageData,
            });
        },
        [solids]
    );

    return imageDataContainer ? (
        <BackgroundRenderer
            pixels={imageDataContainer}
            smoothingEnabled={false}
            width={canvasWidth}
            height={canvasHeight}
        />
    ) : null;
}
