export type Vector = [number, number];
export enum VectorComponent {
    x = 0,
    y = 1,
}

export type Point = Vector;

export function normalize(v: Vector): Vector {
    if (v[0] === 0 && v[1] === 0) {
        return v;
    }

    return multiply(v, 1 / magnitude(v));
}

export function magnitude(v: Vector) {
    return Math.sqrt(v[0] ** 2 + v[1] ** 2);
}

export function constraints(from: number, to: number, val: number) {
    return Math.min(Math.max(from, val), to);
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

// coefficientA main diagonal CAN NOT HAVE zeros. in our system
// main diagonal represent neightbours of given cell. as we do not have
// fully separated cell, there will be no 0s on main diagonal
export function resolveLinearByJacobi(
    A: Int8Array, // coefficient matrix A
    B: Float64Array // constants matrix B
): Float64Array {
    if (A.length !== B.length ** 2) {
        throw new Error(
            'Coefficient matrix A has different size that constant matrix B! Can not continue.'
        );
    }
    let x = new Float64Array(B.length); // resultsMatrix
    // one step
    for (let step = 0; step < 20; step++) {
        const localResX = x.slice(0);
        for (let iUnknown = 0; iUnknown < B.length; iUnknown++) {
            const iUnknownCoefficientOffset = iUnknown * B.length;

            let iGuess = B[iUnknown];
            // iGuess = (eqA[i] * x[i] + ...) / eqA[iUnknown];
            for (
                let iCoefficient = 0;
                iCoefficient < B.length;
                iCoefficient++
            ) {
                if (iCoefficient === iUnknown) {
                    continue;
                }
                iGuess -=
                    A[iUnknownCoefficientOffset + iCoefficient] *
                    x[iCoefficient];
            }
            iGuess /= A[iUnknownCoefficientOffset + iUnknown];
            localResX[iUnknown] = iGuess;
        }
        x = localResX;
    }

    return x;
}
