// memoize function result for given argument identity
// only remember result for last called identity
export function memoizeOnce<TArgs extends any[], TResult>(
    cacheIdentityExtractor: (...args: TArgs) => any,
    fn: (...args: TArgs) => TResult
) {
    let lastIdentity: any;
    let lastResult: TResult | null = null;

    return function memoizedFn(...args: TArgs): TResult {
        const currentCallIdentity = cacheIdentityExtractor(...args);
        if (
            lastIdentity !== undefined &&
            currentCallIdentity === lastIdentity
        ) {
            return lastResult!;
        }

        lastIdentity = currentCallIdentity;
        lastResult = fn(...args);
        return lastResult;
    };
}
