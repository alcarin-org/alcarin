import math from 'mathjs';

export type Vector = [number, number];

export type Point = Vector;

export function normalize(v: Vector): Vector {
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
