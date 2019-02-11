import { Vector, Point } from './Math';

interface AtmosphereNode {
    // m/s^2
    velocity: Vector;
}

const defaultAtmosphereNode = () => ({
    velocity: { x: 0, y: 0 },
});

export class Atmosphere {
    // we work only with
    public readonly worldRadius: number;

    public data: AtmosphereNode[][];

    public constructor(radius: number) {
        this.worldRadius = radius;

        const dataProxyHandler = this.centerAt0and0ProxyHandler(radius);
        const rowsArray = new Array(2 * radius).fill(null);
        const emptyDataWithInnerProxy = rowsArray.map(() => {
            const columnsArray = new Array(2 * radius).fill(null);
            return new Proxy(
                columnsArray.map(defaultAtmosphereNode),
                dataProxyHandler
            );
        });
        this.data = new Proxy(emptyDataWithInnerProxy, dataProxyHandler);
    }

    public forEach(callback: (node: AtmosphereNode, index: Point) => void) {
        const [cellsFrom, cellsTo] = [
            -this.worldRadius + 1,
            this.worldRadius - 1,
        ];
        for (let x = cellsFrom; x <= cellsTo; x++) {
            for (let y = cellsFrom; y <= cellsTo; y++) {
                callback(this.data[x][y], { x, y });
            }
        }
    }

    private centerAt0and0ProxyHandler(radius: number): ProxyHandler<[]> {
        const [rangeFrom, rangeTo] = [-radius + 1, radius - 1];
        return {
            get(arr: [], prop: string) {
                const numberProp = parseInt(prop, 10);
                if (!isNaN(numberProp)) {
                    if (numberProp >= rangeFrom && numberProp <= rangeTo) {
                        return arr[numberProp + radius - 1];
                    }

                    throw new Error(
                        `Atmosphere node must be number value between ${rangeFrom} and ${rangeTo}. Got "${prop}".`
                    );
                }

                return arr[prop as any];
            },
        };
    }
}
