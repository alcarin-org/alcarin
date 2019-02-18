import {
    Vector,
    constraints,
    normalize,
    multiply,
    magnitude,
    Point,
} from '../../utils/Math';
import { Atmosphere } from '../../data/Atmosphere';

export enum MapType {
    Pressure,
    Velocity,
}

type Color = [number, number, number];

const PressureDrawRange = 1.4;
const VelocityDrawRange = 4;

export function initializeGrid(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    fieldSizePx: number
) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    for (let i = 0; i < atmo.dim2d; i++) {
        for (let j = 0; j < atmo.dim2d; j++) {
            ctx.moveTo(i * fieldSizePx, (j + 1) * fieldSizePx - 1);
            ctx.lineTo(i * fieldSizePx, j * fieldSizePx);
            ctx.lineTo((i + 1) * fieldSizePx - 1, j * fieldSizePx);
        }
    }
    ctx.stroke();
}

export function renderVelocities(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    screenOffsetX: number,
    screenOffsetY: number,
    fieldSizePx: number
) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    atmo.forEach((node, pos) => {
        const offsetX =
            screenOffsetX + fieldSizePx * pos[0] + 0.5 * fieldSizePx;
        const offsetY =
            screenOffsetY + fieldSizePx * pos[1] + 0.5 * fieldSizePx;
        const vPower = constraints(0.1, 1, magnitude(node.velocity));
        const vNorm = normalize(node.velocity);
        const v = multiply(vNorm, 0.85 * fieldSizePx * vPower);

        ctx.moveTo(offsetX + -0.5 * v[0], offsetY + -0.5 * v[1]);
        ctx.lineTo(offsetX + 0.5 * v[0], offsetY + 0.5 * v[1]);

        ctx.fillRect(offsetX + 0.5 * v[0] - 2, offsetY + 0.5 * v[1] - 2, 4, 4);
    });
    ctx.stroke();
}

export function renderBgTexture(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    mapType: MapType
) {
    atmo.forEach((node, pos) => drawCell(ctx, mapType, atmo, pos));
}

export function renderBigBgTexture(
    ctx: CanvasRenderingContext2D,
    pixelOffset: number,
    canvasSizePx: number,
    fieldSizePx: number,
    atmo: Atmosphere,
    mapType: MapType
) {
    for (let i = 0; i < canvasSizePx; i++) {
        for (let j = 0; j < canvasSizePx; j++) {
            const p = pxToAtmoPos(i, j, fieldSizePx, atmo);
            let color: Color;
            switch (mapType) {
                case MapType.Velocity:
                    color = velocityColor(atmo.interpolateVelocity(p));
                    break;
                case MapType.Pressure:
                default:
                    color = pressureColor(atmo.interpolatePressure(p));
            }
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(i, j, 1, 1);
        }
    }
}

function drawCell(
    ctx: CanvasRenderingContext2D,
    mapType: MapType,
    atmo: Atmosphere,
    pos: Point
) {
    const node = atmo.get(pos);
    let color: Color;
    switch (mapType) {
        case MapType.Velocity:
            color = velocityColor(node.velocity);
            break;
        case MapType.Pressure:
        default:
            color = pressureColor(node.pressure);
    }
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.fillRect(pos[0], pos[1], 1, 1);
}

function pressureColor(pressure: number): Color {
    const factor = (pressure + PressureDrawRange) / (2 * PressureDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}

function velocityColor(velocity: Vector): Color {
    const length = magnitude(velocity);
    const factor = (length + VelocityDrawRange) / (2 * VelocityDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}

export function pxToAtmoPos(
    x: number,
    y: number,
    fieldSizePx: number,
    atmo: Atmosphere
): Point {
    return [
        x / fieldSizePx - atmo.radius + 1,
        y / fieldSizePx - atmo.radius + 1,
    ];
}
