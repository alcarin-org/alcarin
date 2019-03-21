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

export function colorToHex([r, g, b]: Color) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToColor(hex: string): Color {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b, 255];
}
