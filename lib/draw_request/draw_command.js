import * as WebGLHelper from '@nfactorial/webgl_helper';

/**
 * Defines a basic draw operation that has no associated transforms.
 *
 * @property {Material} material - The material to be used for rendering.
 * @property {number} primitiveType - The type of primitive type be rendered.
 * @property {number} start - For indexed data, this is an offset into the index buffer for the first index to be used.
 *                            For non-indexed data, this is the index of the first vertex to be used.
 * @property {number} primitiveCount - The number of primitives to be rendered.
 */
export default class DrawCommand {
    constructor() {
        this.material = null;
        this.primitiveType = WebGLHelper.PrimitiveType.TriangleList;
        this.start = 0;
        this.primitiveCount = 0;
    }

    /**
     * Copies the content of another DrawRequest instance into this one.
     * @param {DrawCommand} other - The DrawRequest instance that is to be copied.
     * @returns {DrawCommand} Reference to self to allow for call chaining.
     */
    copy(other) {
        this.material = other.material;
        this.primitiveType = other.primitiveType;
        this.start = other.start;
        this.primitiveCount = other.primitiveCount;

        return this;
    }
}
