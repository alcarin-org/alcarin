import { AtmosphereEngine } from './AtmosphereEngine';
import {
    createRandomParticles,
    concatParticles,
    Particles,
    convectParticle,
} from '../../data/convectable/Particles';

export class ParticlesEngine {
    public particles: Particles;

    private engine: AtmosphereEngine;

    public constructor(
        engine: AtmosphereEngine,
        particles = createRandomParticles(0, engine.grid)
    ) {
        this.engine = engine;
        this.particles = particles;
    }

    public spawnParticles(count: number) {
        this.particles = concatParticles(
            this.particles,
            createRandomParticles(count, this.engine.grid)
        );
    }

    public update(deltaTime: DOMHighResTimeStamp) {
        const positions = this.particles.positions;
        for (let i = 0; i < positions.length / 2; i++) {
            const i2 = i * 2;

            const pos = positions.slice(i2, i2 + 2);
            const newPos = this.engine.convectValue(
                deltaTime,
                [pos[0], pos[1]],
                lastPos =>
                    convectParticle(lastPos, this.particles, this.engine.grid)
            );
            positions.set(newPos, i2);
        }
        this.particles = {
            ...this.particles,
        };
    }
}
