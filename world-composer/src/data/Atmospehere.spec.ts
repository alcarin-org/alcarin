import { Atmosphere } from './Atmosphere';

import { Vector } from '../utils/Math';
import { atmoFromVelocityArray, atmoFromPressureArray } from '../utils/SpecHelpers';

const V0: Vector = [0, 0];

test('Should properly calculate divergence of entire field', () => {
    // prettier-ignore
    const atmo = atmoFromVelocityArray([
        V0,     V0,     V0,     V0, V0,
        V0,     [1, 1], [2, 1], V0, V0,
        V0,     [1, 1], [2, 2], V0, V0,
        [-1, 0],[-1, 0],     V0,     V0, V0,
        V0,     [0, -1],     V0,     V0, [4, 1],
    ]);

    const divergenceVector = Array.from(atmo.divergenceVector());
    // prettier-ignore
    expect(divergenceVector).toEqual([
        0,  1,  1, 0, 0,
        1,  1, -1, 0, 0,
        1,  0, -4, 0, 0,
        -1, 0,  0, 0, 1,
        0,  1,  0, 4, -5,
    ]);
});

test('Should properly interpolate velocity on given point for empty velocity field', () => {
    const atmo = new Atmosphere(4);

    expect(atmo.interpolateVelocity([0.1, 0.1])).toEqual([0, 0]);
    expect(atmo.interpolateVelocity([-2, -1.1])).toEqual([0, 0]);
});

test('Should properly interpolate velocity on given point', () => {
    // prettier-ignore
    const atmo = atmoFromVelocityArray([
        [1, 0], V0,     V0,     V0, V0    ,
        V0, [1, 1], [2, 1], V0, V0    ,
        V0, [1, 1], [2, 2], V0, V0    ,
        V0, V0,     V0,     V0, V0    ,
        V0, V0,     V0,     V0, [4, 1],
    ]);
    expect(atmo.interpolateVelocity([0, 0])).toEqual([2, 1.5]);
    expect(atmo.interpolateVelocity([-0.5, -0.5])).toEqual([1.5, 1]);

    expect(atmo.interpolateVelocity([0.5, 0.5])).toEqual([1, 1]);
    // decreasing slower, as we move only on X
    expect(atmo.interpolateVelocity([0.5, 0])).toEqual([1, 2]);
    // border velocities should be ignored, as fluid can not have speed
    // on border
    expect(atmo.interpolateVelocity([2, 2])).toEqual([2, 0.5]);
    expect(atmo.interpolateVelocity([-2, -2])).toEqual([0, 0]);
    expect(atmo.interpolateVelocity([3, 3])).toEqual([0, 0]);
});

test.only('Should properly interpolate pressure on given point', () => {
    // prettier-ignore
    const atmo = atmoFromPressureArray([
        1, 0, 0, 0, 0,
        0, 1, 2, 0, 0,
        0, 1, 2, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 4,
    ]);
    expect(atmo.interpolatePressure([0, 0])).toEqual(2);
    expect(atmo.interpolatePressure([-0.5, -0.5])).toEqual(1.5);

    expect(atmo.interpolatePressure([0.5, 0.5])).toEqual(0.5);
    expect(atmo.interpolatePressure([0.5, 0])).toEqual(1);

    expect(atmo.interpolatePressure([-2, -2])).toEqual(1);
    expect(atmo.interpolatePressure([2, 2])).toEqual(4);
    expect(atmo.interpolatePressure([2.5, 2])).toEqual(4);
    expect(atmo.interpolatePressure([-2.5, -2])).toEqual(1);
});
