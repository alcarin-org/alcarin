import './Page.scss';

import React, { useState, useContext, useCallback, useEffect } from 'react';

import SimulationContext, {
    SimulationContextType,
    createSimulationContext,
} from '../context/SimulationContext';
import { useInteractionContext } from '../context/InteractionContext';
import * as RandomizeField from '../data/atmosphere/RandomizeField';
import { InteractiveMap } from './map/InteractiveMap';
import { ControlPanel } from './control-panel/ControlPanel';
import { MainToolbar } from './MainToolbar';

interface Props {
    onContextRecreated: (context: SimulationContextType) => void;
}

const KEY_SPACE = 32;

export function Page({ onContextRecreated }: Props) {
    const simulationContext = useContext(SimulationContext)!;

    const {
        state: { settings: mapSettings },
    } = useInteractionContext();

    const [showControlPanel, setShowControlPanel] = useState(true);
    const [play, setPlay] = useState(true);

    const onTogglePlay = useCallback(() => setPlay(val => !val), []);

    const onRenderTick = useCallback(
        (deltaTime: DOMHighResTimeStamp) => {
            if (!play) {
                return;
            }
            const deltaTimeSec = deltaTime / 1000;
            simulationContext.particles.update(deltaTimeSec);
            simulationContext.engine.update(deltaTimeSec);
        },
        [simulationContext, mapSettings, play]
    );

    useEffect(() => {
        function onKeyPress(ev: KeyboardEvent) {
            if (ev.keyCode === KEY_SPACE) {
                onTogglePlay();
            }
        }
        window.addEventListener('keyup', onKeyPress, true);
        return window.removeEventListener('keyup', onKeyPress);
    }, []);

    function randomizeMap() {
        const randomMethods = [
            RandomizeField.Chaotic,
            RandomizeField.GlobalCurl,
            RandomizeField.LeftWave,
            RandomizeField.RightWave,
        ];
        const method =
            randomMethods[Math.floor(Math.random() * randomMethods.length)];

        const newSimulationContext = createSimulationContext(
            method,
            simulationContext
        );
        onContextRecreated(newSimulationContext);
    }

    function resetMap() {
        const newSimulationContext = createSimulationContext();
        onContextRecreated(newSimulationContext);
    }

    return (
        <div className="page">
            <div className="page__toolbar">
                <MainToolbar
                    onRandomizeVelocity={randomizeMap}
                    controlPanelVisible={showControlPanel}
                    onTogglePlay={onTogglePlay}
                    isPlaying={play}
                    onToggleControlPanel={newState =>
                        setShowControlPanel(newState)
                    }
                    onSpawnParticles={() =>
                        simulationContext.particles.spawnParticles(5000)
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
                    <InteractiveMap onTick={onRenderTick} />
                </div>
            </div>
        </div>
    );
}
