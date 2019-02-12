export interface Vector {
    x: number;
    y: number;
}

export type Point = Vector;

export function magnitude(v: Vector) {
    return Math.sqrt(v.x ** 2 + v.y ** 2);
}

export function distance(from: Point, to: Point) {
    return Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
}

export function normalize(v: Vector) {
    const m = magnitude(v);
    return { x: v.x / m, y: v.y / m };
}

export function angle(v: Vector, v2: Vector = { x: 1, y: 0 }) {
    const normalizedV = normalize(v);
    const normalizedV2 = normalize(v2);

    return Math.atan2(v.y, v.x) - Math.atan2(v2.y, v2.x);
}

export function constraints(from: number, to: number, val: number) {
    const [rFrom, rTo] = [from, to].sort();
    return Math.min(Math.max(rFrom, val), rTo);
}

export function scale(scalar: number, v: Vector) {
    return { x: v.x * scalar, y: v.y * scalar };
}

export function perpendicular(v: Vector) {
    return { x: v.y, y: -v.x };
}

export function sum(v: Vector, v2: Vector) {
    return { x: v.x + v2.x, y: v.y + v2.y };
}

export function equals(p: Point, p2: Point) {
    return p.x === p2.x && p.y === p2.y;
}
