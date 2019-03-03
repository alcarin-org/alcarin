import { Atmosphere } from '../Atmosphere';
import { Point } from '../../utils/Math';

/**
 * "convecting" is the movement caused within a fluid by the fluid field. it
 * can e.g. move particles, transport/diffuse cheat etc.
 */

// function for specific convectable value that for given value and position
// (point where the particle was in last step) return new value for this value
export type ConvectValue<T, U> = (
    lastPos: Point,
    valuesBundle: U,
    atmo: Atmosphere
) => T;
