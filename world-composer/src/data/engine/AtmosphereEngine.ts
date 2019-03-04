import * as MACGrid from '../atmosphere/MACGrid';
import { precalcNeighboursMatrix, calculateFieldPressure } from './EngineUtils';

import {
    Point,
    multiply,
    add,
} from '../../utils/Math';

const StepDelaySec = 0.05;
export class AtmosphereEngine {
    public readonly grid: MACGrid.MACGridData;

    public readonly neightboursMatrix: Int8Array;

    public lastDivergenceVector: Float64Array;

    public lastPressureVector: Float64Array;

    public step: number = 0;

    private fluidSourcePos?: Point;

    private deltaTimeAcc: DOMHighResTimeStamp = 0;

    public constructor(grid: MACGrid.MACGridData) {
        this.grid = grid;
        this.neightboursMatrix = precalcNeighboursMatrix(grid);
        this.lastDivergenceVector = new Float64Array(this.grid.size ** 2);
        this.lastPressureVector = new Float64Array(this.grid.size ** 2);
        // this.lastPressureVector = this.calculatePressure(1);
    }

    public convectValue<T>(
        deltaTime: DOMHighResTimeStamp,
        p: Point,
        valueFromPos: (p: Point) => T
    ) {
        const vel = this.traceBackParticleVelocity(p, deltaTime);
        const pos = add(p, multiply(vel, deltaTime));

        return valueFromPos(pos);
    }

    public update(deltaTimeSec: DOMHighResTimeStamp) {
        this.deltaTimeAcc += deltaTimeSec;
        if (this.deltaTimeAcc >= StepDelaySec) {
            this.evolve(this.deltaTimeAcc);
            this.deltaTimeAcc = 0;
        }
    }

    public setFluidSource(p: Point) {
        const ind = MACGrid.index(this.grid, p);
        const itsSamePoint =
            this.fluidSourcePos &&
            p[0] === this.fluidSourcePos[0] &&
            p[1] === this.fluidSourcePos[1];
        this.fluidSourcePos =
            itsSamePoint || this.grid.solids[ind] === 1 ? undefined : p;
    }

    public applyExternalForces(deltaTime: DOMHighResTimeStamp) {
        // const halfP: Point = [-this.atmo.size / 2, -this.atmo.size / 2];
        // for (let i = 0; i < this.atmo.vectorSize; i++) {
        //     if (this.atmo.solidsVector[i] === 1) {
        //         continue;
        //     }
        //     const p = add(this.atmo.coords(i), halfP);
        //     const cor = multiply(normalize(perpendicular(p)), 0.05 * deltaTime);
        //     const centr = multiply(normalize(p), 0 * deltaTime);
        //     this.atmo.velX[i] += cor[0] + centr[0];
        //     this.atmo.velY[i] += cor[1] + centr[1];
        // }
        // gravity
        // for (let i = 0; i < this.atmo.vectorSize; i++) {
        //     if (this.atmo.solidsVector[i] === 1) {
        //         continue;
        //     }
        //     this.atmo.velY[i] += deltaTime * 1;
        // }
    }

    public divergenceVector(deltaTime: DOMHighResTimeStamp) {
        const divVector = MACGrid.divergenceVector(this.grid, 1 / deltaTime);
        this.lastDivergenceVector = divVector;

        return divVector.filter((_, ind) => this.grid.solids[ind] === 0);
    }

