import DrawRequest from '../../draw_request';

/**
 * Maintains a collection of draw requests that are associated with a specific material.
 */
export default class MaterialDrawQueue {
    constructor() {
        this.id = '';
        this.material = null;

        this.count = 0;
        this.requestList = [];
    }

    /**
     * Prepares the object for rendering materials of the specified type.
     * @param {Material} material
     */
    initialize(material) {
        if (!material) {
            throw new Error('No material specified.');
        }

        this.id = material.id;
        this.material = material;
    }

    /**
     * Releases all resources referenced by this object.
     */
    dispose() {
        this.id = '';
        this.count = 0;
        this.material = null;
        this.requestList.length = 0;
    }

    /**
     * Removes all draw requests from this queue.
     */
    flush() {
        this.count = 0;
    }

    /**
     * Processes all draw requests contained within this draw queue.
     * @param {RenderArgs} renderArgs
     */
    execute(renderArgs) {
        this.material.onBeginRender(renderArgs);

        // We cache this locally so the JIT compiler can see its value never changes
        const count = this.count;
        if (count) {
            for (let loop = 0; loop < count; loop += 1) {
                const request = this.requestList[loop];

                this.material.commitInstanceUniforms(renderArgs, request);

                renderArgs.state.bindVertexArray(request.geometryBuffer.id);

                if (request.indexBuffer) {
                    request.indexBuffer.bind(renderArgs.state);

                    renderArgs.renderer.drawIndexedPrimitive(
                        request.primitiveType,
                        request.start,
                        request.primitiveCount,
                    );
                } else {
                    renderArgs.renderer.drawPrimitive(
                        request.primitiveType,
                        request.start,
                        request.primitiveCount,
                    );
                }
            }
        }

        this.material.onEndRender(renderArgs);
    }

    /**
     * Adds a new draw request to the queue.
     * @param {DrawRequest} drawRequest - The request to be added.
     */
    addDrawRequest(drawRequest) {
        // TODO: Copy draw request into a local copy
        if (this.count === this.requestList.length) {
            // TODO: Use a pool rather than a dynamic allocation
            this.requestList.push(new DrawRequest());
        }

        this.requestList[this.count++].copy(drawRequest);
    }
}
