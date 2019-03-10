export interface VelocityField {
    // fluid velocity field coded as MAC grid with cell size 1.
    // integer point ((px, py)) represent center of a cell
    // pressure is stored on the center of cell (px, py)
    // velocity X is on the middle of the left face (px - 0.5, py)
    // velocity Y is on the middle of the top face (px, py - 0.5),
    // e.g. velX: (-0.5, 0), velY: (0, -0.5)
    // the map is surronded by 1 cell solids buffer

    velX: Float32Array;
    velY: Float32Array;
}
