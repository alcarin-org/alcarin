import React from 'react';
import math from 'mathjs';

import { Atmosphere } from '../data/Atmosphere';
// import { divergence } from '../data/AtmoMotion';
import { Vector, Point } from '../utils/Math';

interface Props {
    atmosphere: Atmosphere;
    mouseOver: Point;
    fps: number;
}

export default function Stats({ atmosphere, mouseOver, fps }: Props) {
    const length = atmosphere.dim2d ** 2;
    let pressure = 0;
    let totalVelocity: Vector = [0, 0];
    // let totalDivergence = 0;
    atmosphere.forEach((node, pos) => {
        totalVelocity = math.add(totalVelocity, node.velocity) as Vector;
        pressure += node.pressure;
        // totalDivergence += divergence(atmosphere, pos);
    });
    const avPressure = pressure / length;
    // const avDivergence = totalDivergence / length;
    const avVelocity = math.divide(totalVelocity, length) as Vector;

    const clickedNode = atmosphere.get(mouseOver);
    return (
        <div className="stats">
            <dl>
                <dt>Av. Velocity</dt>
                <dd>
                    ({avVelocity[0].toFixed(3)}, {avVelocity[1].toFixed(3)}) [
                    {math.norm(avVelocity).toFixed(3)}]
                </dd>
                <dt>Av. Pressure</dt>
                <dd>{avPressure.toFixed(3)}</dd>
                <dt>Clicked velocity:</dt>
                <dd>
                    ({clickedNode.velocity[0].toFixed(3)},
                    {clickedNode.velocity[1].toFixed(3)})
                </dd>
                <dt>Clicked pressure:</dt>
                <dd>{clickedNode.pressure.toFixed(3)}</dd>
                <dt>fps</dt>
                <dd>{fps}</dd>
                <dt>type</dt>
                <dd>{clickedNode.type}</dd>
            </dl>
        </div>
    );
    // <dt>Av. Divergence</dt>
    // <dd>({avDivergence.toFixed(3)})</dd>
    // <dt>Clicked divergence:</dt>
    // <dd>{divergence(atmosphere, mouseOver).toFixed(3)}</dd>
}
