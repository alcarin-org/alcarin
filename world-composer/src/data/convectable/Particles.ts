import * as MACGrid from '../atmosphere/MACGrid';
import { Point, round } from '../../utils/Math';
import { ConvectValue } from './ConvectableValues';
import { Color, colorToNumber } from '../../utils/Draw';

export interface Particles {
    // bundled Points as Float32Array.
    // code format: [x1, y1, x2, y2, x3, y3, ...]
    positions: Float32Array;
    // colors encoded at float64 numbers (every 8-bit from 32-bits represent in order r,g,b,a values)
    colors: Uint32Array;
}

export const convectParticle: ConvectValue<Point, Particles> = (
    lastPos: Point
) => {
    // for particle it's new value is just it last position
    return lastPos;
};

const ParticleColors: Color[] = [
    // [168, 100, 253, 255],
    // [41, 205, 255, 255],
    [120, 255, 68, 255],
    // [255, 113, 141, 255],
    // [253, 255, 106, 255],
];

export function concatParticles(part1: Particles, part2: Particles): Particles {
    const positions = new Float32Array(
        part1.positions.length + part2.positions.length
    );
    positions.set(part1.positions, 0);
    positions.set(part2.positions, part1.positions.length);

    const colors = new Uint32Array(part1.colors.length + part2.colors.length);
    colors.set(part1.colors, 0);
    colors.set(part2.colors, part1.colors.length);

    return {
        positions,
        colors,
    };
}

export function createRandomParticles(
    count: number,
    grid: MACGrid.MACGridData,
    colors = ParticleColors
): Particles {
    const colorsAsNumbers = ParticleColors.map(colorToNumber);
    const particles: Particles = {
        positions: new Float32Array(2 * count),
        colors: new Uint32Array(count),
    };

    for (let i = 0; i < count; i++) {
        let p: Point | null = null;
        let containInd: number | null = null;
        do {
            p = [
                0.5 + Math.random() * (grid.size - 2),
                0.5 + Math.random() * (grid.size - 2),
            ];
            containInd = MACGrid.index(grid, round(p));
        } while (p === null || grid.solids[containInd] === 1);

        particles.positions.set(p, 2 * i);

        particles.colors[i] =
            colorsAsNumbers[Math.floor(Math.random() * colorsAsNumbers.length)];
    }
    return particles;
}
