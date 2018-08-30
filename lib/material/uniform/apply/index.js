/**
 *
 * @param {RenderArgs} renderArgs
 * @param {UniformDesc} uniformDesc
 */
function applyFloat(renderArgs, uniformDesc) {
    renderArgs.gl.uniform1f(uniformDesc.location, uniformDesc.value);
}

function applyFloatVec2(renderArgs, uniformDesc) {
    renderArgs.gl.uniform2fv(uniformDesc.location, uniformDesc.value);
}

function applyFloatVec3(renderArgs, uniformDesc) {
    renderArgs.gl.uniform3fv(uniformDesc.location, uniformDesc.value);
}

function applyFloatVec4(renderArgs, uniformDesc) {
    renderArgs.gl.uniform4fv(uniformDesc.location, uniformDesc.value);
}

function applyInt(renderArgs, uniformDesc) {
    renderArgs.gl.uniform1i(uniformDesc.location, uniformDesc.value);
}

function applyIntVec2(renderArgs, uniformDesc) {
    renderArgs.gl.uniform2iv(uniformDesc.location, uniformDesc.value);
}

function applyIntVec3(renderArgs, uniformDesc) {
    renderArgs.gl.uniform3iv(uniformDesc.location, uniformDesc.value);
}

function applyIntVec4(renderArgs, uniformDesc) {
    renderArgs.gl.uniform4iv(uniformDesc.location, uniformDesc.value);
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
    }
}

/**
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 */
export function createUniformData(gl, name, location, type) {
    switch (type) {
        case gl.FLOAT:
            return new Float32Array(1);

        case gl.FLOAT_VEC2:
            return new Float32Array(2);

        case gl.FLOAT_VEC3:
            return new Float32Array(3);

        case gl.FLOAT_VEC4:
            return new Float32Array(4);

        case gl.INT:
            return new Int32Array(1);

        case gl.INT_VEC2:
            return new Int32Array(2);

        case gl.INT_VEC3:
            return new Int32Array(3);

        case gl.INT_VEC4:
            return new Int32Array(4);

        case gl.BOOL:
        case gl.BOOL_VEC2:
        case gl.BOOL_VEC3:
        case gl.BOOL_VEC4:
        case gl.FLOAT_MAT2:
        case gl.FLOAT_MAT3:
        case gl.FLOAT_MAT4:
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
    }
}
