import math from 'mathjs';

import { Atmosphere, AtmosphereNode, NodeType, Center } from './Atmosphere';
import { Vector, Point, normalize, perpendicular } from '../utils/Math';

enum VectorComponent {
    x = 0,
    y = 1,
}

export function evolve(
    atmo: Atmosphere,
    timePass: number,
    centrifugalMagnitudeMod: number,
    coriolisMagnitudeMod: number
) {
    const conventedAtmoModel = atmo.apply((node, pos, originalNodes) => {
        const newVelocity = applyConvectionForce(
            timePass,
            node,
            pos,
            originalNodes
        );

        let outputVelocity = newVelocity;

        const distanceFromCenter =
            (math.distance(pos, Center) as number) / atmo.radius;
        const externalForces = math.add(
            math.multiply(
                perpendicular(normalize(pos)),
                coriolisMagnitudeMod * distanceFromCenter * timePass
            ),
            math.multiply(
                normalize(pos),
                distanceFromCenter * centrifugalMagnitudeMod * timePass
            )
        ) as Vector;

        outputVelocity = math.add(newVelocity, externalForces) as Vector;

        // // general leak of energy
        // outputVelocity = math.multiply(
        //     1 - 0.8 * timePass,
        //     outputVelocity
        // ) as Vector;

        // temporary max vector size
        // if (math.norm(outputVelocity) > 1) {
        //     outputVelocity = normalize(outputVelocity);
        // }

        return {
            ...node,
            velocity: outputVelocity,
        };
    });

    applyPressureModel(atmo, timePass);
}

function iterateNeighbors(
    atmo: Atmosphere,
    pos: Point,
    callback: (node: AtmosphereNode, pos: Point) => void
) {
    const range = [-1, 0, 1];
    for (const x of range) {
        for (const y of range) {
            if (x === 0 && y === 0) {
                continue;
            }
            const neighborPos: Point = [pos[0] + x, pos[1] + y];
            callback(atmo.get(neighborPos), neighborPos);
        }
    }
}

function applyPressureModel(atmo: Atmosphere, timePass: number) {
    const fluidIndexes = atmo.fluidCoords;
    const fluidIndexesSize = fluidIndexes.length;

    const coefficientBaseRow = new Array(fluidIndexesSize).fill(0);

    const coefficientMatrixA: number[][] = new Array(fluidIndexesSize);
    const divergenceVectorB = new Array(fluidIndexesSize);

    fluidIndexes.forEach((nodePos, fluidIndex) => {
        const fieldARow = coefficientBaseRow.slice(0);

        let fluidNeightborsCount = 0;
        iterateNeighbors(atmo, nodePos, (neightNode, neightPos) => {
            if (neightNode.type === NodeType.Fluid) {
                fluidNeightborsCount++;

                fieldARow[neightNode.fluidIndex] = 1;
            }
        });
        fieldARow[fluidIndex] = fluidNeightborsCount;
        coefficientMatrixA[fluidIndex] = fieldARow;
        divergenceVectorB[fluidIndex] = -divergence(atmo, nodePos) / timePass;
    });

    const pressureMatrix: number[][] = math.lusolve(
        coefficientMatrixA,
        divergenceVectorB
    ) as number[][];

    fluidIndexes.forEach((pos, fluidInd) => {
        const node = atmo.get(pos);
        node.pressure = pressureMatrix[fluidInd++][0];
    });

    atmo.apply((node, pos) => {
        const pressureGradientValue = math.multiply(
            -timePass,
            pressureGradient(atmo, pos)
        ) as Vector;
        return {
            ...node,
            velocity: math.add(node.velocity, pressureGradientValue) as Vector,
        };
    });
}

function pressureGradient(atmo: Atmosphere, pos: Point): Vector {
    const mainNode = atmo.get(pos);

    const lastXPos: Point = [pos[0] - 1, pos[1]];
    const lastYPos: Point = [pos[0], pos[1] - 1];

    const xDiff =
        atmo.get(lastXPos).type === NodeType.Solid
            ? 0
            : mainNode.pressure - atmo.get([pos[0] - 1, pos[1]]).pressure;

    const yDiff =
        atmo.get(lastYPos).type === NodeType.Solid
            ? 0
            : mainNode.pressure - atmo.get([pos[0], pos[1] - 1]).pressure;

    return [xDiff, yDiff];
}

export function divergence(atmo: Atmosphere, pos: Point): number {
    const mainNodeVelocity = atmo.get(pos).velocity;
    const nextXPos: Point = [pos[0] + 1, pos[1]];
    const nextYPos: Point = [pos[0], pos[1] + 1];

    const xDiff =
        atmo.get(nextXPos).type === NodeType.Solid
            ? 0
            : atmo.get(nextXPos).velocity[0] - mainNodeVelocity[0];
    const yDiff =
        atmo.get(nextYPos).type === NodeType.Solid
            ? 0
            : atmo.get(nextYPos).velocity[1] - mainNodeVelocity[1];

    return xDiff + yDiff;
}

function interpolateVelocityComponentAt(
    atmo: Atmosphere,
    pos: Point,
    component: VectorComponent
) {
    const gridPos = math.floor(pos) as Point;
    const range = [0, 1];

    let cmpNewValue = 0;
    let weightSum = 0;
    const xLocOffset = pos[0] - gridPos[0];
    const yLocOffset = pos[1] - gridPos[1];
    for (const offsetX of range) {
        const weightX =
            offsetX === 0 ? gridPos[0] - pos[0] + 1 : pos[0] - gridPos[0];
        for (const offsetY of range) {
            const weightY =
                offsetY === 0 ? gridPos[1] - pos[1] + 1 : pos[1] - gridPos[1];
            const neighNode = atmo.get([
                gridPos[0] + offsetX,
                gridPos[1] + offsetY,
            ]);
            if (neighNode.type === NodeType.Solid) {
                continue;
            }
            const cmpValue = neighNode.velocity[component];
            weightSum += weightX * weightY;
            cmpNewValue += weightX * weightY * cmpValue;
        }
    }
    return weightSum === 0 ? 0 : cmpNewValue / weightSum;
}

export function interpolateVelocityAt(atmo: Atmosphere, pos: Point): Vector {
    return [
        interpolateVelocityComponentAt(
            atmo,
            [pos[0], pos[1] - 0.5],
            VectorComponent.x
        ),
        interpolateVelocityComponentAt(
            atmo,
            [pos[0] - 0.5, pos[1]],
            VectorComponent.y
        ),
    ];
}

function applyConvectionForce(
    timePass: number,
    node: AtmosphereNode,
    pos: Point,
    originalAtmo: Atmosphere
): Vector {
    const approxVelocity = interpolateVelocityAt(originalAtmo, pos);
    const lastKnownPosition: Point = math.add(
        pos,
        math.multiply(approxVelocity, timePass / 2)
    ) as Point;

    const approxAverageVelocity = interpolateVelocityAt(
        originalAtmo,
        lastKnownPosition
    );

    const approxDestinityPoint: Point = math.add(
        pos,
        math.multiply(approxAverageVelocity, timePass)
    ) as Point;

    return interpolateVelocityAt(originalAtmo, approxDestinityPoint);
}
