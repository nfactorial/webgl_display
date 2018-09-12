/**
 *
 * @param {RenderArgs} renderArgs
 */
function applyFloat(renderArgs) {
    renderArgs.gl.uniform1f(this.location, this.value);
}

function applyFloatVec2(renderArgs) {
    renderArgs.gl.uniform2fv(this.location, this.value);
}

function applyFloatVec3(renderArgs) {
    renderArgs.gl.uniform3fv(this.location, this.value);
}

function applyFloatVec4(renderArgs) {
    renderArgs.gl.uniform4fv(this.location, this.value);
}

function applyInt(renderArgs) {
    renderArgs.gl.uniform1i(this.location, this.value);
}

function applyIntVec2(renderArgs) {
    renderArgs.gl.uniform2iv(this.location, this.value);
}

function applyIntVec3(renderArgs) {
    renderArgs.gl.uniform3iv(this.location, this.value);
}

function applyIntVec4(renderArgs) {
    renderArgs.gl.uniform4iv(this.location, this.value);
}

function applySampler2D(renderArgs) {
    renderArgs.state.bindTexture2D(0, this.value); // TODO: Increment texture index
    renderArgs.gl.uniform1i(this.location, 0);
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

        case gl.SAMPLER_2D:
            return applySampler2D;

        case gl.BOOL:
        case gl.BOOL_VEC2:
        case gl.BOOL_VEC3:
        case gl.BOOL_VEC4:
        case gl.FLOAT_MAT2:
        case gl.FLOAT_MAT3:
        case gl.FLOAT_MAT4:
        case gl.SAMPLER_CUBE:
        default:
            throw new Error('Not implemented yet.');
    }
}
