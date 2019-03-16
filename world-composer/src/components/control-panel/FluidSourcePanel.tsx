import React, { useState, ChangeEvent } from 'react';

import {
    FluidSource,
    FluidSourceType,
} from '../../data/engine/FluidSourcesEngine';
import { Color, hexToColor, colorToHex } from '../../utils/Draw';

interface Props {
    onSourceChanged: (source: FluidSource) => void;
}

const DefaultColor: Color = [30, 255, 30, 128];

export const DefaultFluidSource: FluidSource = {
    type: FluidSourceType.Omni,
    gridPosition: [0, 0],
    power: 10,
    particlesColor: DefaultColor,
    particlesPerSecond: 50,
};

export function FluidSourcePanel({ onSourceChanged }: Props) {
    const [source, setSource] = useState(DefaultFluidSource);

    const updateFluidSource = (newSource: FluidSource) => {
        setSource(newSource);
        onSourceChanged(newSource);
    };

    const onPowerChange = (ev: ChangeEvent<HTMLInputElement>) => {
        updateFluidSource({
            ...source,
            power: parseInt(ev.currentTarget.value, 10),
        });
    };

    const onParticlesChange = (ev: ChangeEvent<HTMLInputElement>) => {
        updateFluidSource({
            ...source,
            particlesPerSecond: parseInt(ev.currentTarget.value, 10),
        });
    };

    const onColorChange = (ev: ChangeEvent<HTMLInputElement>) => {
        updateFluidSource({
            ...source,
            particlesColor: hexToColor(ev.currentTarget.value),
        });
    };

    return (
        <div className="fluid-source-panel">
            <form className="pure-form pure-form-aligned">
                <fieldset>
                    <legend>New source characteristic</legend>
                    <div className="pure-control-group">
                        <label htmlFor="power">Source power</label>
                        <input
                            id="power"
                            type="range"
                            min={1}
                            max={30}
                            value={source.power}
                            onChange={onPowerChange}
                        />
                    </div>
                    <div className="pure-control-group">
                        <label htmlFor="power">Particles per second</label>
                        <input
                            id="power"
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={source.particlesPerSecond}
                            onChange={onParticlesChange}
                        />
                    </div>
                    <div className="pure-control-group">
                        <label htmlFor="power">Particles color</label>
                        <input
                            id="power"
                            type="color"
                            min={0}
                            max={100}
                            step={5}
                            value={colorToHex(source.particlesColor)}
                            onChange={onColorChange}
                        />
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
