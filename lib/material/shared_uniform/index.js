/**
 * Contains the uniform implementation for all uniform values that are available for use from the system.
 * When a material uses a system uniform, they are always in the shared uniform pool. The system will provide the
 * appropriate value without the developer needing to do anything further.
 */

/**
 * @typedef {object} UniformDesc - Describes a uniform value used by the program.
 * @property {WebGLUniformLocation} location - The location of the uniform within the program.
 * @property {function} apply - The function to be invoked that will commit the uniform value to the program.
 * @property {object} value - The value of the uniform (for non-system uniforms).
 */

/**
 * Stores the current projection transform within the specified uniform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {UniformDesc} uniformDesc - Description of the uniform value being applied.
 */
function applyProjectionTransformUniform(renderArgs, uniformDesc) {
    renderArgs.gl.uniformMatrix4fv(uniformDesc.location, false, renderArgs.projectionTransform.elements);
}

/**
 * Stores the current view transform within the specified uniform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {UniformDesc} uniformDesc - Description of the uniform value being applied.
 */
function applyViewTransformUniform(renderArgs, uniformDesc) {
    renderArgs.gl.uniformMatrix4fv(uniformDesc.location, false, renderArgs.viewTransform.elements);
}

/**
 *
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {UniformDesc} uniformDesc - Description of the uniform value being applied.
 */
function applyInvViewTransformUniform(renderArgs, uniformDesc) {
    renderArgs.gl.uniformMatrix4fv(uniformDesc.location, false, renderArgs.invViewTransform.elements);
}

/**
 *
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {UniformDesc} uniformDesc - Description of the uniform value being applied.
 */
function applyViewPositionUniform(renderArgs, uniformDesc) {
    renderArgs.gl.uniform3fv(uniformDesc.location, renderArgs.viewPosition.elements);
}

// This internal map is used to describe which system uniforms are available and how they are applied.
const SYSTEM_UNIFORMS = new Map();

SYSTEM_UNIFORMS.set('projectionTransform', applyProjectionTransformUniform);
SYSTEM_UNIFORMS.set('invViewTransform', applyInvViewTransformUniform);
SYSTEM_UNIFORMS.set('viewTransform', applyViewTransformUniform);
SYSTEM_UNIFORMS.set('viewPosition', applyViewPositionUniform);

/**
 * Creates a UniformDesc object for the specified uniform.
 * @param {string} name - The name of the uniform variable being created.
 * @param {WebGLUniformLocation} location - The location of the uniform within the program.
 * @returns {UniformDesc} Description of the uniform.
 */
export function createSharedUniform(name, location) {
    // If it's a system uniform, we don't need to reserve space for the value
    if (SYSTEM_UNIFORMS.has(name)) {
        return {
            location,
            apply: SYSTEM_UNIFORMS.get(name)
        };
    }

    // Otherwise the uniform needs somewhere to store the value
    throw new Error('Not implemented.');

    return {
        location,
        f: applyProjectionTransformUniform,     // TODO: apply* function for the uniform type
        value: 0                                // TODO: Appropriate storage for the uniform type
    };
}
