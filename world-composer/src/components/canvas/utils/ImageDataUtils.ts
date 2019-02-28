import { Color } from '../utils/DrawUtils';

// we use additional container so we can change given image data in place
// (for performance), but to still have immutable container that will change
// always when data change
export interface ImageDataContainer {
    imageData: ImageData;
}

// function imageColorOffset(imageData: ImageData, x: number, y: number) {
//     return 4 * (imageData.width * y + x);
// }

export function create(width: number, height: number): ImageDataContainer {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context2d = canvas.getContext('2d');
    return {
        imageData: context2d!.getImageData(0, 0, width, height),
    };
}

// export function putColor(imageData: ImageData, ind: number; color: Color) {
//     imageData.data.set(color, ind);
// }
