import * as MACGrid from './MACGrid';

import { Vector } from '../../utils/Math';
import {
    atmoFromVelocityArray,
    // atmoFromPressureArray,
} from '../../utils/SpecHelpers';

const V0: Vector = [0, 0];

test('Should properly calculate divergence of entire field', () => {
    // prettier-ignore
    const atmo = atmoFromVelocityArray([
        V0,     V0,     V0,     V0, V0,
        V0,     [1, 1], [2, 1], V0, V0,
        V0,     [1, 1], [2, 2], V0, V0,
        [0, 1], [-1, 0],     V0,     V0, V0,
        V0,     [0, -1],     V0,     V0, [4, 1],
    ]);

    const divergenceVector = Array.from(MACGrid.divergenceVector(atmo));
    // prettier-ignore
    expect(divergenceVector).toEqual([
        0, 0,  0,  0, 0, 0, 0,
        0, 0,  1,  1, 0, 0, 0,
        0, 1,  1, -1, 0, 0, 0,
        0, 2,  0, -4, 0, 0, 0,
        0, -2, 0,  0, 0, 1, 0,
        0, 0,  1,  0, 4, -5,0,
        0, 0,  0,  0, 0, 0, 0,
    ]);
});

test('Should properly interpolate velocity on given point for empty velocity field', () => {
    const atmo = MACGrid.create(4);

    expect(MACGrid.interpolateVelocity(atmo, [3, 3])).toEqual([0, 0]);
    expect(MACGrid.interpolateVelocity(atmo, [0, 1])).toEqual([0, 0]);
});

test('Should properly interpolate velocity on given point', () => {
    // prettier-ignore
    const atmo = atmoFromVelocityArray([
        [1, 0], [5, 0], V0,     V0, V0,
        V0,     [1, 1], [2, 1], V0, V0,
        V0,     [1, 1], [2, 2], V0, V0,
        V0,     V0,     V0,     V0, V0,
        V0,     V0,     V0,     V0, [4, 1],
    ]);
    expect(MACGrid.interpolateVelocity(atmo, [1, 1])).toEqual([3, 0]);
    expect(MACGrid.interpolateVelocity(atmo, [3, 3])).toEqual([1, 1]);
    expect(MACGrid.interpolateVelocity(atmo, [2.5, 2.5])).toEqual([2, 1.5]);

    expect(MACGrid.interpolateVelocity(atmo, [3.5, 3.5])).toEqual([0, 0]);
    // decreasing slower, as we move only on X
    expect(MACGrid.interpolateVelocity(atmo, [3.5, 3])).toEqual([0, 0.5]);
    // border velocities should be ignored, as fluid can not have speed
    // on border
    expect(MACGrid.interpolateVelocity(atmo, [5, 5])).toEqual([2, 0.5]);
});

// test('Should properly interpolate pressure on given point', () => {
//     // prettier-ignore
//     const atmo = atmoFromPressureArray([
//         1, 0, 0, 0, 0,
//         0, 1, 2, 0, 0,
//         0, 1, 2, 0, 0,
//         0, 0, 0, 0, 0,
//         0, 0, 0, 0, 4,
//     ]);
//     expect(MACGrid.interpolatePressure(atmo, [3, 3])).toEqual(2);
//     expect(MACGrid.interpolatePressure(atmo, [2.5, 2.5])).toEqual(1.5);

//     expect(MACGrid.interpolatePressure(atmo, [3.5, 3.5])).toEqual(0.5);
//     expect(MACGrid.interpolatePressure(atmo, [3.5, 3])).toEqual(1);

//     expect(MACGrid.interpolatePressure(atmo, [1, 1])).toEqual(1);
//     expect(MACGrid.interpolatePressure(atmo, [5, 5])).toEqual(4);
//     expect(MACGrid.interpolatePressure(atmo, [5.5, 5])).toEqual(4);
//     expect(MACGrid.interpolatePressure(atmo, [0.5, 0.5])).toEqual(1);
// });

// test('Should properly check if points are inside map', () => {
//     // prettier-ignore
//     const atmo = atmoFromPressureArray([
//         1, 0, 0, 0, 0,
//         0, 1, 2, 0, 0,
//         0, 1, 2, 0, 0,
//         0, 0, 0, 0, 0,
//         0, 0, 0, 0, 4,
//     ]);
//     expect(atmo.contains([0, 0])).toBe(true);
//     expect(atmo.contains([0, 1])).toBe(true);
//     expect(atmo.contains([0, 4])).toBe(true);
//     expect(atmo.contains([1, 0])).toBe(true);
//     expect(atmo.contains([4, 0])).toBe(true);
//     expect(atmo.contains([5, 0])).toBe(false);
//     expect(atmo.contains([3, 5])).toBe(false);
//     expect(atmo.contains([5, 5])).toBe(false);
//     expect(atmo.contains([4, 4])).toBe(true);
//     expect(atmo.contains([-0.4, 0])).toBe(true);
//     expect(atmo.contains([4.4, 0])).toBe(true);
// });

test('Should create wall around map', () => {
    // prettier-ignore
    const atmo = atmoFromVelocityArray([
        V0, V0, V0,
        V0, V0, V0,
        V0, V0, V0,
    ]);
    // prettier-ignore
    expect(Array.from(atmo.solids)).toEqual([
        1, 1, 1, 1, 1,
        1, 0, 0, 0, 1,
        1, 0, 0, 0, 1,
        1, 0, 0, 0, 1,
        1, 1, 1, 1, 1
    ]);
});
