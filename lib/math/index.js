import Matrix4 from 'gl-mat4';
import Matrix3 from 'gl-mat3';
import Vector4 from 'gl-vec4';
import Vector3 from 'gl-vec3';
import Vector2 from 'gl-vec2';
import Quaternion from 'gl-quat';

/**
 * Performs a linear interpolation between two values.
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
    return a + t * (b - a);
}

/**
 * Computes a random value between -1 and 1.
 * @returns {number} A pseudo random value between -1 and 1.
 */
export function signedRandom() {
    return Math.random() * 2 - 1;
}

export {
    Matrix3,
    Matrix4,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
};
