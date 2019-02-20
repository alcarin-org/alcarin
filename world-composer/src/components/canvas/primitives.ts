import {
    Vector,
    constraints,
    normalize,
    multiply,
    magnitude,
    Point,
    add,
} from '../../utils/Math';
import { Atmosphere } from '../../data/Atmosphere';

export enum MapType {
    Pressure,
    Velocity,
    Divergence,
}

type Color = [number, number, number];

const PressureDrawRange = 2;
const VelocityDrawRange = 2.5;
const DivergenceDrawRange = 0.5;

export function initializeGrid(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    fieldSizePx: number
) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    for (let i = 0; i < atmo.size; i++) {
        for (let j = 0; j < atmo.size; j++) {
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
    fieldSizePx: number
) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    for (let i = 0; i < atmo.size; i++) {
        for (let j = 0; j < atmo.size; j++) {
            const vel = atmo.interpolateVelocity([i, j]);
            const offset = posToPx([i, j], fieldSizePx, atmo);
            const vPower = constraints(0.1, 1, magnitude(vel));
            const vNorm = normalize(vel);
            const v = multiply(vNorm, 0.85 * fieldSizePx * vPower);

            ctx.moveTo(offset[0] + -0.5 * v[0], offset[1] + -0.5 * v[1]);
            ctx.lineTo(offset[0] + 0.5 * v[0], offset[1] + 0.5 * v[1]);

            ctx.fillRect(
                offset[0] + 0.5 * v[0] - 2,
                offset[1] + 0.5 * v[1] - 2,
                4,
                4
            );
        }
    }
    ctx.stroke();
}

export function renderBgTexture(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    mapType: MapType
) {
    const divVector =
        mapType === MapType.Divergence ? atmo.divergenceVector() : null;
    for (let i = 0; i < atmo.size; i++) {
        for (let j = 0; j < atmo.size; j++) {
            const pos: Point = [i, j];
            let color: Color;
            switch (mapType) {
                case MapType.Velocity:
                    color = velocityColor(atmo.interpolateVelocity(pos));
                    break;
                case MapType.Divergence:
                    color = divergenceColor(divVector![atmo.index(pos)]);
                    break;
                case MapType.Pressure:
                default:
                    const ind = atmo.index(pos);
                    color = pressureColor(atmo.pressureVector[ind]);
            }
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(pos[0], pos[1], 1, 1);
        }
    }
}

export function renderBigBgTexture(
    ctx: CanvasRenderingContext2D,
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
                    color = velocityColor(
                        atmo.interpolateVelocity(add(p, [0, -0.5]))
                    );
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

function pressureColor(pressure: number): Color {
    const factor = (pressure + PressureDrawRange) / (2 * PressureDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}

function velocityColor(velocity: Vector): Color {
    const length = magnitude(velocity);
    const factor = (length + VelocityDrawRange) / (2 * VelocityDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}

function divergenceColor(divergence: number): Color {
    const factor =
        (divergence + DivergenceDrawRange) / (2 * DivergenceDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}

export function pxToAtmoPos(
    x: number,
    y: number,
    fieldSizePx: number,
    atmo: Atmosphere
): Point {
    return [x / fieldSizePx - 0.5, y / fieldSizePx - 0.5];
}

export function posToPx(
    p: Point,
    fieldSizePx: number,
    atmo: Atmosphere
): Point {
    return [(p[0] + 0.5) * fieldSizePx, (p[1] + 0.5) * fieldSizePx];
}
