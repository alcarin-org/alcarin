import './Page.scss';

import React, { useState, useContext, useCallback } from 'react';

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

export function Page({ onContextRecreated }: Props) {
    const simulationContext = useContext(SimulationContext)!;

    const {
        state: { settings: mapSettings },
    } = useInteractionContext();

    const [showControlPanel, setShowControlPanel] = useState(true);

    const onRenderTick = useCallback(
        (deltaTime: DOMHighResTimeStamp) => {
            const deltaTimeSec = deltaTime / 1000;
            simulationContext.particles.update(deltaTimeSec);
            simulationContext.engine.update(deltaTimeSec);
        },
        [simulationContext, mapSettings]
    );

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
