import * as WebGLHelper from '@nfactorial/webgl_helper';

import Matrix4 from 'gl-mat4';
import Vector3 from 'gl-vec3';

/**
 * Represents a single request for rendering of an item.
 *
 * @property {BaseBuffer} indexBuffer - The WebGL buffer containing the indices to be rendered. May be null.
 * @property {BaseBuffer} vertexBuffer - The WebGL buffer containing the vertex information to be rendered.
 * @property {number} primitiveType - The type of primitive type be rendered.
 * @property {number} primitiveCount - The number of primitives to be rendered.
 * @property {number} start - For indexed data, this is an offset into the index buffer for the first index to be used.
 *                            For non-indexed data, this is the index of the first vertex to be used.
 * @property {Material} material - The material to be used for rendering.
 */
export default class DrawRequest {
    constructor() {
        this.worldTransform = Matrix4.create();
        this.worldPosition = Vector3.create();
        this.material = null;
        this.indexBuffer = null;
        this.vertexBuffer = null;
        this.primitiveType = WebGLHelper.PrimitiveType.TriangleList;
        this.start = 0;
        this.primitiveCount = 0;
    }

    /**
     * Copies the content of another DrawRequest instance into this one.
     * @param {DrawRequest} other - The DrawRequest instance that is to be copied.
     * @returns {DrawRequest} Reference to self to allow for call chaining.
     */
    copy(other) {
        Matrix4.copy(this.worldTransform, other.worldTransform);
        Vector3.copy(this.worldPosition, other.worldPosition);
        this.material = other.material;
        this.indexBuffer = other.indexBuffer;
        this.vertexBuffer = other.vertexBuffer;
        this.primitiveType = other.primitiveType;
        this.start = other.start;
        this.primitiveCount = other.primitiveCount;

        return this;
    }
}
