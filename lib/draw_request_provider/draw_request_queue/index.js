import RequestStore from './request_store';

/**
 * Render queue that contains the draw requests to be issued to the rendering context.
 */
export default class DrawRequestQueue {
    constructor() {
        this.materialInstance = null;

        this.count = 0;
        this.requestList = [];
    }

    initialize(materialInstance) {
        this.materialInstance = materialInstance;
    }

    /**
     * Resets the content of this queue so that it has no pending render operations.
     */
    flush() {
        this.count = 0;
        this.materialInstance = null;
    }

    /**
     *
     * @param {DrawRequest} drawRequest
     */
    addDrawRequest(drawRequest) {
        if (drawRequest.materialInstance !== this.materialInstance) {
            throw new Error('Material instance mismatch.');
        }

        // TODO: Copy draw request into a local copy
        if (this.count === this.requestList.length) {
            // TODO: Use a pool rather than a dynamic allocation
            const store = new RequestStore();
            this.requestList.push(store);
        }

        this.requestList[this.count++].copyDrawRequest(drawRequest);
    }

    execute(renderArgs) {
        if (this.count) {
            // TODO: Apply per-instance material uniforms
            // this.materialInstance.applyInstanceUniforms(renderArgs, drawRequest);

            for (let loop = 0; loop < this.count; loop++) {
                const request = this.requestList[loop];

                renderArgs.state.bindArrayBuffer(request.vertexBuffer.id);

                if (request.indexBuffer) {
                    renderArgs.state.bindElementArrayBuffer(request.indexBuffer.id);

                    renderArgs.renderer.drawIndexedPrimitive(
                        request.primitiveType,
                        request.start,
                        request.primitiveCount
                    );
                } else {
                    renderArgs.renderer.drawPrimitive(
                        request.primitiveType,
                        request.start,
                        request.primitiveCount
                    );
                }
            }
        }
    }
}