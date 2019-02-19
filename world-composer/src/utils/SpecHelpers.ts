import { Vector } from './Math';
import { Atmosphere } from '../data/Atmosphere';

export function atmoFromVelocityArray(velArray: Vector[][]) {
    const radius = (velArray.length + 1) / 2;
    const atmo = new Atmosphere(radius);
    atmo.apply((node, p) => ({
        ...node,
        velocity: velArray[p[1] + radius - 1][p[0] + radius - 1],
    }));
    return atmo;
}
