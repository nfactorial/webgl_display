const DEFAULT_CAPACITY = 1024;
const MATRIX_FLOATS = 16 * 4;

/**
 * Maintains a collection of transforms that are used during the rendering of a frame.
 * By default, the transform cache reserves space for 1024 transforms. This can be overridden by supplying the
 * constructor with a different capacity.
 * The allocation is fixed, this means if a title uses more transforms than has been allocated then rendering will
 * be ignored for some items. This is generally not desirable, but means there is no dynamic allocations at
 * run-time.
 * For debug/development builds it might be an idea to provide a dynamically expanding cache in the future. But that's
 * left for a time that it does indeed become necessary.
 */
export default class TransformCache {
    constructor(capacity = DEFAULT_CAPACITY) {
        this.count = 0;
        this.capacity = capacity;
        this.buffer = new Float32Array(capacity * MATRIX_FLOATS);
    }

    /**
     * Resets the transform cache so that it does not contain any allocated transforms.
     */
    flush() {
        this.count = 0;
    }

    /**
     *
     * @param {TransformRef} transformRef - Location of the allocated transform will be stored here.
     * @param {Matrix} matrix - The matrix that is to be allocated within the buffer.
     * @return {boolean} True if the transform was allocated otherwise false.
     */
    allocate(transformRef, matrix) {
        if (this.count < this.capacity) {
            const offset = this.count * MATRIX_FLOATS;

            for (let loop = 0; loop < MATRIX_FLOATS; loop++) {
                this.buffer[offset + loop] = matrix.elements[loop];
            }

            transformRef.offset = this.count * MATRIX_FLOATS;
            transformRef.buffer = this.buffer;

            this.count++;
            return true;
        }

        return false;
    }
}
