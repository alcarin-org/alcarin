import { useEffect, useRef, RefObject } from 'react';

export function useCanvas(
    width: number,
    height: number,
    sourceCanvasRef?: RefObject<HTMLCanvasElement>
): [
    RefObject<HTMLCanvasElement | null>,
    RefObject<CanvasRenderingContext2D | null>
] {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = sourceCanvasRef
            ? sourceCanvasRef.current!
            : document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        canvasRef.current = canvas;
        ctxRef.current = ctx;
    }, []);

    return [canvasRef, ctxRef];
}
