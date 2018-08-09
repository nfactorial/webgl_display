/**
 * 4x4 Matrix implementation.
 *
 * Code based on: https://github.com/stackgl/gl-mat4
 */
export default class Matrix {
    constructor() {
        this.elements = new Float32Array(16);
    }

    copy(other) {
        this.elements[0] = other.elements[0];
        this.elements[1] = other.elements[1];
        this.elements[2] = other.elements[2];
        this.elements[3] = other.elements[3];

        this.elements[4] = other.elements[4];
        this.elements[5] = other.elements[5];
        this.elements[6] = other.elements[6];
        this.elements[7] = other.elements[7];

        this.elements[8] = other.elements[8];
        this.elements[9] = other.elements[9];
        this.elements[10] = other.elements[10];
        this.elements[11] = other.elements[11];

        this.elements[12] = other.elements[12];
        this.elements[13] = other.elements[13];
        this.elements[14] = other.elements[14];
        this.elements[15] = other.elements[15];

        return this;
    }

    /**
     * Ensures the matrix contains the identity transform.
     * @returns {Matrix} Reference to self for call chaining.
     */
    setIdentity() {
        this.elements[0] = 1.0;
        this.elements[1] = 0.0;
        this.elements[2] = 0.0;
        this.elements[3] = 0.0;

        this.elements[4] = 0.0;
        this.elements[5] = 1.0;
        this.elements[6] = 0.0;
        this.elements[7] = 0.0;

        this.elements[8] = 0.0;
        this.elements[9] = 0.0;
        this.elements[10] = 1.0;
        this.elements[11] = 0.0;

        this.elements[12] = 0.0;
        this.elements[13] = 0.0;
        this.elements[14] = 0.0;
        this.elements[15] = 1.0;

        return this;
    }

    setRotationX(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        this.elements[0] = 1.0;
        this.elements[1] = 0.0;
        this.elements[2] = 0.0;
        this.elements[3] = 0.0;

        this.elements[4] = 0.0;
        this.elements[5] = c;
        this.elements[6] = s;
        this.elements[7] = 0.0;

        this.elements[8] = 0.0;
        this.elements[9] = -s;
        this.elements[10] = c;
        this.elements[11] = 0.0;

        this.elements[12] = 0.0;
        this.elements[13] = 0.0;
        this.elements[14] = 0.0;
        this.elements[15] = 1.0;

        return this;
    }

    setRotationY(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        this.elements[0] = c;
        this.elements[1] = 0.0;
        this.elements[2] = -s;
        this.elements[3] = 0.0;

        this.elements[4] = 0.0;
        this.elements[5] = 1.0;
        this.elements[6] = 0.0;
        this.elements[7] = 0.0;

        this.elements[8] = s;
        this.elements[9] = 0.0;
        this.elements[10] = c;
        this.elements[11] = 0.0;

        this.elements[12] = 0.0;
        this.elements[13] = 0.0;
        this.elements[14] = 0.0;
        this.elements[15] = 1.0;

        return this;
    }

    setRotationZ(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        this.elements[0] = c;
        this.elements[1] = s;
        this.elements[2] = 0.0;
        this.elements[3] = 0.0;

        this.elements[4] = -s;
        this.elements[5] = c;
        this.elements[6] = 0.0;
        this.elements[7] = 0.0;

        this.elements[8] = 0.0;
        this.elements[9] = 0.0;
        this.elements[10] = 1.0;
        this.elements[11] = 0.0;

        this.elements[12] = 0.0;
        this.elements[13] = 0.0;
        this.elements[14] = 0.0;
        this.elements[15] = 1.0;

        return this;
    }

    invert(a) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            throw new Error('Matrix.invert - Supplied matrix is not invertible.');
        }
        det = 1.0 / det;

        this.elements[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.elements[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.elements[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.elements[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.elements[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.elements[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.elements[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.elements[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.elements[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.elements[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.elements[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.elements[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.elements[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.elements[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.elements[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.elements[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return this;
    }
}