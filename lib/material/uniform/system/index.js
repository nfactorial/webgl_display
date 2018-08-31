import Matrix4 from 'gl-mat4';
import Uniform from '../uniform';

/**
 * Contains the uniform implementation for all uniform values that are available for use from the system.
 * When a material uses a system uniform, they are always in the shared uniform pool. The system will provide the
 * appropriate value without the developer needing to do anything further.
 */

const WORK_MATRIX = Matrix4.create();

/**
 * Stores the current projection transform within the specified uniform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {Uniform} uniform - Description of the uniform value being applied.
 */
function applyProjectionTransformUniform(renderArgs, uniform) {
    renderArgs.gl.uniformMatrix4fv(uniform.location, false, renderArgs.projectionTransform);
}

/**
 * Stores the current view transform within the specified uniform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {Uniform} uniform - Description of the uniform value being applied.
 */
function applyViewTransformUniform(renderArgs, uniform) {
    renderArgs.gl.uniformMatrix4fv(uniform.location, false, renderArgs.viewTransform);
}

/**
 *
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {Uniform} uniform - Description of the uniform value being applied.
 */
function applyInvViewTransformUniform(renderArgs, uniform) {
    renderArgs.gl.uniformMatrix4fv(uniform.location, false, renderArgs.invViewTransform);
}

/**
 *
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 * @param {Uniform} uniform - Description of the uniform value being applied.
 */
function applyViewPositionUniform(renderArgs, uniform) {
    renderArgs.gl.uniform3fv(uniform.location, renderArgs.viewPosition);
}

function applyWorldTransformUniform(renderArgs, uniform, drawRequest) {
    // TODO: Create world transform for object
    renderArgs.gl.uniformMatrix4fv(uniform.location, false, WORK_MATRIX);
}

function applyWorldViewTransformUniform(renderArgs, uniform, drawRequest) {
    // TODO: Create world-view transform for object
    renderArgs.gl.uniformMatrix4fv(uniform.location, false, WORK_MATRIX);
}

function applyWorldViewProjectionTransformUniform(renderArgs, uniform, drawRequest) {
    renderArgs.gl.uniformMatrix4fv(uniform.location, false, WORK_MATRIX);
}

function applyWorldPositionUniform(renderArgs, uniform, drawRequest) {
    renderArgs.gl.uniform3fv(uniform.location, drawRequest.worldPosition);
}

// This internal map is used to describe which system uniforms are available and how they are applied.
const SYSTEM_UNIFORMS = new Map();

/**
 * Registers a new system supported uniform.
 * When a material is created, its uniform variable names are matched against the system uniforms. If a system
 * uniform is available for the uniform, the value is automatically provided by the renderer.
 * @param {string} name - The name of the
 * @param {function} cb - The function that provides the uniform value.
 * @param {boolean=true} shared - If true, the uniform is considered the same across all material instances.
 *                                Otherwise it is set per-instance.
 */
export function addSystemUniform(name, cb, shared = true) {
    if (SYSTEM_UNIFORMS.has(name)) {
        throw new Error(`System uniform '${name}' already exists.`);
    }

    SYSTEM_UNIFORMS.set(name, {
        shared,
        cb,
    });
}

/**
 *
 * @param gl
 * @param name
 * @param location
 * @param {boolean} systemUniforms - If false, system uniforms will not be created.
 * @returns {Uniform|null}
 */
export function createSystemUniform(gl, name, location, systemUniforms) {
    if (systemUniforms) {
        // If it's a system uniform, we don't need to reserve space for the value
        const uniformInfo = SYSTEM_UNIFORMS.get(name);
        if (uniformInfo) {
            return new Uniform(
                name,
                location,
                uniformInfo.shared,
                uniformInfo.cb,
                null,
            );
        }
    }

    return null;
}

addSystemUniform('projectionTransform', applyProjectionTransformUniform);
addSystemUniform('invViewTransform', applyInvViewTransformUniform);
addSystemUniform('viewTransform', applyViewTransformUniform);
addSystemUniform('viewPosition', applyViewPositionUniform);

addSystemUniform('worldPosition', applyWorldPositionUniform, false);
addSystemUniform('worldTransform', applyWorldTransformUniform, false);
addSystemUniform('worldViewTransform', applyWorldViewTransformUniform, false);
addSystemUniform('worldViewProjectionTransform', applyWorldViewProjectionTransformUniform, false);
