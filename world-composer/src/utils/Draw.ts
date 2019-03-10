export type Color = [number, number, number, number];

export function colorToNumber(color: Color) {
    // tslint:disable no-bitwise
    return (
        (color[3] << 24) | // alpha
        (color[2] << 16) | // blue
        (color[1] << 8) | // green
        color[0] // red
    );
}