    public adjustVelocityFromPressure(
        gridPressureVector: Float64Array,
        deltaTime: DOMHighResTimeStamp
    ) {
        this.grid.field.velX = this.grid.field.velX.map((vel, ind) => {
            if (this.grid.solids[ind] === 1) {
                return 0;
            }
            const pos = MACGrid.coords(this.grid, ind);

            if (process.env.REACT_APP_DEBUG === '1') {
                MACGrid.assert(this.grid, pos);
                MACGrid.assert(this.grid, [pos[0] - 1, pos[1]]);
            }

            const posPressure = gridPressureVector[ind];
            const onLeftBorder = this.grid.solids[ind - 1] === 1;
            const pressureGradientX = onLeftBorder
                ? 0
                : posPressure - gridPressureVector[ind - 1];
            return vel - deltaTime * pressureGradientX;
        });

        this.grid.field.velY = this.grid.field.velY.map((vel, ind) => {
            if (this.grid.solids[ind] === 1) {
                return 0;
            }
            const pos = MACGrid.coords(this.grid, ind);

            if (process.env.REACT_APP_DEBUG === '1') {
                MACGrid.assert(this.grid, pos);
                MACGrid.assert(this.grid, [pos[0], pos[1] - 1]);
            }

            const posPressure = gridPressureVector[ind];
            const onTopBorder = this.grid.solids[ind - this.grid.size] === 1;
            const pressureGradientY = onTopBorder
                ? 0
                : posPressure - gridPressureVector[ind - this.grid.size];
            return vel - deltaTime * pressureGradientY;
        });
    }

    private evolve(deltaTime: DOMHighResTimeStamp) {
        this.generateFluid(deltaTime);

        this.convectVelocity(deltaTime);
        this.applyExternalForces(deltaTime);
        this.lastPressureVector = calculateFieldPressure(
            this.grid,
            this.neightboursMatrix,
            deltaTime
        );
        this.adjustVelocityFromPressure(this.lastPressureVector, deltaTime);
        this.step++;
    }

    private generateFluid(deltaTime: DOMHighResTimeStamp) {
        // const p = this.fluidSourcePos;
        // if (!p) {
        //     return;
        // }
        // const ind = this.atmo.index(p);
        // const FluidPower = 5;
        // const ParticlesPerSec = 220;
        // const SpeadRange = 0.5;
        // const fluidDir = normalize(
        //     multiply(add(p, [-this.atmo.size / 2, -this.atmo.size / 2]), -1)
        // );
        // const flow = multiply(fluidDir, FluidPower);
        // this.atmo.velX[ind] += flow[0];
        // this.atmo.velY[ind] += flow[1];
        // const newParticles = new Array(Math.floor(deltaTime * ParticlesPerSec))
        //     .fill(null)
        //     .map(() =>
        //         add(p, [
        //             SpeadRange - 2 * SpeadRange * Math.random(),
        //             SpeadRange - 2 * SpeadRange * Math.random(),
        //         ])
        //     )
        //     .filter(
        //         p => this.atmo.solidsVector[this.atmo.index(round(p))] === 0
        //     );
        // this.particles = this.particles.concat(newParticles);
    }

    private convectVelocity(deltaTime: DOMHighResTimeStamp) {
        const newVelX = this.grid.field.velX.map((_, ind) => {
            const p = MACGrid.coords(this.grid, ind);

            // we expecting that a walls are on entire left border of the map
            return this.grid.solids[ind] === 1 ||
                this.grid.solids[ind - 1] === 1
                ? 0
                : this.traceBackParticleVelocity(
                      [p[0] - 0.5, p[1]],
                      deltaTime
                  )[0];
        });
        const newVelY = this.grid.field.velX.map((_, ind) => {
            const p = MACGrid.coords(this.grid, ind);
            // we expecting that a walls are on entire top border of the map
            return this.grid.solids[ind] === 1 ||
                this.grid.solids[ind - this.grid.size] === 1
                ? 0
                : this.traceBackParticleVelocity(
                      [p[0], p[1] - 0.5],
                      deltaTime
                  )[1];
        });
        this.grid.field.velX = newVelX;
        this.grid.field.velY = newVelY;
    }

    private traceBackParticleVelocity(
        p: Point,
        deltaTime: DOMHighResTimeStamp
    ): Point {
        const v = MACGrid.interpolateVelocity(this.grid, p);
        const lastKnownP: Point = add(p, multiply(v, -0.5 * deltaTime));
        const avVelocity = MACGrid.interpolateVelocity(this.grid, lastKnownP);

        const particlePos = add(p, multiply(avVelocity, -deltaTime));
        return MACGrid.interpolateVelocity(this.grid, particlePos);
    }
}
