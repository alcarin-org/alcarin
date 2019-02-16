import math from 'mathjs';

export type Vector = [number, number];

export type Point = Vector;

export function normalize(v: Vector): Vector {
    if (v[0] === 0 && v[1] === 0) {
        return v;
    }
    return math.divide(v, math.norm(v)) as Vector;
}

export function angle(v: Vector, v2: Vector = [1, 0]) {
    const normalizedV = normalize(v);
    const normalizedV2 = normalize(v2);

    return math.atan2(v[1], v[0]) - math.atan2(v2[1], v2[0]);
}

export function constraints(from: number, to: number, val: number) {
    const [rFrom, rTo] = [from, to].sort();
    return math.min(math.max(rFrom, val), rTo);
}

export function perpendicular(v: Vector): Vector {
    return [v[1], -v[0]];
}

export function interpolate(v1: Vector, v2: Vector, perc: number): Vector {
    return [v1[0] + (v2[0] - v1[0]) * perc, v1[1] + (v2[1] - v1[1]) * perc];
}

export function multiply(v: Vector, scalar: number): Vector {
    return [v[0] * scalar, v[1] * scalar];
}

export function add(v1: Vector, v2: Vector): Vector {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

export function floor(p: Point): Point {
    return [Math.floor(p[0]), Math.floor(p[1])];
}

export function round(p: Point): Point {
    return [Math.round(p[0]), Math.round(p[1])];
}
