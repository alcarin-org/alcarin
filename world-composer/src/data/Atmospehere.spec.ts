import { Atmosphere } from './Atmosphere';

import { Vector } from '../utils/Math';

const V0: Vector = [0, 0];

const atmoFromVelocityArray = (velArray: Vector[][]) => {
    const radius = (velArray.length + 1) / 2;
    const atmo = new Atmosphere(radius);
    atmo.apply((node, p) => ({
        ...node,
        velocity: velArray[p[1] + radius - 1][p[0] + radius - 1],
    }));
    return atmo;
};

test('Should properly interpolate velocity on given point for empty velocity field', () => {
    const atmo = new Atmosphere(4);

    expect(atmo.interpolateVelocity([0.1, 0.1])).toEqual([0, 0]);
    expect(atmo.interpolateVelocity([-2, -1.1])).toEqual([0, 0]);
});

test.only('Should properly interpolate velocity on given point', () => {
    // prettier-ignore
    const atmo = atmoFromVelocityArray([
        [V0, V0,     V0,     V0, V0    ],
        [V0, [1, 1], [2, 1], V0, V0    ],
        [V0, [1, 2], [2, 2], V0, V0    ],
        [V0, V0,     V0,     V0, V0    ],
        [V0, V0,     V0,     V0, [4, 1]],
    ]);
    expect(atmo.interpolateVelocity([-0.5, -0.5])).toEqual([1.5, 1.5]);
    // on exact points interpolation should have same value like real vector
    expect(atmo.interpolateVelocity([0, 0])).toEqual([2, 2]);
    // decreasing fast, as all 3 neightbours (but 0,0), are 0 vector
    expect(atmo.interpolateVelocity([0.5, 0.5])).toEqual([0.5, 0.5]);
    // decreasing slower, as we move only on X
    expect(atmo.interpolateVelocity([0.5, 0])).toEqual([1, 1]);
    // do not interpolate on borders
    expect(atmo.interpolateVelocity([2.5, 2.5])).toEqual([4, 1]);
});
