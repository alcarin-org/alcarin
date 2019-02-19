import { Atmosphere } from './Atmosphere';
import { VelocityDrivenAtmo } from './VelocityDrivenAtmo';

import { Vector } from '../utils/Math';
import { atmoFromVelocityArray } from '../utils/SpecHelpers';

const V0: Vector = [0, 0];

// prettier-ignore
const exampleAtmo = () => atmoFromVelocityArray([
    [V0, V0,     V0,     V0, V0    ],
    [V0, [1, 1], [2, 1], V0, V0    ],
    [V0, [1, 1], [2, 2], V0, V0    ],
    [V0, V0,     V0,     V0, V0    ],
    [V0, V0,     V0,     V0, [4, 1]],
]);

// prettier-ignore
const smallAtmo = () => atmoFromVelocityArray([
    [[1, 0], [-1, 0], V0],
    [V0,     V0,      V0],
    [V0,     V0,      V0],
]);

test('Should calculate pressure based on given velocities that effect with 0 divergence', () => {
    const driver = new VelocityDrivenAtmo(smallAtmo());
    const divergenceVector = Array.from(driver.divergenceVector(1));
    driver.calculatePressure(1);
    driver.adjustVelocityFromPressure(1);

    const A = driver.neightboursMatrix;
    const x = driver.atmo.pressureVector;
    for (let i = 0; i < driver.atmo.size; i++) {
        for (let j = 0; j < driver.atmo.size; j++) {
            const result = A.slice(
                i * driver.atmo.size,
                driver.atmo.size
            ).reduce((acc, val, ind) => {
                return acc + val * x[ind];
            }, 0);
            console.log(result, divergenceVector[j]);
        }
    }

    // const divergenceVector = Array.from(driver.divergenceVector(1));
    // // prettier-ignore
    // expect(divergenceVector).toEqual([
    //     0, 0, 0,
    //     0, 0, 0,
    //     0, 0, 0,
    // ]);
});

test('Should properly prepare divergance matrix', () => {
    const driver = new VelocityDrivenAtmo(exampleAtmo());
    const divergenceVector = Array.from(driver.divergenceVector(1));
    // prettier-ignore
    expect(divergenceVector).toEqual([
        0, 1,  1, 0, 0,
        1, 1, -1, 0, 0,
        1, 0, -4, 0, 0,
        0, 0,  0, 0, 1,
        0, 0,  0, 4, 0,
    ]);
});

test('Should properly prepare neigbours matrix', () => {
    const driver = new VelocityDrivenAtmo(smallAtmo());
    // prettier-ignore
    expect(Array.from(driver.neightboursMatrix)).toEqual([
        -2, 1, 0,
        1, 0, 0,
        0, 0, 0,

        1, -3, 1,
        0, 1, 0,
        0, 0, 0,

        0, 1, -2,
        0, 0, 1,
        0, 0, 0,

        1, 0, 0,
        -3, 1, 0,
        1, 0, 0,

        0, 1, 0,
        1, -4, 1,
        0, 1, 0,

        0, 0, 1,
        0, 1, -3,
        0, 0, 1,

        0, 0, 0,
        1, 0, 0,
        -2, 1, 0,

        0, 0, 0,
        0, 1, 0,
        1, -3, 1,

        0, 0, 0,
        0, 0, 1,
        0, 1, -2,
    ]);
});
