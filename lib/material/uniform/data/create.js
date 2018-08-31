function createFloat() {
    return new Float32Array(1);
}

function createFloat2() {
    return new Float32Array(2);
}

function createFloat3() {
    return new Float32Array(3);
}

function createFloat4() {
    return new Float32Array(4);
}

function createInt() {
    return new Int32Array(1);
}

function createInt2() {
    return new Int32Array(2);
}

function createInt3() {
    return new Int32Array(3);
}

function createInt4() {
    return new Int32Array(4);
}
/**
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 */
export function getUniformDataCreator(gl, type) {
    switch (type) {
        case gl.FLOAT:
            return createFloat;

        case gl.FLOAT_VEC2:
            return createFloat2;

        case gl.FLOAT_VEC3:
            return createFloat3;

        case gl.FLOAT_VEC4:
            return createFloat4;

        case gl.INT:
            return createInt;

        case gl.INT_VEC2:
            return createInt2;

        case gl.INT_VEC3:
            return createInt3;

        case gl.INT_VEC4:
            return createInt4;

        case gl.BOOL:
        case gl.BOOL_VEC2:
        case gl.BOOL_VEC3:
        case gl.BOOL_VEC4:
        case gl.FLOAT_MAT2:
        case gl.FLOAT_MAT3:
        case gl.FLOAT_MAT4:
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            throw new Error('Not implemented yet.');
    }
}
