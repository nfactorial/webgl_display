import DrawCommand from './draw_command';

import Matrix4 from 'gl-mat4';
import Vector3 from 'gl-vec3';

/**
 * Represents a single request for rendering of an item with an associated transform, vertex and index buffer.
 *
 * @property {BaseBuffer} indexBuffer - The WebGL buffer containing the indices to be rendered. May be null.
 * @property {BaseBuffer} vertexBuffer - The WebGL buffer containing the vertex information to be rendered.
 * @property {Matrix4} worldTransform - Object transform from local to world space.
 * @property {Vector3} worldPosition - Position of the object in world space.
 */
export default class DrawRequest extends DrawCommand {
    constructor() {
        super();

        this.geometryBuffer = null;
        this.indexBuffer = null;
        this.worldTransform = Matrix4.create();
        this.worldPosition = Vector3.create();
    }

    /**
     * Copies the content of another DrawRequest instance into this one.
     * @param {DrawRequest} other - The DrawRequest instance that is to be copied.
     * @returns {DrawRequest} Reference to self to allow for call chaining.
     */
    copy(other) {
        super.copy(other);

        this.geometryBuffer = other.geometryBuffer;
        this.indexBuffer = other.indexBuffer;
        Matrix4.copy(this.worldTransform, other.worldTransform);
        Vector3.copy(this.worldPosition, other.worldPosition);

        return this;
    }
}
