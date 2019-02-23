import { Atmosphere } from './Atmosphere';
import {
    Point,
    Vector,
    interpolate,
    multiply,
    add,
    round,
    resolveLinearByJacobi,
    normalize,
    magnitude,
    perpendicular,
} from '../utils/Math';

enum VectorComponent {
    x = 0,
    y = 1,
}

const relNeightbours: Vector[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
type ValueFromPositionFn<T> = (p: Point) => T;
type ConvectHook = <T>(
    convectValue: <T>(p: Point, getValue: ValueFromPositionFn<T>) => T
) => void;

export class VelocityDrivenAtmo {
    public readonly atmo: Atmosphere;

    public readonly neightboursMatrix: Int8Array;

    public particles: Point[] = [];

    private onConvectHooks: ConvectHook[] = [];

    private fluidSourcePos?: Point;

    public constructor(atmo: Atmosphere) {
        this.atmo = atmo;
        this.neightboursMatrix = this.precalcNeightboursMatrix();
        this.atmo.pressureVector = this.calculatePressure(1);
    }

    public registerConvectHook(hook: ConvectHook) {
        this.onConvectHooks.push(hook);
    }

    public spawnPartcles(count: number) {
        this.particles = this.particles.concat(
            new Array(count)
                .fill(null)
                .map(
                    () =>
                        [
                            1 + Math.random() * (this.atmo.size - 3),
                            1 + Math.random() * (this.atmo.size - 3),
                        ] as Point
                )
        );
    }

    public convectValue<T>(
        deltaTime: number,
        p: Point,
        valueFromPos: (p: Point) => T
    ) {
        const vel = this.traceBackParticleVelocity(p, deltaTime);
        return valueFromPos(add(p, multiply(vel, deltaTime)));
    }

    public evolve(deltaTime: number) {
        this.generateFluid(deltaTime);

        this.convectVelocity(deltaTime);
        this.applyExternalForces(deltaTime);
        this.atmo.pressureVector = this.calculatePressure(deltaTime);
        this.adjustVelocityFromPressure(this.atmo.pressureVector, deltaTime);

        this.particles = this.particles.map(p =>
            this.convectValue(deltaTime, p, v => v)
        );
        this.onConvectHooks.forEach(hook =>
            hook((p, getValue) => this.convectValue(deltaTime, p, getValue))
        );
    }

    public setFluidSource(p: Point) {
        const ind = this.atmo.index(p);
        const itsSamePoint =
            this.fluidSourcePos &&
            p[0] === this.fluidSourcePos[0] &&
            p[1] === this.fluidSourcePos[1];
        this.fluidSourcePos =
            itsSamePoint || this.atmo.solidsVector[ind] === 1 ? undefined : p;
    }

    public applyExternalForces(deltaTime: number) {
        // const center: Point = [
        //     Math.floor(this.atmo.size / 2),
        //     Math.floor(this.atmo.size / 2),
        // ];
        // const ind = this.atmo.index(center);
        // const indRight = this.atmo.index([center[0] + 1, center[1]]);
        // const indBottom = this.atmo.index([center[0], center[1] + 1]);
        // const forcePower = 10;
        // this.atmo.velX[ind] -= deltaTime * forcePower + Math.random();
        // this.atmo.velY[ind] -= deltaTime * forcePower + Math.random();
        // this.atmo.velX[indRight] += deltaTime * forcePower + Math.random();
        // this.atmo.velY[indBottom] -= deltaTime * forcePower + Math.random();
        // const halfP: Point = [-this.atmo.size / 2, -this.atmo.size / 2];
        // for (let i = 0; i < this.atmo.vectorSize; i++) {
        //     if (this.atmo.solidsVector[i] === 1) {
        //         continue;
        //     }
        //     const p = add(this.atmo.coords(i), halfP);
        //     const v = multiply(perpendicular(p), 0 * 1 / this.atmo.size);
        //     // this.atmo.velX[i] += v[0] * deltaTime;
        //     // this.atmo.velY[i] += v[1] * deltaTime;
        //     this.atmo.velY[i] += deltaTime * (this.atmo.coords(i)[1] / this.atmo.size);
        // }
        // gravity
        for (let i = 0; i < this.atmo.vectorSize; i++) {
            if (this.atmo.solidsVector[i] === 1) {
                continue;
            }
            this.atmo.velY[i] += deltaTime * 0.1;
        }
    }

    public divergenceVector(deltaTime: number) {
        const divVector = this.atmo.divergenceVector(1 / deltaTime);

        return divVector.filter((_, ind) => this.atmo.solidsVector[ind] === 0);
    }

    public calculatePressure(deltaTime: number) {
        const neighboursMatrixA = this.neightboursMatrix;
        const divergenceVectorB = this.divergenceVector(deltaTime);
        const fluidPressureSolveVector = resolveLinearByJacobi(
            neighboursMatrixA,
            divergenceVectorB
        );

        let iFluidCellInd = 0;
        return this.atmo.pressureVector.map((isSolid, ind) =>
            this.atmo.solidsVector[ind] === 1
                ? 0
                : fluidPressureSolveVector[iFluidCellInd++]
        );
    }

    public adjustVelocityFromPressure(
        gridPressureVector: Float64Array,
        deltaTime: number
    ) {
        this.atmo.velX = this.atmo.velX.map((vel, ind) => {
            if (this.atmo.solidsVector[ind] === 1) {
                return 0;
            }
            const pos = this.atmo.coords(ind);
            this.atmo.assert(pos);
            this.atmo.assert([pos[0] - 1, pos[1]]);

            const posPressure = gridPressureVector[ind];
            const onLeftBorder = this.atmo.solidsVector[ind - 1] === 1;
            const pressureGradientX = onLeftBorder
                ? 0
                : posPressure - gridPressureVector[ind - 1];
            return vel - deltaTime * pressureGradientX;
        });

        this.atmo.velY = this.atmo.velY.map((vel, ind) => {
            if (this.atmo.solidsVector[ind] === 1) {
                return 0;
            }
            const pos = this.atmo.coords(ind);
            this.atmo.assert(pos);
            this.atmo.assert([pos[0], pos[1] - 1]);

            const posPressure = gridPressureVector[ind];
            const onTopBorder =
                this.atmo.solidsVector[ind - this.atmo.size] === 1;
            const pressureGradientY = onTopBorder
                ? 0
                : posPressure - gridPressureVector[ind - this.atmo.size];
            return vel - deltaTime * pressureGradientY;
        });
    }

    private generateFluid(deltaTime: number) {
        const p = this.fluidSourcePos;
        if (!p) {
            return;
        }
        const ind = this.atmo.index(p);

        const FluidPower = 3;
        const ParticlesPerSec = 200;
        const SpeadRange = 2;

        const fluidDir = normalize(
            multiply(add(p, [-this.atmo.size / 2, -this.atmo.size / 2]), -1)
        );
        const flow = multiply(fluidDir, FluidPower);
        this.atmo.velX[ind] += flow[0];
        this.atmo.velY[ind] += flow[1];

        const newParticles = new Array(Math.floor(deltaTime * ParticlesPerSec))
            .fill(null)
            .map(() =>
                add(p, [
                    SpeadRange - 2 * SpeadRange * Math.random(),
                    SpeadRange - 2 * SpeadRange * Math.random(),
                ])
            )
            .filter(
                p => this.atmo.solidsVector[this.atmo.index(round(p))] === 0
            );
        this.particles = this.particles.concat(newParticles);
    }

    private convectVelocity(deltaTime: number) {
        const newVelX = this.atmo.velX.map((_, ind) => {
            const p = this.atmo.coords(ind);

            // we expecting that a walls are on entire left border of the map
            return this.atmo.solidsVector[ind] === 1 ||
                this.atmo.solidsVector[ind - 1] === 1
                ? 0
                : this.traceBackParticleVelocity(
                      [p[0] - 0.5, p[1]],
                      deltaTime
                  )[0];
        });
        const newVelY = this.atmo.velX.map((_, ind) => {
            const p = this.atmo.coords(ind);
            // we expecting that a walls are on entire top border of the map
            return this.atmo.solidsVector[ind] === 1 ||
                this.atmo.solidsVector[ind - this.atmo.size] === 1
                ? 0
                : this.traceBackParticleVelocity(
                      [p[0], p[1] - 0.5],
                      deltaTime
                  )[1];
        });
        this.atmo.velX = newVelX;
        this.atmo.velY = newVelY;
    }

    private precalcNeightboursMatrix() {
        // neightbours matrix for every cell show negative number of non-solid neighbours
        // for given cell and "1" for the cell neighbours. other cells are marked as "0".
        // it only include fluid cells
        const matrix = new Int8Array(this.atmo.vectorSize ** 2);

        // let iFluidCell = 0;

        for (let iCell = 0; iCell < this.atmo.vectorSize; iCell++) {
            if (this.atmo.solidsVector[iCell] === 1) {
                continue;
            }

            const rowOffset = iCell * this.atmo.vectorSize;
            const p = this.atmo.coords(iCell);

            let neighboursCount = 0;
            for (const relPos of relNeightbours) {
                const nPos = add(p, relPos);
                const nIndex = this.atmo.index(nPos);
                if (this.atmo.solidsVector[nIndex] === 0) {
                    matrix[rowOffset + nIndex] = 1;
                    neighboursCount++;
                }
            }
            matrix[rowOffset + iCell] = -neighboursCount;
        }
        return matrix.filter(
            (_, ind) =>
                this.atmo.solidsVector[
                    Math.floor(ind / this.atmo.vectorSize)
                ] === 0 &&
                this.atmo.solidsVector[ind % this.atmo.vectorSize] === 0
        );
    }

    private traceBackParticleVelocity(p: Point, deltaTime: number): Point {
        const v = this.atmo.interpolateVelocity(p);
        const lastKnownP: Point = add(p, multiply(v, -0.5 * deltaTime));
        const avVelocity = this.atmo.interpolateVelocity(lastKnownP);

        const particlePos = add(p, multiply(avVelocity, -deltaTime));
        return this.atmo.interpolateVelocity(particlePos);
    }
}
