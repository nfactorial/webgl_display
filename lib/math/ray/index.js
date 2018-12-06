import Vector3 from 'gl-vec3';

/**
 *
 */
export default class Ray {
    constructor() {
        this.origin = Vector3.create();
        this.direction = Vector3.create();
    }

    /**
     * Computes the position of the ray at a specified point in time.
     * @param {Vector3} result - Vector3 instance that will receive the result.
     * @param {number} t - Distance along the ray where the desired position resides.
     * @return {Vector3} The supplied result vector.
     */
    getPosition(result, t) {
        return Vector3.scaleAndAdd(result, this.origin, this.direction, t);
    }
}
