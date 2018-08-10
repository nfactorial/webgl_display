import MaterialDrawQueue from '../material_draw_queue';

/**
 * Maintains a collection of draw requests that are associated with a single render phase.
 */
export default class RenderPhaseDrawQueue {
    constructor(renderPhase) {
        if (!renderPhase) {
            throw new Error('No render phase was supplied.');
        }

        this.renderPhase = renderPhase;
        this.materialMap = new Map();
    }

    /**
     * Releases all resources currently referenced by this draw queue.
     */
    dispose() {
        // TODO: Check performance of values(). Probably a generator function,
        // TODO: but should check we don't need a second array
        for (const materialQueue of this.materialMap.values()) {
            materialQueue.dispose();
        }

        this.materialMap.clear();
        this.renderPhase = null;
    }

    /**
     * Removes all queued draw requests from this object.
     */
    flush() {
        for (const materialQueue of this.materialMap.values()) {
            materialQueue.flush();
        }
    }

    /**
     *
     * @param {DrawRequest} drawRequest
     */
    addDrawRequest(drawRequest) {
        let queue = this.materialMap.get(drawRequest.materialInstance.id);
        if (!queue) {
            // TODO: Use a pool, not a dynamic allocation
            queue = new MaterialDrawQueue();
            queue.initialize(drawRequest.materialInstance.material);

            this.materialMap.set(drawRequest.materialInstance.id, queue);
        }

        queue.addDrawRequest(drawRequest);
    }

    /**
     * Processes all queued draw operations contained in this queue.
     * @param {RenderArgs} renderArgs
     */
    execute(renderArgs) {
        this.renderPhase.onBeginRender(renderArgs);

        for (const queue of this.materialMap.values()) {
            queue.execute(renderArgs);
        }

        this.renderPhase.onEndRender(renderArgs);
    }
}
