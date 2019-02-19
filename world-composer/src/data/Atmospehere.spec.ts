import { Atmosphere } from './Atmosphere';

import { Vector } from '../utils/Math';
import { atmoFromVelocityArray } from '../utils/SpecHelpers';

const V0: Vector = [0, 0];

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
        [V0, [1, 1], [2, 2], V0, V0    ],
        [V0, V0,     V0,     V0, V0    ],
        [V0, V0,     V0,     V0, [4, 1]],
    ]);
    expect(atmo.interpolateVelocity([0, 0])).toEqual([2, 1.5]);
    expect(atmo.interpolateVelocity([-0.5, -0.5])).toEqual([1.5, 1]);

    expect(atmo.interpolateVelocity([0.5, 0.5])).toEqual([1, 1]);
    // decreasing slower, as we move only on X
    expect(atmo.interpolateVelocity([0.5, 0])).toEqual([1, 2]);
    // do not interpolate on borders
    expect(atmo.interpolateVelocity([2.5, 2.5])).toEqual([4, 1]);
    expect(atmo.interpolateVelocity([2.9, 2.9])).toEqual([4, 1]);
});
