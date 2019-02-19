import { Atmosphere, AtmosphereNode } from './Atmosphere';
import {
    Point,
    Vector,
    interpolate,
    multiply,
    add,
    round,
    resolveLinearByJacobi,
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
    }

    public evolve(deltaTime: number) {
        this.convectVelocity(deltaTime);
        this.calculatePressure(deltaTime);
        this.adjustVelocityFromPressure(deltaTime);
    }

    public divergenceVector(deltaTime: number) {
        return new Float64Array(this.atmo.dim2d ** 2).map((_, ind) => {
            const p = this.atmo.coords(ind);
            return this.atmo.divergence(p) / deltaTime;
        });
    }

    public calculatePressure(deltaTime: number) {
        const neighboursMatrixA = this.neightboursMatrix;
        const divergenceVectorB = this.divergenceVector(deltaTime);
        this.atmo.pressureVector = resolveLinearByJacobi(
            neighboursMatrixA,
            divergenceVectorB
        );
    }

    public adjustVelocityFromPressure(deltaTime: number) {
        this.atmo.forEach((node, pos) => {
            const posPressure = this.atmo.pressureVector[this.atmo.index(pos)];
            const lastXCell: Point = [pos[0] - 1, pos[0]];
            const pressureGradientX = this.atmo.contains(lastXCell)
                ? posPressure -
                  this.atmo.pressureVector[this.atmo.index(lastXCell)]
                : 0;

            const lastYCell: Point = [pos[0], pos[0] - 1];
            const pressureGradientY = this.atmo.contains(lastYCell)
                ? posPressure -
                  this.atmo.pressureVector[this.atmo.index(lastYCell)]
                : 0;

            node.newVelocity = [
                node.velocity[0] - deltaTime * pressureGradientX,
                node.velocity[1] - deltaTime * pressureGradientY,
            ];
        });

        this.atmo.forEach((node, pos) => {
            node.velocity = node.newVelocity;
        });
    }

    private convectVelocity(deltaTime: number) {
        this.atmo.forEach((node, p) => {
            const xTracedParticleVelocity = this.traceBackParticleVelocity(
                [p[0], p[1] + 0.5],
                deltaTime
            );
            const yTracedParticleVelocity = this.traceBackParticleVelocity(
                [p[0] + 0.5, p[1]],
                deltaTime
            );
            node.newVelocity = [
                xTracedParticleVelocity[0],
                yTracedParticleVelocity[1],
            ];
        });

        this.atmo.forEach(node => (node.velocity = node.newVelocity));
    }

    private precalcNeightboursMatrix() {
        const matrix = new Int8Array(this.atmo.dim2d ** 4);

        for (let iCell = 0; iCell < this.atmo.size; iCell++) {
            const offset = iCell * this.atmo.size;
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
