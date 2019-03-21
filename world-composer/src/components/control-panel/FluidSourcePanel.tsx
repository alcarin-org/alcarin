import React, { useState, useEffect, ChangeEvent } from 'react';

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
    power: 5,
    particlesColor: DefaultColor,
    particlesPerSecond: 80,
};

export function FluidSourcePanel({ onSourceChanged }: Props) {
    const [source, setSource] = useState(DefaultFluidSource);

    useEffect(randomizeColor, []);

    const updateFluidSource = (newSource: FluidSource) => {
        setSource(newSource);
        onSourceChanged(newSource);
    };

    function setColor(color: Color) {
        updateFluidSource({
            ...source,
            particlesColor: color,
        });
    }

    function randomizeColor() {
        const rand = () => Math.trunc(Math.random() * 256);
        setColor([rand(), rand(), rand(), 255]);
    }

    const onPowerChange = (ev: ChangeEvent<HTMLInputElement>) => {
        updateFluidSource({
            ...source,
            power: parseInt(ev.currentTarget.value, 10) / 10,
        });
    };

    const onParticlesChange = (ev: ChangeEvent<HTMLInputElement>) => {
        updateFluidSource({
            ...source,
            particlesPerSecond: parseInt(ev.currentTarget.value, 10),
        });
    };

    const onColorChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setColor(hexToColor(ev.currentTarget.value));
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
                            max={200}
                            value={source.power * 10}
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
                        <button
                            className="pure-button"
                            type="button"
                            onClick={randomizeColor}
                        >
                            <i className="fa fa-random" />
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
