import './Stats.scss';

import React, { useEffect, useState } from 'react';

import * as MACGrid from '../../data/atmosphere/MACGrid';
import { magnitude } from '../../utils/Math';
import { connectContext } from '../../context/SimulationContext';
import {
    statsEngineFactory,
    create,
    collect,
} from '../../data/engine/StatsEngine';
import GlobalTimer from '../../utils/Timer';

interface Props {
    grid: MACGrid.MACGridData;
    pressure: Float32Array;
    particlesCount: number;
}

const updateStats = statsEngineFactory();

export const Stats = connectContext(StatsComponent, ({ state }) => ({
    grid: state.simulation.grid,
    particlesCount: state.simulation.particles.count,
    pressure: state.simulation.artifacts.lastPressureVector,
}));

function StatsComponent({ grid, particlesCount, pressure }: Props) {
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

    const stats = collect(statsData, grid, pressure);

    return (
        <div className="stats">
            <dl>
                <dt>Av. Velocity</dt>
                <dd>
                    ({stats.avVelocity[0].toFixed(3)},{' '}
                    {stats.avVelocity[1].toFixed(3)}) [
                    {magnitude(stats.avVelocity).toFixed(3)}]
                </dd>
                <dt>Av. Pressure</dt>
                <dd>{stats.avPressure.toFixed(3)}</dd>
                <dt>Av. Divergence</dt>
                <dd>{stats.avDivergence.toFixed(3)}</dd>
                <dt>Render FPS</dt>
                <dd>{stats.fps}</dd>
                <dt>Particles</dt>
                <dd>{particlesCount}</dd>
            </dl>
        </div>
    );
}
