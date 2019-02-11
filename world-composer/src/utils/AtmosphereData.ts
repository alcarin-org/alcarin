import { Vector } from './Math';

interface AtmosphereEntry {
    velocity: Vector;
}

export interface Atmosphere {
    // we work only with
    worldRadius: number;
    data: AtmosphereEntry[][];
}
