import Uniform from './uniform';
import { createSystemUniform } from './system';
import { getUniformDataCreator } from './data/create';
import { getApplyUniformMethod } from './data/apply';

/**
 * Creates a Uniform instance using the supplied information.
 * @param {WebGLRenderingContext} gl - The rendering context we are associated with.
 * @param {Program} program - The shader program the uniform belongs to.
 * @param {string} name - The name of the uniform variable being created.
 * @param {number} type - The data type of the uniform variable.
 * @param {number} size - The size of the data type.
 * @param {boolean} systemUniforms - True to enable system uniforms to be provided otherwise false.
 * @returns {Uniform} The Uniform instance created from the supplied information.
 */
export function createUniform(gl, program, name, type, size, systemUniforms) {
    const location = program.getUniformLocation(name);
    if (!location) {
        throw new Error(`Could not find uniform '${name}'.`);
    }

    // TODO: Need to get the type of the uniform

    return createSystemUniform(gl, name, location, systemUniforms) || new Uniform(
        name,
        location,
        false, // TODO: Take from definition
        getApplyUniformMethod(gl, type),
        getUniformDataCreator(gl, type),
    );
}
