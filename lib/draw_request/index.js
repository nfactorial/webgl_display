import * as WebGLHelper from '@nfactorial/webgl_helper';

/**
 * Represents a single request for rendering of an item.
 *
 * @property {BaseBuffer} indexBuffer - The WebGL buffer containing the indices to be rendered. May be null.
 * @property {BaseBuffer} vertexBuffer - The WebGL buffer containing the vertex information to be rendered.
 * @property {number} primitiveType - The type of primitive type be rendered.
 * @property {number} primitiveCount - The number of primitives to be rendered.
 * @property {MaterialInstance} materialInstance - The material instance to be used for rendering.
 */
export default class DrawRequest {
    constructor() {
        this.indexBuffer = null;
        this.vertexBuffer = null;
        this.primitiveType = WebGLHelper.PrimitiveType.TriangleList;
        this.primitiveCount = 0;
        this.materialInstance = null;
    }
}
