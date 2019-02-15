import React from 'react';
import math from 'mathjs';

import { Atmosphere } from '../data/Atmosphere';
import { Vector } from '../utils/Math';

interface Props {
    atmosphere: Atmosphere;
}

export default function Stats({ atmosphere }: Props) {
    const length = atmosphere.fluidFieldsCount;
    let pressure = 0;
    let totalVelocity: Vector = [0, 0];
    atmosphere.forEach(node => {
        totalVelocity = math.add(totalVelocity, node.velocity) as Vector;
        pressure += node.pressure;
    });
    const avPressure = pressure / length;
    const avVelocity = math.divide(totalVelocity, length) as Vector;
    return (
        <div className="stats">
            <dl>
                <dt>Av. Velocity</dt>
                <dd>
                    ({avVelocity[0].toFixed(3)}, {avVelocity[1].toFixed(3)})
                </dd>
                <dt>Av. Pressure</dt>
                <dd>{pressure.toFixed(3)}</dd>
            </dl>
        </div>
    );
}
