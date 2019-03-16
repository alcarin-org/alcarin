import './App.scss';

import React, { useEffect, useState, useCallback } from 'react';

import SimulationContext, {
    createSimulationContext,
} from './context/SimulationContext';
import { InteractionContextProvider } from './context/InteractionContext';
import { InteractiveMap, MapSettings } from './map/InteractiveMap';
import { MapType } from './canvas/utils/CanvasUtils';
import * as RandomizeField from '../data/atmosphere/RandomizeField';

import { round, Point } from '../utils/Math';
import { ipcRenderer } from '../electron-bridge';
import { ControlPanel } from './control-panel/ControlPanel';
import { MainToolbar } from './MainToolbar';

export function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);

    const [showControlPanel, setShowControlPanel] = useState(true);
    const [simulationContext, setSimulationContext] = useState(
        createSimulationContext
    );

    const [mapSettings, setMapSettings] = useState<MapSettings>({
        drawFieldSize: 25,
        mapType: MapType.Neutral,
    });

    function onMapTypeChange(mapType: MapType) {
        setMapSettings({ ...mapSettings, mapType });
    }

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
        setSimulationContext(newSimulationContext);
    }

    function resetMap() {
        const newSimulationContext = createSimulationContext();
        setSimulationContext(newSimulationContext);
    }

    function spawnParticles() {
        simulationContext.particles.spawnParticles(5000);
    }

    const onRenderTick = useCallback(
        (deltaTime: DOMHighResTimeStamp) => {
            if (mapSettings.mapType === MapType.Wall) {
                return;
            }
            const deltaTimeSec = deltaTime / 1000;
            simulationContext.particles.update(deltaTimeSec);
            simulationContext.engine.update(deltaTimeSec);
        },
        [simulationContext, mapSettings]
    );

    function onWallToggle(mapPos: Point, value: boolean) {
        if (mapSettings.mapType === MapType.Wall) {
            const gridPos = round(mapPos);
            simulationContext.engine.toggleSolid(gridPos, value);
        }
    }

    return (
        <SimulationContext.Provider value={simulationContext}>
            <InteractionContextProvider>
                <div className="app">
                    <div className="app__toolbar">
                        <MainToolbar
                            mapSettings={mapSettings}
                            onRandomizeVelocity={randomizeMap}
                            controlPanelVisible={showControlPanel}
                            onToggleControlPanel={newState =>
                                setShowControlPanel(newState)
                            }
                            onMapTypeChange={onMapTypeChange}
                            onSpawnParticles={spawnParticles}
                            onMapReset={resetMap}
                        />
                    </div>
                    <div className="app__content">
                        {showControlPanel && (
                            <div className="app__stats-panel">
                                <ControlPanel />
                            </div>
                        )}
                        <div className="app__map">
                            <InteractiveMap
                                settings={mapSettings}
                                onTick={onRenderTick}
                                onWallToggle={onWallToggle}
                            />
                        </div>
                    </div>
                </div>
            </InteractionContextProvider>
        </SimulationContext.Provider>
    );
}
