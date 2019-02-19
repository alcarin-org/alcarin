import { resolveLinearByJacobi } from './Math';

test.only('System of linear equations should be properly approximated by Jacobi method', () => {
    // prettier-ignore
    const A = Float64Array.from([
        10, -1, 2, 0,
        -1, 11, -1, 3,
        2, -1, 10, -1,
        0, 3, -1, 8,
    ]);

    const B = Float64Array.from([6, 25, -11, 15]);
    const x = resolveLinearByJacobi(A, B);
    expect(Math.abs(x[0] - 1)).toBeLessThan(0.001);
    expect(Math.abs(x[1] - 2)).toBeLessThan(0.001);
    expect(Math.abs(x[2] + 1)).toBeLessThan(0.001);
    expect(Math.abs(x[3] - 1)).toBeLessThan(0.001);
});

test('Basic system of linear equations should be properly approximated by Jacobi method', () => {
    // prettier-ignore
    const A = Int8Array.from([
        2, 1,
        5, 7
    ]);
    const B = Float64Array.from([11, 13]);
    const x = resolveLinearByJacobi(A, B);
    expect(Math.trunc(x[0] * 100) / 100).toEqual(7.11);
    expect(Math.trunc(x[1] * 100) / 100).toEqual(-3.22);
});
