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
    spawnParticles: (count: number) => void;
}

const KEY_SPACE = 32;

export const Page = connectContext(PageComponent, ({ state, actions }) => ({
    resetMap: actions.resetMap,
    randomizeVelocityField: actions.randomizeVelocityField,
    spawnParticles: actions.spawnParticles,
}));

function PageComponent({
    resetMap,
    randomizeVelocityField,
    spawnParticles,
}: Props) {
    const [showControlPanel, setShowControlPanel] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const onTogglePlay = useCallback(() => {
        setIsPlaying(isPlaying => {
            // side effect
            isPlaying ? GlobalTimer.stop() : GlobalTimer.start();
            return !isPlaying;
        });
    }, []);

    useEffect(() => {
        function onKeyDown(ev: KeyboardEvent) {
            if (ev.ctrlKey && ev.keyCode === KEY_SPACE) {
                onTogglePlay();
                ev.stopPropagation();
                ev.preventDefault();
            }
        }
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, []);

    return (
        <div className="page">
            <div className="page__toolbar">
                <MainToolbar
                    onRandomizeVelocity={randomizeVelocityField}
                    controlPanelVisible={showControlPanel}
                    onTogglePlay={onTogglePlay}
                    isPlaying={isPlaying}
                    onToggleControlPanel={newState =>
                        setShowControlPanel(newState)
                    }
                    onSpawnParticles={() => spawnParticles(5000)}
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
