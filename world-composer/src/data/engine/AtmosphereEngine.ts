import * as MACGrid from '../atmosphere/MACGrid';
import { precalcNeighboursMatrix, calculateFieldPressure } from './EngineUtils';

import {
    Point,
    multiply,
    add,
    // normalize,
    // perpendicular,
} from '../../utils/Math';

const StepDelaySec = 0.05;

type SimulationClickHandler = (deltaTime: DOMHighResTimeStamp) => void;

export interface EngineStateType {
    // lastDivergenceVector: Float32Array;
    // lastPressureVector: Float32Array;

    step: number;
}

export class AtmosphereEngine {
    public grid: MACGrid.MACGridData;

    public lastDivergenceVector: Float32Array;

    public lastPressureVector: Float32Array;

    public step: number = 0;

    // private deltaTimeAcc: DOMHighResTimeStamp = 0;

    private neightboursMatrix: Int8Array;


    public constructor(grid: MACGrid.MACGridData) {
        this.grid = grid;
        this.neightboursMatrix = precalcNeighboursMatrix(grid);
        this.lastDivergenceVector = new Float32Array(this.grid.size ** 2);
        this.lastPressureVector = new Float32Array(this.grid.size ** 2);
        // this.lastPressureVector = this.calculatePressure(1);
    }

    public toggleSolid(pos: Point, value: boolean) {
        const ind = MACGrid.index(this.grid, pos);
        const newValue = value ? 1 : 0;
        if (this.grid.solids[ind] === newValue) {
            return;
        }

        const newSolids = this.grid.solids.slice(0);
        newSolids[ind] = newValue ? 1 : 0;
        this.grid = { ...this.grid, solids: newSolids };
        this.neightboursMatrix = precalcNeighboursMatrix(this.grid);
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
        this.convectVelocity(deltaTimeSec);
        this.applyExternalForces(deltaTimeSec);
        this.lastPressureVector = calculateFieldPressure(
            this.grid,
            this.neightboursMatrix,
            deltaTimeSec
        );
        this.adjustVelocityFromPressure(this.lastPressureVector, deltaTimeSec);
        this.step++;
    }

    public applyExternalForces(deltaTime: DOMHighResTimeStamp) {
        // const halfP: Point = [
        //     -Math.trunc(this.grid.size / 2),
        //     -Math.trunc(this.grid.size / 2),
        // ];
        // for (let i = 0; i < this.grid.solids.length; i++) {
        //     if (this.grid.solids[i] === 1) {
        //         continue;
        //     }
        //     const coords = MACGrid.coords(this.grid, i);
        //     const vx = add([coords[0] - 0.5, coords[1]], halfP);
        //     const vy = add([coords[0], coords[1] - 0.5], halfP);
        //     const corFactor = 0.01;
        //     const corX = multiply(
        //         normalize(perpendicular(vx)),
        //         corFactor * deltaTime
        //     );
        //     const corY = multiply(
        //         normalize(perpendicular(vy)),
        //         corFactor * deltaTime
        //     );
        //     const centrFactor = 0.2;
        //     const centrX = multiply(normalize(vx), centrFactor * deltaTime);
        //     const centrY = multiply(normalize(vy), centrFactor * deltaTime);
        //     this.grid.field.velX[i] += centrX[0] + corX[0];
        //     this.grid.field.velY[i] += centrY[1] + corY[0];
        // }
        // gravity
        // for (let i = 0; i < this.atmo.vectorSize; i++) {
        //     if (this.atmo.solids[i] === 1) {
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
        gridPressureVector: Float32Array,
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
