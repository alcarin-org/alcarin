import { Vector } from './Math';
import { create, index } from '../data/atmosphere/MACGrid';

export function atmoFromVelocityArray(velArray: Vector[]) {
    const radius = Math.floor(Math.sqrt(velArray.length) / 2) + 1;
    const atmo = create(radius);
    for (let i = 1; i < atmo.size - 1; i++) {
        for (let j = 1; j < atmo.size - 1; j++) {
            const sampleInd = (j - 1) * (atmo.size - 2) + i - 1;
            const atmoInd = index(atmo, [i, j]);
            atmo.field.velX[atmoInd] = velArray[sampleInd][0];
            atmo.field.velY[atmoInd] = velArray[sampleInd][1];
        }
    }
    return atmo;
}

export function atmoFromPressureArray(pressureArray: number[]) {
    const radius = Math.floor(Math.sqrt(pressureArray.length) / 2) + 1;
    const atmo = create(radius);
    for (let i = 1; i < atmo.size - 1; i++) {
        for (let j = 1; j < atmo.size - 1; j++) {
            const sampleInd = (j - 1) * (atmo.size - 2) + i - 1;
            // atmo.pressureVector[index(atmo, [i, j])] = pressureArray[sampleInd];
        }
    }
    return atmo;
}
