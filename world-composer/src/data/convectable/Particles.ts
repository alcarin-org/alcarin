import * as MACGrid from '../atmosphere/MACGrid';
import * as AtmosphereEngine from '../engine/AtmosphereEngine';
import { Point, round } from '../../utils/Math';
import { ConvectValue } from './ConvectableValues';
import { Color, colorToNumber } from '../../utils/Draw';

export interface ParticlesData {
    count: number;
    // bundled Points as Float32Array.
    // code format: [x1, y1, x2, y2, x3, y3, ...]
    positions: Float32Array;
    // colors encoded at float64 numbers (every 8-bit from 32-bits represent in order r,g,b,a values)
    colors: Uint32Array;
}

export const convectParticle: ConvectValue<Point, ParticlesData> = (
    lastPos: Point
) => {
    // for particle it's new value is just it last position
    return lastPos;
};

const ParticleColors: Color[] = [
    [168, 100, 253, 255],
    [41, 205, 255, 255],
    [120, 255, 68, 255],
    [255, 113, 141, 255],
    [253, 255, 106, 255],
];

export interface HashTable {
    [key: string]: null;
}

function sampleColor(): Color {
    return ParticleColors[Math.floor(Math.random() * ParticleColors.length)];
}

export function create(): ParticlesData {
    return {
        count: 0,
        positions: new Float32Array(0),
        colors: new Uint32Array(0),
    };
}

export function removeParticlesOnIndexes(
    particles: ParticlesData,
    indexesHash: HashTable
): ParticlesData {
    const size = Object.keys(indexesHash).length;
    const newPositions = new Float32Array(
        particles.positions.length - size * 2
    );
    const newColors = new Uint32Array(particles.colors.length - size);

    let newInd = 0;

    particles.colors.forEach((_, ind) => {
        if (ind in indexesHash) {
            return;
        }
        newColors[newInd] = particles.colors[ind];
        newPositions[2 * newInd] = particles.positions[2 * ind];
        newPositions[2 * newInd + 1] = particles.positions[2 * ind + 1];

        newInd++;
    });

    return {
        ...particles,
        positions: newPositions,
        colors: newColors,
    };
}

export function concatParticles(
    part1: ParticlesData,
    part2: ParticlesData
): ParticlesData {
    const positions = new Float32Array(
        part1.positions.length + part2.positions.length
    );
    positions.set(part1.positions, 0);
    positions.set(part2.positions, part1.positions.length);

    const colors = new Uint32Array(part1.colors.length + part2.colors.length);
    colors.set(part1.colors, 0);
    colors.set(part2.colors, part1.colors.length);

    return {
        count: colors.length,
        positions,
        colors,
    };
}

export function createRandomParticles(
    count: number,
    grid: MACGrid.MACGridData,
    color?: Color
): ParticlesData {
    const colorAsNumbers = colorToNumber(color || sampleColor());
    const particles: ParticlesData = {
        count,
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

        particles.colors[i] = colorAsNumbers;
    }
    return particles;
}

export function fillWithRandomParticles(
    particles: ParticlesData,
    count: number,
    grid: MACGrid.MACGridData
): ParticlesData {
    return concatParticles(particles, createRandomParticles(count, grid));
}

export function update(
    particles: ParticlesData,
    grid: MACGrid.MACGridData,
    deltaTime: DOMHighResTimeStamp
): ParticlesData {
    const positions = particles.positions;
    for (let i = 0; i < positions.length / 2; i++) {
        const i2 = i * 2;

        const newPos = AtmosphereEngine.convectValue(
            grid,
            deltaTime,
            [positions[i2], positions[i2 + 1]],
            lastPos => convectParticle(lastPos, particles, grid)
        );
        positions.set(newPos, i2);
    }
    return { ...particles };
}
