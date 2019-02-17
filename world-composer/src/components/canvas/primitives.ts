import {
    Vector,
    constraints,
    normalize,
    multiply,
    magnitude,
    Point,
} from '../../utils/Math';
import { Atmosphere } from '../../data/Atmosphere';

const PressureDrawRange = 1.4;

export function renderVelocity(
    ctx: CanvasRenderingContext2D,
    velocity: Vector,
    fieldSizePx: number,
    tipColor: string = 'yellow'
) {
    const vPower = constraints(0.1, 1, magnitude(velocity));
    const vNorm = normalize(velocity);
    const v = multiply(vNorm, 0.85 * fieldSizePx * vPower);

    ctx.clearRect(
        -0.5 * fieldSizePx,
        -0.5 * fieldSizePx,
        fieldSizePx,
        fieldSizePx
    );
    ctx.beginPath();
    ctx.moveTo(-0.5 * v[0], -0.5 * v[1]);
    ctx.lineTo(0.5 * v[0], 0.5 * v[1]);
    ctx.stroke();

    ctx.fillStyle = tipColor;
    ctx.fillRect(0.5 * v[0] - 1, 0.5 * v[1] - 1, 2, 2);
}

export function renderPressureTexture(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere
) {
    atmo.forEach((node, pos) => drawCell(ctx, atmo, pos));
}

function drawCell(ctx: CanvasRenderingContext2D, atmo: Atmosphere, pos: Point) {
    const pressureColor = cellColor(atmo.get(pos).pressure);
    ctx.fillStyle = `rgb(${pressureColor[0]}, ${pressureColor[1]}, ${
        pressureColor[2]
    })`;
    ctx.fillRect(pos[0], pos[1], 1, 1);
}

function cellColor(pressure: number) {
    const factor = (pressure + PressureDrawRange) / (2 * PressureDrawRange);
    return [255 * factor, 0, 255 * (1 - factor), 1];
}
