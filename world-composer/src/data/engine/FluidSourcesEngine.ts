import { AtmosphereEngine } from './AtmosphereEngine';
import * as MACGrid from '../atmosphere/MACGrid';
import { ParticlesEngine } from './ParticlesEngine';
import {
    Particles,
    concatParticles,
    removeParticlesOnIndexes,
    HashTable,
} from '../convectable/Particles';
import { Color, colorToNumber } from '../../utils/Draw';
import { Point, round, magnitude } from '../../utils/Math';

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

export class FluidSourcesEngine {
    private sources: SourceInstance[] = [];

    private engine: AtmosphereEngine;
    private particlesEngine: ParticlesEngine;

    private removeTimeAcc: number = 0;

    public constructor(
        engine: AtmosphereEngine,
        particlesEngine: ParticlesEngine,
        base?: FluidSourcesEngine
    ) {
        this.engine = engine;
        this.particlesEngine = particlesEngine;
        if (base) {
            this.sources = base.sources;
            this.reapplyPressureModifiers();
        }
    }

    public registerSource(source: FluidSource) {
        if (process.env.REACT_APP_DEBUG === '1') {
            assert(source.gridPosition);
        }
        this.sources.push({ source, particleAccumulator: 0 });
        if (source.type === FluidSourceType.Omni) {
            this.reapplyPressureModifiers();
        }
    }

    public update(deltaTimeSec: DOMHighResTimeStamp) {
        this.sources.forEach((source, index) =>
            this.applySource(source, index, deltaTimeSec)
        );

        this.removeTimeAcc += deltaTimeSec;
        if (this.removeTimeAcc >= 1) {
            this.removeTimeAcc -= 1;
            this.cleanupSinks();
        }
        // const positions = this.particles.positions;
        // for (let i = 0; i < positions.length / 2; i++) {
        //     const i2 = i * 2;

        //     const newPos = this.engine.convectValue(
        //         deltaTime,
        //         [positions[i2], positions[i2 + 1]],
        //         lastPos =>
        //             convectParticle(lastPos, this.particles, this.engine.grid)
        //     );
        //     positions.set(newPos, i2);
        // }
        // this.particles = {
        //     ...this.particles,
        // };
    }

    public removeSourcesAt(gridPos: Point) {
        this.sources = this.sources.filter(
            ({ source }) =>
                source.gridPosition[0] !== gridPos[0] ||
                source.gridPosition[1] !== gridPos[1]
        );
        this.reapplyPressureModifiers();
    }

    private cleanupSinks() {
        const particles = this.particlesEngine.particles;
        const particlesIndToRemove: HashTable = {};
        this.sources
            .filter(sourceInstance => sourceInstance.source.power < 0)
            .forEach(sourceInstance => {
                for (let i = 0; i < particles.colors.length; i++) {
                    const x = particles.positions[2 * i];
                    const y = particles.positions[2 * i + 1];
                    const distance = magnitude([
                        sourceInstance.source.gridPosition[0] - x,
                        sourceInstance.source.gridPosition[1] - y,
                    ]);
                    if (distance < 0.1) {
                        particlesIndToRemove[i] = null;
                    }
                }
            });

        this.particlesEngine.particles = removeParticlesOnIndexes(
            this.particlesEngine.particles,
            particlesIndToRemove
        );
    }

    private reapplyPressureModifiers() {
        const newPressureModifiers = new Float32Array(
            this.engine.grid.size ** 2
        );
        this.sources
            .filter(
                sourceInstance =>
                    sourceInstance.source.type === FluidSourceType.Omni
            )
            .forEach(sourceInstance => {
                const gridIndex = MACGrid.index(
                    this.engine.grid,
                    sourceInstance.source.gridPosition
                );
                newPressureModifiers[gridIndex] = sourceInstance.source.power;
            });
        this.engine.grid.pressureModifiers = newPressureModifiers;
    }

    private generateOmniParticles(
        sourceInstance: SourceInstance,
        index: number,
        deltaTime: DOMHighResTimeStamp
    ) {
        sourceInstance.particleAccumulator +=
            deltaTime * sourceInstance.source.particlesPerSecond;
        if (sourceInstance.particleAccumulator < 1) {
            return;
        }

        const color = colorToNumber(sourceInstance.source.particlesColor);
        const count = Math.floor(sourceInstance.particleAccumulator);
        sourceInstance.particleAccumulator -= count;

        const newParticles: Particles = {
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
                containInd = MACGrid.index(this.engine.grid, round(p));
            } while (p === null || this.engine.grid.solids[containInd] === 1);

            newParticles.positions.set(p, 2 * i);
        }
        this.particlesEngine.particles = concatParticles(
            this.particlesEngine.particles,
            newParticles
        );
    }

    private applySource(
        sourceInstance: SourceInstance,
        index: number,
        deltaTime: DOMHighResTimeStamp
    ) {
        // if (source.type === FluidSourceType.Directional) {
        //     const sourceGridIndex = MACGrid.index(
        //         this.engine.grid,
        //         source.gridPosition
        //     );

        //     const sourceTopIndex = sourceGridIndex - this.engine.grid.size;
        //     const sourceLeftIndex = sourceGridIndex - 1;

        //     const power = source.power * deltaTime;
        //     if (!this.engine.grid.solids[sourceGridIndex]) {
        //         this.engine.grid.field.velX[sourceGridIndex] += power;
        //         this.engine.grid.field.velY[sourceGridIndex] += power;
        //     }
        //     if (!this.engine.grid.solids[sourceTopIndex]) {
        //         this.engine.grid.field.velY[sourceTopIndex] -= power;
        //     }
        //     if (!this.engine.grid.solids[sourceLeftIndex]) {
        //         this.engine.grid.field.velX[sourceLeftIndex] -= power;
        //     }
        // }

        // const FluidPower = 5;
        // const ParticlesPerSec = 220;
        // const SpeadRange = 0.5;
        // const fluidDir = normalize(
        //     multiply(add(p, [-this.atmo.size / 2, -this.atmo.size / 2]), -1)
        // );
        // const flow = multiply(fluidDir, FluidPower);
        // this.particlesEngine.particles
        switch (sourceInstance.source.type) {
            case FluidSourceType.Omni:
                this.generateOmniParticles(sourceInstance, index, deltaTime);
                break;
        }
    }
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
