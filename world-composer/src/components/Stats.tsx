import './Stats.scss';

import React from 'react';

import * as MACGrid from '../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../data/engine/ParticlesEngine';
import { Vector, Point, magnitude, add, multiply, round } from '../utils/Math';

interface Props {
    atmosphere: MACGrid.MACGridData;
    atmoDriver: AtmosphereEngine;
    particlesEngine: ParticlesEngine;
    mouseOver: Point;
    fps: number;
}

export default function Stats({
    atmosphere,
    atmoDriver,
    particlesEngine,
    mouseOver,
    fps,
}: Props) {
    const divVector = MACGrid.divergenceVector(atmosphere);
    const length = atmosphere.size ** 2;
    const pressure = 0;
    let totalVelocity: Vector = [0, 0];
    let totalDivergence = 0;
    for (let i = 0; i < atmosphere.size ** 2; i++) {
        totalVelocity = add(totalVelocity, [
            atmosphere.field.velX[i],
            atmosphere.field.velY[i],
        ]);
        // pressure += atmosphere.pressureVector[i];
        totalDivergence += divVector[i];
    }
    const avPressure = pressure / length;
    const avDivergence = totalDivergence / length;
    const avVelocity = multiply(totalVelocity, 1 / length);

    const mouseOverCell = round(mouseOver);
    const selectedInd = MACGrid.index(atmosphere, mouseOverCell);
    const isSolid = atmosphere.solids[selectedInd] === 1;
    const clickedInterpolatedVel = isSolid
        ? [0, 0]
        : MACGrid.interpolateVelocity(atmosphere, mouseOver);
    const clickedDivergence = divVector[selectedInd];
    // const ind = MACGrid.index(atmosphere, mouseOverCell);

    // const selectedNodePressure = atmosphere.pressureVector[ind];
    // const clickedInterpolatedPress = isSolid
    //     ? NaN
    //     : MACGrid.interpolatePressure(atmosphere, mouseOver);
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
                    ({atmosphere.field.velX[selectedInd].toFixed(3)},
                    {atmosphere.field.velY[selectedInd].toFixed(3)})
                </dd>

                <dt>Clicked interp. velocity:</dt>
                <dd>
                    ({clickedInterpolatedVel[0].toFixed(3)},
                    {clickedInterpolatedVel[1].toFixed(3)})
                </dd>
                <dt>Clicked divergence:</dt>
                <dd>{clickedDivergence.toFixed(3)}</dd>
                <dt>fps</dt>
                <dd>{fps}</dd>
                <dt>Particles</dt>
                <dd>{particlesEngine.particles.positions.length / 2}</dd>
            </dl>
        </div>
    );
}

 // <dt>Selected pressure:</dt>
 //                <dd>{selectedNodePressure.toFixed(3)}</dd>

 //                <dt>Clicked interp. pressure:</dt>
 //                <dd>{clickedInterpolatedPress.toFixed(3)}</dd>
