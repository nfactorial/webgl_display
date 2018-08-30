import * as WebGLHelper from '@nfactorial/webgl_helper';

/**
 * @typedef {object} UniformDesc - Describes a uniform value used by the program.
 * @property {WebGLUniformLocation} location - The location of the uniform within the program.
 * @property {string} name - The name of the uniform.
 * @property {function} apply - The function to be invoked that will commit the uniform value to the program.
 * @property {object|number} value - The value of the uniform (for non-system uniforms).
 */

import { createSystemUniform } from './system';
import { createUniformData, getApplyUniformMethod } from './apply';

/**
 * Creates a UniformDesc object for the specified uniform.
 * @param {WebGLRenderingContext} gl - The rendering context we are associated with.
 * @param {WebGLHelper.Program} program - The shader program the uniform belongs to.
 * @param {string} name - The name of the uniform variable being created.
 * @returns {UniformDesc} Description of the uniform.
 */
export function createUniform(gl, program, name) {
    const location = program.getUniformLocation(name);
    if (!location) {
        throw new Error(`Could not find uniform '${name}'.`);
    }

    return createSystemUniform(gl, name, location) || {
        name,
        location,
        shared: false, // TODO: Take from definition
        apply: getApplyUniformMethod(gl, type),
        value: createUniformData(gl, name, location, type),
    };
}
