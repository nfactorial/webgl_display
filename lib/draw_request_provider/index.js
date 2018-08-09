import RenderPhaseDrawQueue from './render_phase_draw_queue';

/**
 * This class maintains a collection of all draw requests made by the application for a single rendered frame.
 *
 * Future
 * ======
 * In the future, we should provide methods for draw requests that contain multiple geometric renders. Allowing for
 * a title to submit all static instances in a single call. This will probably take the form of some 'StaticDrawRequest'
 * or other. This object should manage its list so that all objects of the same material are already collected together.
 */
export default class DrawRequestProvider {
    constructor() {
        // TODO: The transform array may be shared from another module
        this.transformCount = 0;
        this.transformCapacity = 1024;
        this.transformArray = new Float32Array(16*4*1024);

        this.phaseQueueList = [];

    }

    /**
     * Prepares this object for accepting draw requests related to the specified render pipeline.
     * @param {RenderPipeline} renderPipeline - The render pipeline we will be collecting draw requests for.
     */
    initialize(renderPipeline) {
        if (!renderPipeline) {
            throw new Error('No render pipeline specified for draw request provider.');
        }

        for (const renderPhase of renderPipeline.phaseList) {
            const drawQueue = new RenderPhaseDrawQueue(this, renderPhase);

            this.phaseQueueList.push(drawQueue);
        }
    }

    /**
     * Releases all resources currently referenced by this object.
     */
    dispose() {
        for (const drawQueue of this.phaseQueueList) {
            drawQueue.dispose();
        }

        this.phaseQueueList.length = 0;
    }

    /**
     * Resets the draw request provider to ensure it is empty.
     */
    flush() {
        for (const drawQueue of this.phaseQueueList) {
            drawQueue.flush();
        }
    }

    /**
     * Adds a draw request to the rendering framework for this frame.
     * @param {DrawRequest} drawRequest - The draw request to be added.
     * @returns {DrawRequestProvider} Reference to self to allow for call chaining.
     */
    addRequest(drawRequest) {
        if (!drawRequest) {
            throw new Error('No draw request specified.');
        }

        if (drawRequest.materialInstance) {
            // TODO: It might be faster to use a map, however we are doing just a single comparison
            // TODO: and the list is not expected to be too long.
            for (const drawQueue of this.phaseQueueList) {
                if (drawQueue.id === drawRequest.materialInstance.phase) {
                    drawQueue.addRequest(drawRequest);
                    return this;
                }
            }
        }

        return this;
    }

    /**
     * Performs all rendering stored within this provider.
     * TODO: It may be better to move the execution externally
     * @param {RenderArgs} renderArgs
     */
    execute(renderArgs) {
        for (const drawQueue of this.phaseQueueList) {
            drawQueue.execute(renderArgs);
        }
    }
}
