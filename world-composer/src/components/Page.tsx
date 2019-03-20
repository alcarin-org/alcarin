import './Page.scss';

import React, { useState, useCallback, useEffect } from 'react';

import { connectContext } from '../context/SimulationContext';
import { InteractiveMap } from './map/InteractiveMap';
import { ControlPanel } from './control-panel/ControlPanel';
import { MainToolbar } from './MainToolbar';
import GlobalTimer from '../utils/Timer';

interface Props {
    resetMap: () => void;
    randomizeVelocityField: () => void;
}

const KEY_SPACE = 32;

export const Page = connectContext(PageComponent, ({ state, actions }) => ({
    resetMap: actions.resetMap,
    randomizeVelocityField: actions.randomizeVelocityField,
}));

function PageComponent({ resetMap, randomizeVelocityField }: Props) {
    const [showControlPanel, setShowControlPanel] = useState(true);
    const onTogglePlay = useCallback(
        () =>
            GlobalTimer.isRunning ? GlobalTimer.stop() : GlobalTimer.start(),
        []
    );

    useEffect(() => {
        function onKeyDown(ev: KeyboardEvent) {
            if (ev.ctrlKey && ev.keyCode === KEY_SPACE) {
                onTogglePlay();
                ev.stopPropagation();
                ev.preventDefault();
            }
        }
        window.addEventListener('keydown', onKeyDown, true);
        // bug
        // return () => window.removeEventListener('keyup', onKeyDown);
    }, []);

    return (
        <div className="page">
            <div className="page__toolbar">
                <MainToolbar
                    onRandomizeVelocity={randomizeVelocityField}
                    controlPanelVisible={showControlPanel}
                    onTogglePlay={onTogglePlay}
                    isPlaying={GlobalTimer.isRunning}
                    onToggleControlPanel={newState =>
                        setShowControlPanel(newState)
                    }
                    onSpawnParticles={
                        () => null
                        // simulationContext.particles.spawnParticles(5000)
                    }
                    onMapReset={resetMap}
                />
            </div>
            <div className="page__content">
                {showControlPanel && (
                    <div className="page__control-panel">
                        <ControlPanel />
                    </div>
                )}
                <div className="page__map">
                    <InteractiveMap />
                </div>
            </div>
        </div>
    );
}
