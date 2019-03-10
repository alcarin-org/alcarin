// we use additional container, so we can change given image data in place
// (for performance reasons), but still have immutable container that will
// change always when data change
export interface DataContainer<T> {
    value: T;
}
