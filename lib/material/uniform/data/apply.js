/**
 *
 * @param {RenderArgs} renderArgs
 * @param {Uniform} uniform
 */
function applyFloat(renderArgs, uniform) {
    renderArgs.gl.uniform1f(uniform.location, uniform.value);
}

function applyFloatVec2(renderArgs, uniform) {
    renderArgs.gl.uniform2fv(uniform.location, uniform.value);
}

function applyFloatVec3(renderArgs, uniform) {
    renderArgs.gl.uniform3fv(uniform.location, uniform.value);
}

function applyFloatVec4(renderArgs, uniform) {
    renderArgs.gl.uniform4fv(uniform.location, uniform.value);
}

function applyInt(renderArgs, uniform) {
    renderArgs.gl.uniform1i(uniform.location, uniform.value);
}

function applyIntVec2(renderArgs, uniform) {
    renderArgs.gl.uniform2iv(uniform.location, uniform.value);
}

function applyIntVec3(renderArgs, uniform) {
    renderArgs.gl.uniform3iv(uniform.location, uniform.value);
}

function applyIntVec4(renderArgs, uniform) {
    renderArgs.gl.uniform4iv(uniform.location, uniform.value);
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @returns {function}
 */
export function getApplyUniformMethod(gl, type) {
    switch (type) {
        case gl.FLOAT:
            return applyFloat;

        case gl.FLOAT_VEC2:
            return applyFloatVec2;

        case gl.FLOAT_VEC3:
            return applyFloatVec3;

        case gl.FLOAT_VEC4:
            return applyFloatVec4;

        case gl.INT:
            return applyInt;

        case gl.INT_VEC2:
            return applyIntVec2;

        case gl.INT_VEC3:
            return applyIntVec3;

        case gl.INT_VEC4:
            return applyIntVec4;

        case gl.BOOL:
        case gl.BOOL_VEC2:
        case gl.BOOL_VEC3:
        case gl.BOOL_VEC4:
        case gl.FLOAT_MAT2:
        case gl.FLOAT_MAT3:
        case gl.FLOAT_MAT4:
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
        default:
            throw new Error('Not implemented yet.');
    }
}
