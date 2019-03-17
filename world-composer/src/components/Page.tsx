import './Page.scss';

import React, {
    useState,
    useContext,
    useCallback,
    useEffect,
    useMemo,
} from 'react';

import SimulationContext, {
    SimulationContextType,
    createSimulationContext,
} from '../context/SimulationContext';
import {
    useInteractionContext,
    InteractionContextType,
} from '../context/InteractionContext';
import * as RandomizeField from '../data/atmosphere/RandomizeField';
import { InteractiveMap } from './map/InteractiveMap';
import { ControlPanel } from './control-panel/ControlPanel';
import { MainToolbar } from './MainToolbar';
import GlobalTimer from '../utils/Timer';

interface Props {
    onContextRecreated: (context: SimulationContextType) => void;
}

interface SubProps {
    onContextRecreated: (context: SimulationContextType) => void;
    mapSettings: InteractionContextType['state']['settings'];
}

const KEY_SPACE = 32;

export function Page({ onContextRecreated }: Props) {
    const {
        state: { settings: mapSettings },
    } = useInteractionContext();
    return useMemo(
        () => (
            <PageComponent
                onContextRecreated={onContextRecreated}
                mapSettings={mapSettings}
            />
        ),
        [onContextRecreated, mapSettings]
    );
}

function PageComponent({ onContextRecreated, mapSettings }: SubProps) {
    const simulationContext = useContext(SimulationContext)!;
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

    useEffect(
        () => {
            return GlobalTimer.onTick(onRenderTick);

            function onRenderTick(deltaTimeSec: DOMHighResTimeStamp) {
                simulationContext.particles.update(deltaTimeSec);
                simulationContext.engine.update(deltaTimeSec);
                // simulationContext.stats.update(deltaTimeSec);
            }
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
                    onTogglePlay={onTogglePlay}
                    isPlaying={GlobalTimer.isRunning}
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
                    <InteractiveMap />
                </div>
            </div>
        </div>
    );
}
