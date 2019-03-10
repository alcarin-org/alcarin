import { DataContainer } from '../../../utils/Immutable';

// we use additional container so we can change given image data in place
// (for performance), but to still have immutable container that will change
// always when data change
export type ImageDataContainer = DataContainer<ImageData>;

export function create(width: number, height: number): ImageDataContainer {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context2d = canvas.getContext('2d');
    return {
        value: context2d!.getImageData(0, 0, width, height),
    };
}
