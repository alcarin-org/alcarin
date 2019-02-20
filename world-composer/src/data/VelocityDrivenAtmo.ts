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
} from '../utils/Math';

enum VectorComponent {
    x = 0,
    y = 1,
}

const relNeightbours: Vector[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export class VelocityDrivenAtmo {
    public readonly atmo: Atmosphere;

    public readonly neightboursMatrix: Int8Array;

    public constructor(atmo: Atmosphere) {
        this.atmo = atmo;
        this.neightboursMatrix = this.precalcNeightboursMatrix();
        this.atmo.pressureVector = this.calculatePressure(1);
    }

    public evolve(deltaTime: number) {
        this.convectVelocity(deltaTime);
        this.atmo.pressureVector = this.calculatePressure(deltaTime);
        this.adjustVelocityFromPressure(deltaTime);
    }

    public divergenceVector(deltaTime: number) {
        // todo: consider delta time
        return this.atmo.divergenceVector();
    }

    public calculatePressure(deltaTime: number) {
        const neighboursMatrixA = this.neightboursMatrix;
        const divergenceVectorB = this.divergenceVector(deltaTime);
        return resolveLinearByJacobi(
            neighboursMatrixA,
            divergenceVectorB,
            this.atmo.pressureVector
        );
    }

    public adjustVelocityFromPressure(deltaTime: number) {
        this.atmo.velX = this.atmo.velX.map((vel, ind) => {
            const posPressure = this.atmo.pressureVector[ind];
            const onLeftBorder = ind % this.atmo.size === 0;
            const pressureGradientX = onLeftBorder
                ? 0
                : posPressure - this.atmo.pressureVector[ind - 1];
            return vel - deltaTime * pressureGradientX;
        });
        this.atmo.velY = this.atmo.velY.map((vel, ind) => {
            const posPressure = this.atmo.pressureVector[ind];
            const onTopBorder = Math.floor(ind / this.atmo.size) === 0;
            const pressureGradientY = onTopBorder
                ? 0
                : posPressure - this.atmo.pressureVector[ind - this.atmo.size];
            return vel - deltaTime * pressureGradientY;
        });
    }

    private convectVelocity(deltaTime: number) {
        const newVelX = this.atmo.velX.map((_, ind) => {
            const p = this.atmo.coords(ind);
            return this.traceBackParticleVelocity(
                [p[0] - 0.5, p[1]],
                deltaTime
            )[0];
        });
        const newVelY = this.atmo.velX.map((_, ind) => {
            const p = this.atmo.coords(ind);
            return this.traceBackParticleVelocity(
                [p[0], p[1] - 0.5],
                deltaTime
            )[1];
        });
        this.atmo.velX = newVelX;
        this.atmo.velY = newVelY;
    }

    private precalcNeightboursMatrix() {
        const matrix = new Int8Array(this.atmo.vectorSize ** 2);

        for (let iCell = 0; iCell < this.atmo.vectorSize; iCell++) {
            const offset = iCell * this.atmo.vectorSize;
            const p = this.atmo.coords(iCell);
            let nCount = 0;
            for (const relPos of relNeightbours) {
                const nPos = add(p, relPos);
                if (this.atmo.contains(nPos)) {
                    const nIndex = this.atmo.index(nPos);
                    matrix[offset + nIndex] = 1;
                    nCount++;
                }
            }
            matrix[offset + iCell] = -nCount;
        }
        return matrix;
    }

    private traceBackParticleVelocity(p: Point, deltaTime: number): Point {
        const v = this.atmo.interpolateVelocity(p);
        const lastKnownP: Point = [
            p[0] - 0.5 * deltaTime * v[0],
            p[1] - 0.5 * deltaTime * v[1],
        ];
        const avVelocity = this.atmo.interpolateVelocity(lastKnownP);

        const particlePos = add(p, multiply(avVelocity, -deltaTime));
        return this.atmo.interpolateVelocity(particlePos);
    }
}
