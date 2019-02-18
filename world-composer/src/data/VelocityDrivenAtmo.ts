import { Atmosphere, AtmosphereNode } from './Atmosphere';
import {
    Point,
    Vector,
    interpolate,
    multiply,
    add,
    round,
} from '../utils/Math';

enum VectorComponent {
    x = 0,
    y = 1,
}

const relNeightbours: Vector[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export class VelocityDrivenAtmo {
    public atmo: Atmosphere;

    private neightboursMatrix: Int8Array;

    public constructor(atmo: Atmosphere) {
        this.atmo = atmo;
        this.neightboursMatrix = this.precalcNeightboursMatrix();
    }

    public evolve(deltaTime: number) {
        this.convectVelocity(deltaTime);
        this.applyPressure(deltaTime);
    }

    private applyPressure(deltaTime: number) {
        // todo
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
        return new Int8Array(this.atmo.dim2d ** 2).map((_, ind) => {
            const p = this.atmo.coords(ind);
            return relNeightbours.reduce((accCount, relPos) => {
                return accCount + (this.atmo.contains(add(p, relPos)) ? 1 : 0);
            }, 0);
        });
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
