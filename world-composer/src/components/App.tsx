import React, { Component } from 'react';
import './App.scss';
import WeatherCanvas from './canvas/WeatherCanvas';
import { Atmosphere } from '../utils/AtmosphereData';
import { ipcRenderer } from '../electron-bridge';

const WorldRadius = 17;
const atmosphereSample: Atmosphere = {
    worldRadius: WorldRadius,
    data: new Array(2 * WorldRadius).fill(null).map(() =>
        new Array(2 * WorldRadius).fill(null).map(() => ({
            velocity: { x: 0, y: 0 },
        }))
    ),
};

class App extends Component<{}, { number: number }> {
    public componentDidMount() {
        ipcRenderer.send('main-window-ready');
    }

    public render() {
        return (
            <div className="app">
                <WeatherCanvas atmosphere={atmosphereSample} gapsPx={1} />
            </div>
        );
    }
}

export default App;
