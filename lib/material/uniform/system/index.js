import Matrix4 from 'gl-mat4';
import Uniform from '../uniform';

/**
 * Contains the uniform implementation for all uniform values that are available for use from the system.
 * When a material uses a system uniform, they are always in the shared uniform pool. The system will provide the
 * appropriate value without the developer needing to do anything further.
 */

const WORK_MATRIX = Matrix4.create();
const WORK_MATRIX2 = Matrix4.create();

/**
 * Stores the current projection transform within the specified uniform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 */
function applyProjectionTransformUniform(renderArgs) {
    renderArgs.gl.uniformMatrix4fv(this.location, false, renderArgs.projectionTransform);
}

/**
 * Stores the current view transform within the specified uniform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 */
function applyViewTransformUniform(renderArgs) {
    renderArgs.gl.uniformMatrix4fv(this.location, false, renderArgs.viewTransform);
}

/**
 * Sets a uniforms value to the current camera transform.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 */
function applyInvViewTransformUniform(renderArgs) {
    renderArgs.gl.uniformMatrix4fv(this.location, false, renderArgs.invViewTransform);
}

/**
 * Sets a uniforms value to the position of the camera in world space.
 * @param {RenderArgs} renderArgs - Description of the current render being processed.
 */
function applyViewPositionUniform(renderArgs) {
    renderArgs.gl.uniform3fv(this.location, renderArgs.viewPosition);
}

/**
 * Sets a uniforms value to the world transform of the object being rendered.
 * @param {RenderArgs} renderArgs - Description of the current frame being processed.
 * @param {DrawRequest} drawRequest - Description of the draw request being processed.
 */
function applyWorldTransformUniform(renderArgs, drawRequest) {
    renderArgs.gl.uniformMatrix4fv(this.location, false, drawRequest.worldTransform);
}

/**
 * Sets a uniforms value to the concatenated transform consisting of the world and view transforms.
 * @param {RenderArgs} renderArgs - Description of the current frame being processed.
 * @param {DrawRequest} drawRequest - Description of the draw request being processed.
 */
function applyWorldViewTransformUniform(renderArgs, drawRequest) {
    Matrix4.multiply(WORK_MATRIX, drawRequest.worldTransform, renderArgs.viewTransform);
    renderArgs.gl.uniformMatrix4fv(this.location, false, WORK_MATRIX);
}

/**
 * Sets a uniforms value to the concatenated transform consisting of the world, view and projection transforms.
 * @param {RenderArgs} renderArgs - Description of the current frame being processed.
 * @param {DrawRequest} drawRequest - Description of the draw request being processed.
 */
function applyWorldViewProjectionTransformUniform(renderArgs, drawRequest) {
    Matrix4.multiply(WORK_MATRIX2, drawRequest.worldTransform, renderArgs.viewTransform);
    Matrix4.multiply(WORK_MATRIX, WORK_MATRIX2, renderArgs.projectionTransform);

    renderArgs.gl.uniformMatrix4fv(this.location, false, WORK_MATRIX);
}

/**
 * Sets a uniforms value to the draw requests world position.
 * @param {RenderArgs} renderArgs - Description of the current frame being processed.
 * @param {DrawRequest} drawRequest - Description of the draw request being processed.
 */
function applyWorldPositionUniform(renderArgs, drawRequest) {
    renderArgs.gl.uniform3fv(this.location, drawRequest.worldPosition);
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
 * Creates a uniform object that is automatically supported by the framework.
 * @param {WebGLRenderingContext} gl - The rendering context currently in use.
 * @param {string} name - The name of the uniform variable.
 * @param location
 * @param {boolean} systemUniforms - If false, system uniforms will not be created.
 * @returns {Uniform|null} The system uniform variable, or null if the system does not support it.
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
