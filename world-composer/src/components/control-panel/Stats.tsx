import './Stats.scss';

import React, { useEffect, useState } from 'react';

import * as MACGrid from '../../data/atmosphere/MACGrid';
import { Vector, magnitude, add, multiply } from '../../utils/Math';
import { connectContext } from '../../context/SimulationContext';
import { statsEngineFactory, create } from '../../data/engine/StatsEngine';
// import Particles from '../../data/engine/Particles';
import GlobalTimer from '../../utils/Timer';

interface Props {
    grid: MACGrid.MACGridData;
    particlesCount: number;
}

const updateStats = statsEngineFactory();

export const Stats = connectContext(StatsComponent, ({ state }) => ({
    grid: state.simulation.grid,
    particlesCount: state.simulation.particles.count,
}));

// This component waiting for refactor
function StatsComponent({ grid, particlesCount }: Props) {
    const [statsData, setStatsData] = useState(create);

    useEffect(
        () => {
            return GlobalTimer.onTick(deltaTimeSec => {
                const newStats = updateStats(statsData, deltaTimeSec);
                if (newStats !== statsData) {
                    setStatsData(newStats);
                }
            });
        },
        [statsData]
    );

    const divVector = MACGrid.divergenceVector(grid);
    const length = grid.size ** 2;
    const pressure = 0;
    let totalVelocity: Vector = [0, 0];
    let totalDivergence = 0;
    for (let i = 0; i < grid.size ** 2; i++) {
        totalVelocity = add(totalVelocity, [
            grid.field.velX[i],
            grid.field.velY[i],
        ]);
        // pressure += grid.pressureVector[i];
        totalDivergence += divVector[i];
    }
    const avPressure = pressure / length;
    const avDivergence = totalDivergence / length;
    const avVelocity = multiply(totalVelocity, 1 / length);

    // const mouseOverCell = round(mouseOver);
    // const selectedInd = MACGrid.index(grid, mouseOverCell);
    // const isSolid = grid.solids[selectedInd] === 1;
    // const clickedInterpolatedVel = isSolid
    //     ? [0, 0]
    //     : MACGrid.interpolateVelocity(grid, mouseOver);
    // const clickedDivergence = divVector[selectedInd];
    // const ind = MACGrid.index(grid, mouseOverCell);

    // const selectedNodePressure = grid.pressureVector[ind];
    // const clickedInterpolatedPress = isSolid
    //     ? NaN
    //     : MACGrid.interpolatePressure(grid, mouseOver);
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
                <dd>{avDivergence.toFixed(3)}</dd>
                <dt>Render FPS</dt>
                <dd>{statsData.fps}</dd>
                <dt>Particles</dt>
                <dd>{particlesCount}</dd>
            </dl>
        </div>
    );
}

// <dt>Selected</dt>
// <dd>
//     ({mouseOver[0].toFixed(3)}, {mouseOver[1].toFixed(3)}) ~(
//     {mouseOverCell[0]}, {mouseOverCell[1]})
// </dd>
// <dt>Selected velocity</dt>
// <dd>
//     ({grid.field.velX[selectedInd].toFixed(3)},
//     {grid.field.velY[selectedInd].toFixed(3)})
// </dd>

// <dt>Clicked interp. velocity</dt>
// <dd>
//     ({clickedInterpolatedVel[0].toFixed(3)},
//     {clickedInterpolatedVel[1].toFixed(3)})
// </dd>
// <dt>Clicked divergence</dt>
// <dd>{clickedDivergence.toFixed(3)}</dd>
// <dt>Selected pressure</dt>
// <dd>{selectedNodePressure.toFixed(3)}</dd>

// <dt>Clicked interp. pressure:</dt>
// <dd>{clickedInterpolatedPress.toFixed(3)}</dd>
