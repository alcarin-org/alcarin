import { Vector } from './Math';
import { Atmosphere } from '../data/Atmosphere';

export function atmoFromVelocityArray(velArray: Vector[]) {
    const radius = Math.floor(Math.sqrt(velArray.length) / 2) + 1;
    const atmo = new Atmosphere(radius);
    for (let i = 0; i < atmo.vectorSize; i++) {
        atmo.velX[i] = velArray[i][0];
        atmo.velY[i] = velArray[i][1];
    }
    return atmo;
}

export function atmoFromPressureArray(pressureArray: number[]) {
    const radius = Math.floor(Math.sqrt(pressureArray.length) / 2) + 1;
    const atmo = new Atmosphere(radius);
    for (let i = 0; i < atmo.vectorSize; i++) {
        atmo.pressureVector[i] = pressureArray[i];
    }
    return atmo;
}
