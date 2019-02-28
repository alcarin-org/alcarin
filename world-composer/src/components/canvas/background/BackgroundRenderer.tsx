import React, { useRef, useEffect } from 'react';
import { ImageDataContainer } from '../utils/ImageDataUtils';
import { useCanvas } from '../utils/CanvasUtils';

interface Props {
    pixels: ImageDataContainer;
    width: number;
    height: number;
    smoothingEnabled: boolean;
}

export function BackgroundRenderer({
    pixels,
    width,
    height,
    smoothingEnabled,
}: Props) {
    const domCanvasRef = useRef<HTMLCanvasElement>(null);
    const [displayCanvas, displayCtx] = useCanvas(width, height, domCanvasRef);

    const [pixelCanvas, pixelCtx] = useCanvas(
        pixels.imageData.width,
        pixels.imageData.height
    );

    useEffect(
        () => {
            displayCtx.current!.imageSmoothingEnabled = smoothingEnabled;
        },
        [width, height, smoothingEnabled]
    );

    useEffect(
        () => {
            console.log('rerendering background');

            pixelCtx.current!.clearRect(
                0,
                0,
                pixels.imageData.width,
                pixels.imageData.height
            );
            const orig = pixelCtx.current!.getImageData(
                0,
                0,
                pixels.imageData.width,
                pixels.imageData.height
            );
            orig.data.set(pixels.imageData.data);
            pixelCtx.current!.putImageData(orig, 0, 0);
            displayCtx.current!.drawImage(
                pixelCanvas.current!,
                0,
                0,
                width,
                height
            );
        },
        [pixels]
    );

    return <canvas width={width} height={height} ref={domCanvasRef} />;
}
