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

export class VelocityDrivenAtmo {
    public atmo: Atmosphere;

    // private neightboursMatrix: Int8Array;

    public constructor(atmo: Atmosphere) {
        this.atmo = atmo;
        // this.precalcVelocityFromPressure();

        // this.neightboursMatrix = new Int8Array(atmo.dim2d ** 2).map(
        //     (_, ind) => this.getNeightboursCoords(this.atmo.coords(ind)).length
        // );
        // console.log('t', this.neightboursMatrix);
    }

    public evolve(deltaTime: number) {
        this.convectVelocity(deltaTime);
    }

    private traceBackParticleVelocity(p: Point, deltaTime: number): Point {
        const v = this.atmo.interpolateVelocity(p);
        const lastKnownP: Point = [
            p[0] - 0.5 * deltaTime * v[0],
            p[1] - 0.5 * deltaTime * v[1],
        ];

        const avVelocity = this.atmo.interpolateVelocity(lastKnownP);
        const particlePos = add(p, multiply(avVelocity, deltaTime));
        return this.atmo.interpolateVelocity(particlePos);
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
}
