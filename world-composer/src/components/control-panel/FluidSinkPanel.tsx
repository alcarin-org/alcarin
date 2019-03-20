import React, { useState, ChangeEvent } from 'react';

import {
    FluidSource,
    FluidSourceType,
} from '../../data/engine/FluidSourcesEngine';

interface Props {
    onSinkChanged: (source: FluidSource) => void;
}

export const DefaultFluidSink: FluidSource = {
    type: FluidSourceType.Omni,
    gridPosition: [0, 0],
    power: -5,
    particlesColor: [0, 0, 0, 0],
    particlesPerSecond: 0,
};

export function FluidSinkPanel({ onSinkChanged }: Props) {
    const [source, setSource] = useState(DefaultFluidSink);

    const updateFluidSource = (newSource: FluidSource) => {
        setSource(newSource);
        onSinkChanged(newSource);
    };

    const onPowerChange = (ev: ChangeEvent<HTMLInputElement>) => {
        updateFluidSource({
            ...source,
            power: -parseInt(ev.currentTarget.value, 10) / 10,
        });
    };

    return (
        <div className="fluid-source-panel">
            <form className="pure-form pure-form-aligned">
                <fieldset>
                    <legend>New sink characteristic</legend>
                    <div className="pure-control-group">
                        <label htmlFor="power">Sink power</label>
                        <input
                            id="power"
                            type="range"
                            min={1}
                            max={200}
                            step={5}
                            value={-source.power * 10}
                            onChange={onPowerChange}
                        />
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
