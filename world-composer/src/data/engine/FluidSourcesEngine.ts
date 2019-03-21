import * as MACGrid from '../atmosphere/MACGrid';
import * as Particles from '../convectable/Particles';
import { Color, colorToNumber } from '../../utils/Draw';
import { Point, round } from '../../utils/Math';

export enum FluidSourceType {
    Directional,
    // to create a sink, just create omni fluid source with negative power
    Omni,
}
export interface FluidSource {
    type: FluidSourceType;
    gridPosition: Point;
    // radius: number;
    power: number;

    particlesPerSecond: number;
    particlesColor: Color;
}

interface SourceInstance {
    source: FluidSource;
    particleAccumulator: number;
}

export interface FluidSourcesData {
    sources: SourceInstance[];
    // time accumulator to optimize removing
    // particles. changes here do not need to
    // be propagate as UX rerender
    removeTimeAcc: number;
}

export function create(): FluidSourcesData {
    return {
        sources: [],
        removeTimeAcc: 0,
    };
}

export function registerSource(
    fluids: FluidSourcesData,
    source: FluidSource
): FluidSourcesData {
    if (process.env.REACT_APP_DEBUG === '1') {
        assert(source.gridPosition);
    }
    fluids.sources.push({ source, particleAccumulator: 0 });
    return {
        ...fluids,
    };
    // if (source.type === FluidSourceType.Omni) {
    //     this.reapplyPressureModifiers();
    // }
}

export function update(
    fluidSources: FluidSourcesData,
    deltaTimeSec: DOMHighResTimeStamp
): FluidSourcesData {
    // fluidSources.sources.forEach((source, index) =>
    //     this.applySource(source, index, deltaTimeSec)
    // );

    fluidSources.removeTimeAcc += deltaTimeSec;
    // if (fluidSources.removeTimeAcc < 1) {
    //     // the change do not need to trigger any view rerender
    //     return fluidSources;
    //     // fluidSources.removeTimeAcc -= 1;
    //     // this.cleanupSinks();
    // }

    return { ...fluidSources };
}

export function removeSourcesAt(
    fluidSources: FluidSourcesData,
    gridPos: Point
): FluidSourcesData {
    fluidSources.sources = fluidSources.sources.filter(
        ({ source }) =>
            source.gridPosition[0] !== gridPos[0] ||
            source.gridPosition[1] !== gridPos[1]
    );
    return { ...fluidSources };
    // this.reapplyPressureModifiers();
}

// private cleanupSinks() {
//     // todo refactor together with particles buffer refactor
//     // const particles = this.particles;
//     // const particlesIndToRemove: Particles.HashTable = {};
//     // this.sources
//     //     .filter(sourceInstance => sourceInstance.source.power < 0)
//     //     .forEach(sourceInstance => {
//     //         for (let i = 0; i < particles.colors.length; i++) {
//     //             const x = particles.positions[2 * i];
//     //             const y = particles.positions[2 * i + 1];
//     //             const distance = magnitude([
//     //                 sourceInstance.source.gridPosition[0] - x,
//     //                 sourceInstance.source.gridPosition[1] - y,
//     //             ]);
//     //             if (distance < 0.25) {
//     //                 particlesIndToRemove[i] = null;
//     //             }
//     //         }
//     //     });
//     // this.particles = Particles.removeParticlesOnIndexes(
//     //     this.particlesEngine.particles,
//     //     particlesIndToRemove
//     // );
// }

export function applyPressureModifiersOn(
    grid: MACGrid.MACGridData,
    fluidSources: FluidSourcesData
): MACGrid.MACGridData {
    const newPressureModifiers = new Float32Array(grid.size ** 2);
    fluidSources.sources
        .filter(
            sourceInstance =>
                sourceInstance.source.type === FluidSourceType.Omni
        )
        .forEach(sourceInstance => {
            const gridIndex = MACGrid.index(
                grid,
                sourceInstance.source.gridPosition
            );
            newPressureModifiers[gridIndex] = sourceInstance.source.power;
        });
    return { ...grid, pressureModifiers: newPressureModifiers };
}

export function applyFluidSourcesOn(
    grid: MACGrid.MACGridData,
    particles: Particles.ParticlesData,
    fluidSources: FluidSourcesData,
    deltaTime: DOMHighResTimeStamp
) {
    for (const sourceInstance of fluidSources.sources) {
        switch (sourceInstance.source.type) {
            case FluidSourceType.Omni:
                const newParticles = generateOmniParticles(
                    grid,
                    particles,
                    sourceInstance,
                    deltaTime
                );

                if (newParticles) {
                    particles = Particles.concatParticles(
                        particles,
                        newParticles
                    );
                }
                break;
        }
    }

    return particles;
}

function generateOmniParticles(
    grid: MACGrid.MACGridData,
    particles: Particles.ParticlesData,
    sourceInstance: SourceInstance,
    deltaTime: DOMHighResTimeStamp
) {
    sourceInstance.particleAccumulator +=
        deltaTime * sourceInstance.source.particlesPerSecond;
    if (sourceInstance.particleAccumulator < 1) {
        return null;
    }
    const color = colorToNumber(sourceInstance.source.particlesColor);
    const count = Math.floor(sourceInstance.particleAccumulator);
    sourceInstance.particleAccumulator -= count;
    const newParticles: Particles.ParticlesData = {
        count,
        positions: new Float32Array(2 * count),
        colors: new Uint32Array(count).fill(color),
    };
    for (let i = 0; i < count; i++) {
        let p: Point | null = null;
        let containInd: number | null = null;
        do {
            p = [
                sourceInstance.source.gridPosition[0] +
                    0.5 * (1 - 2 * Math.random()),
                sourceInstance.source.gridPosition[1] +
                    0.5 * (1 - 2 * Math.random()),
            ];
            containInd = MACGrid.index(grid, round(p));
        } while (p === null || grid.solids[containInd] === 1);
        newParticles.positions.set(p, 2 * i);
    }
    return newParticles;
}

function assert(pos: Point) {
    if (process.env.REACT_APP_DEBUG === '1') {
        if (pos[0] !== Math.floor(pos[0]) || pos[1] !== Math.floor(pos[0])) {
            throw new Error(
                'Fluid source should be positioned only on center of grid cells.'
            );
        }
    }
}
