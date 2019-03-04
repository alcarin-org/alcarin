// import React, {
//     useRef,
//     useEffect,
//     useState,
//     MouseEventHandler,
//     RefObject,
// } from 'react';

// import {
//     renderBgTexture,
//     renderBigBgTexture,
//     renderVelocities,
//     MapType,
//     initializeGrid,
//     pxToAtmoPos,
//     posToPx,
//     renderParticles,
//     renderParticleTo,
// } from './primitives';
// import { SolidBackground } from './background/SolidBackground';
// import { Color } from './utils/DrawUtils';
// import { useCanvas } from './utils/CanvasUtils';
// import { Atmosphere } from '../../data/Atmosphere';
// import { VelocityDrivenAtmo } from '../../data/engine/AtmosphereEngine';
// import {
//     Point,
//     Vector,
//     normalize,
//     multiply,
//     round,
//     add,
//     floor,
// } from '../../utils/Math';

// interface Props {
//     atmosphere: Atmosphere;
//     atmoDriver: VelocityDrivenAtmo;
//     fieldSizePx?: number;
//     onClick: (p: Point) => void;
//     mapType: MapType;
//     selectedNodePosition?: Point;
//     drawRealInterpolation: boolean;
//     drawGrid: boolean;
// }

// export default function WeatherCanvas({
//     atmosphere,
//     atmoDriver,
//     fieldSizePx = 30,
//     onClick,
//     mapType = MapType.Pressure,
//     drawRealInterpolation,
//     drawGrid,
//     selectedNodePosition,
// }: Props) {
//     const atmo = atmosphere;
//     const displayCanvasRef = useRef<HTMLCanvasElement>(null);
//     const canvasSizePx = fieldSizePx * atmo.size;

//     const [screenCanvasRef, screenCtxRef] = useCanvas(
//         canvasSizePx,
//         canvasSizePx,
//         displayCanvasRef
//     );
//     const [gridCanvasRef, gridCtxRef] = useCanvas(canvasSizePx, canvasSizePx);
//     const [bgCanvasRef, bgCtxRef] = useCanvas(atmo.size, atmo.size);

//     const [cellCanvasRef, cellCtxRef] = useCanvas(10, 10);

//     useEffect(() => {
//         screenCtxRef.current!.strokeStyle = 'black';
//         cellCtxRef.current!.translate(5, 5);
//         initializeGrid(gridCtxRef.current!, atmo, fieldSizePx);
//         renderParticleTo(cellCtxRef.current!, atmoDriver, fieldSizePx);
//     }, []);

//     useEffect(() => {
//         function renderAtmosphere() {
//             const screenCtx = screenCtxRef.current!;
//             screenCtx.strokeStyle = 'black';
//             screenCtx.setLineDash([]);

//             // if (drawRealInterpolation) {
//             //     renderBigBgTexture(
//             //         screenCtx,
//             //         canvasSizePx,
//             //         fieldSizePx,
//             //         atmo,
//             //         mapType
//             //     );
//             // } else {
//             //     renderBgTexture(bgCtxRef.current!, atmo, mapType);
//             //     screenCtx.drawImage(
//             //         bgCanvasRef.current!,
//             //         0,
//             //         0,
//             //         canvasSizePx,
//             //         canvasSizePx
//             //     );
//             // }

//             if (mapType === MapType.Velocity) {
//                 renderVelocities(screenCtx, atmo, fieldSizePx);
//             }

//             if (mapType === MapType.Neutral) {
//                 renderParticles(
//                     screenCtx,
//                     cellCanvasRef.current!,
//                     atmoDriver,
//                     fieldSizePx
//                 );
//             }

//             if (drawGrid) {
//                 screenCtx.drawImage(gridCanvasRef.current!, 0, 0);
//             }

//             if (selectedNodePosition) {
//                 const pos = round(selectedNodePosition);

//                 screenCtx.strokeStyle = 'rgba(255,0,0,0.75)';
//                 screenCtx.setLineDash([5, 5]);

//                 const pxPos = posToPx(
//                     [pos[0] - 0.5, pos[1] - 0.5],
//                     fieldSizePx,
//                     atmo
//                 );
//                 screenCtx.strokeRect(
//                     pxPos[0],
//                     pxPos[1],
//                     fieldSizePx,
//                     fieldSizePx
//                 );
//             }
//         }

//         const requestId = requestAnimationFrame(renderAtmosphere);

//         return () => cancelAnimationFrame(requestId);
//     });

//     function onAtmoClick(ev: React.MouseEvent) {
//         const pos = pxToAtmoPos(
//             ev.nativeEvent.offsetX,
//             ev.nativeEvent.offsetY,
//             fieldSizePx,
//             atmo
//         );
//         atmoDriver.setFluidSource(round(pos));
//         onClick(pos);
//     }

//     return (
//         <div className="map-renderer">
//             <SolidBackground
//                 solids={atmo.solidsVector}
//                 solidsWidth={atmo.size}
//                 solidsHeight={atmo.size}
//                 canvasWidth={canvasSizePx}
//                 canvasHeight={canvasSizePx}
//             />
//             <canvas
//                 onClick={onAtmoClick}
//                 ref={displayCanvasRef}
//                 width={canvasSizePx}
//                 height={canvasSizePx}
//             />
//         </div>
//     );
// }
