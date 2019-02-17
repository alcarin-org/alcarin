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
const VelocityDrawRange = 1.4;

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
    const factor = (length + PressureDrawRange) / (2 * PressureDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}
