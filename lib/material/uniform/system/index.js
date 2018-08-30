/**
 * Contains the uniform implementation for all uniform values that are available for use from the system.
 * When a material uses a system uniform, they are always in the shared uniform pool. The system will provide the
 * appropriate value without the developer needing to do anything further.
 */

/**
 * Stores the current projection transform within the specified uniform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {UniformDesc} uniformDesc - Description of the uniform value being applied.
 */
function applyProjectionTransformUniform(renderArgs, uniformDesc) {
    renderArgs.gl.uniformMatrix4fv(uniformDesc.location, false, renderArgs.projectionTransform);
}

/**
 * Stores the current view transform within the specified uniform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {UniformDesc} uniformDesc - Description of the uniform value being applied.
 */
function applyViewTransformUniform(renderArgs, uniformDesc) {
    renderArgs.gl.uniformMatrix4fv(uniformDesc.location, false, renderArgs.viewTransform);
}

/**
 *
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {UniformDesc} uniformDesc - Description of the uniform value being applied.
 */
function applyInvViewTransformUniform(renderArgs, uniformDesc) {
    renderArgs.gl.uniformMatrix4fv(uniformDesc.location, false, renderArgs.invViewTransform);
}

/**
 *
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {UniformDesc} uniformDesc - Description of the uniform value being applied.
 */
function applyViewPositionUniform(renderArgs, uniformDesc) {
    renderArgs.gl.uniform3fv(uniformDesc.location, renderArgs.viewPosition);
}

// This internal map is used to describe which system uniforms are available and how they are applied.
const SYSTEM_UNIFORMS = new Map();

SYSTEM_UNIFORMS.set('projectionTransform', applyProjectionTransformUniform);
SYSTEM_UNIFORMS.set('invViewTransform', applyInvViewTransformUniform);
SYSTEM_UNIFORMS.set('viewTransform', applyViewTransformUniform);
SYSTEM_UNIFORMS.set('viewPosition', applyViewPositionUniform);

/**
 *
 * @param gl
 * @param name
 * @param location
 * @returns {UniformDesc|null}
 */
export function createSystemUniform(gl, name, location) {
    // If it's a system uniform, we don't need to reserve space for the value
    if (SYSTEM_UNIFORMS.has(name)) {
        return {
            name,
            location,
            shared: false, // TODO: Take from definition
            apply: SYSTEM_UNIFORMS.get(name),
            value: 0,
        };
    }

    return null;
}
