export interface Vector {
    x: number;
    y: number;
}

export type Point = Vector;

export function distance(from: Point, to: Point) {
    return Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
}
