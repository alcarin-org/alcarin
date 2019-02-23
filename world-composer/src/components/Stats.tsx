import './Stats.scss';

import React from 'react';

import { Atmosphere } from '../data/Atmosphere';
// import { divergence } from '../data/AtmoMotion';
import { Vector, Point, magnitude, add, multiply, round } from '../utils/Math';

interface Props {
    atmosphere: Atmosphere;
    mouseOver: Point;
    fps: number;
}

export default function Stats({ atmosphere, mouseOver, fps }: Props) {
    const divVector = atmosphere.divergenceVector();
    const length = atmosphere.size ** 2;
    let pressure = 0;
    let totalVelocity: Vector = [0, 0];
    let totalDivergence = 0;
    for (let i = 0; i < atmosphere.vectorSize; i++) {
        totalVelocity = add(totalVelocity, [
            atmosphere.velX[i],
            atmosphere.velY[i],
        ]);
        pressure += atmosphere.pressureVector[i];
        totalDivergence += divVector[i];
    }
    const avPressure = pressure / length;
    const avDivergence = totalDivergence / length;
    const avVelocity = multiply(totalVelocity, 1 / length);

    const mouseOverCell = round(mouseOver);
    const selectedInd = atmosphere.index(mouseOverCell);
    const isSolid = atmosphere.solidsVector[selectedInd] === 1;
    const clickedInterpolatedVel = isSolid
        ? [0, 0]
        : atmosphere.interpolateVelocity(mouseOver);
    const clickedDivergence = divVector[selectedInd];
    const ind = atmosphere.index(mouseOverCell);

    const selectedNodePressure = atmosphere.pressureVector[ind];
    const clickedInterpolatedPress = isSolid
        ? NaN
        : atmosphere.interpolatePressure(mouseOver);
    return (
        <div className="stats">
            <dl>
                <dt>Av. Velocity</dt>
                <dd>
                    ({avVelocity[0].toFixed(3)}, {avVelocity[1].toFixed(3)}) [
                    {magnitude(avVelocity).toFixed(3)}]
                </dd>
                <dt>Av. Pressure</dt>
                <dd>{avPressure.toFixed(3)}</dd>
                <dt>Av. Divergence</dt>
                <dd>({avDivergence.toFixed(3)})</dd>
                <dt>Selected</dt>
                <dd>
                    ({mouseOver[0].toFixed(3)}, {mouseOver[1].toFixed(3)}) ~(
                    {mouseOverCell[0]}, {mouseOverCell[1]})
                </dd>
                <dt>Selected velocity</dt>
                <dd>
                    ({atmosphere.velX[selectedInd].toFixed(3)},
                    {atmosphere.velY[selectedInd].toFixed(3)})
                </dd>
                <dt>Selected pressure:</dt>
                <dd>{selectedNodePressure.toFixed(3)}</dd>

                <dt>Clicked interp. pressure:</dt>
                <dd>{clickedInterpolatedPress.toFixed(3)}</dd>
                <dt>Clicked interp. velocity:</dt>
                <dd>
                    ({clickedInterpolatedVel[0].toFixed(3)},
                    {clickedInterpolatedVel[1].toFixed(3)})
                </dd>
                <dt>Clicked divergence:</dt>
                <dd>{clickedDivergence.toFixed(3)}</dd>
                <dt>fps</dt>
                <dd>{fps}</dd>
            </dl>
        </div>
    );
}
