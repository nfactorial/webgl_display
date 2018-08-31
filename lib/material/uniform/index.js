import * as WebGLHelper from '@nfactorial/webgl_helper';

/**
 * @typedef {object} UniformDesc - Describes a uniform value used by the program.
 * @property {WebGLUniformLocation} location - The location of the uniform within the program.
 * @property {string} name - The name of the uniform.
 * @property {function} apply - The function to be invoked that will commit the uniform value to the program.
 * @property {object|number} value - The value of the uniform (for non-system uniforms).
 */

import Uniform from './uniform';
import { createSystemUniform } from './system';
import { getUniformDataCreator } from './data/create';
import { getApplyUniformMethod } from './data/apply';

/**
 * Creates a UniformDesc object for the specified uniform.
 * @param {WebGLRenderingContext} gl - The rendering context we are associated with.
 * @param {WebGLHelper.Program} program - The shader program the uniform belongs to.
 * @param {string} name - The name of the uniform variable being created.
 * @param {boolean} systemUniforms - True to enable system uniforms to be provided otherwise false.
 * @returns {Uniform} The Uniform instance created from the supplied information.
 */
export function createUniform(gl, program, name, systemUniforms) {
    const location = program.getUniformLocation(name);
    if (!location) {
        throw new Error(`Could not find uniform '${name}'.`);
    }

    return createSystemUniform(gl, name, location, systemUniforms) || new Uniform(
        name,
        location,
        false, // TODO: Take from definition
        getApplyUniformMethod(gl, type),
        getUniformDataCreator(gl, type)
    );
}
