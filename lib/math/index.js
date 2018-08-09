import Matrix from './matrix';
import Vector2 from './vector2';
import Vector3 from './vector3';
import Quaternion from './quaternion';

/**
 * Performs a linear interpolation between two values.
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
    return a + t*(b-a);
}

/**
 * Computes a random value between -1 and 1.
 * @returns {number} A pseudo random value between -1 and 1.
 */
export function signedRandom() {
    return Math.random() * 2 - 1;
}

export {
    Matrix,
    Vector2,
    Vector3,
    Quaternion
};
