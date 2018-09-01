import DrawRequest from '../../draw_request';

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
            this.requestList.push(new DrawRequest());
        }

        this.requestList[this.count++].copy(drawRequest);
    }

    execute(renderArgs) {
        if (this.count) {
            const uniformCount = this.materialInstance.uniforms.length;

            const count = this.requestList.length;
            for (let loop = 0; loop < count; loop++) {
                const request = this.requestList[loop];

                // Commit the per-instance uniform values
                for (let uniform = 0; uniform < uniformCount; uniform++) {
                    this.materialInstance.uniforms[uniform].apply(
                        renderArgs,
                        request,
                    );
                }

                renderArgs.state.bindArrayBuffer(request.vertexBuffer.id);

                if (request.indexBuffer) {
                    renderArgs.state.bindElementArrayBuffer(request.indexBuffer.id);

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
    }
}
