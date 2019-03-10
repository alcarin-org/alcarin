import { MACGridData } from './MACGrid';
import { Vector, Point } from '../../utils/Math';

const RandomRange = 0.1;
const DefaultRange = 5;

export type RandomMethod = (grid: MACGridData, pos: Point) => Vector;

export const Chaotic: RandomMethod = () => [
    DefaultRange - 2 * Math.random() * DefaultRange + rand(),
    DefaultRange - 2 * Math.random() * DefaultRange + rand(),
];

export const LeftWave: RandomMethod = (grid: MACGridData, [x, y]: Point) => [
    (x < grid.size / 2 ? DefaultRange : 0) + rand(),
    rand(),
];

export const RightWave: RandomMethod = (grid: MACGridData, [x, y]: Point) => [
    -(x > grid.size / 2 ? DefaultRange : 0) + rand(),
    rand(),
];

export const GlobalCurl: RandomMethod = (grid: MACGridData, [x, y]: Point) => [
    DefaultRange * (-1 + y / (0.5 * grid.size)) + rand(),
    -DefaultRange * (-1 + x / (0.5 * grid.size)) + rand(),
];

function rand() {
    return RandomRange / 2 - RandomRange * Math.random();
}
