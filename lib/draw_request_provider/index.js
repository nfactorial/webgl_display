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

        const self = this;
        renderPipeline.phaseList.forEach((renderPhase) => {
            const drawQueue = new RenderPhaseDrawQueue(this, renderPhase);

            // TODO: Any extra configuration here

            self.phaseQueueList.push(drawQueue);
        });
    }

    /**
     * Releases all resources currently referenced by this object.
     */
    dispose() {
        this.phaseQueueList.forEach(drawQueue => drawQueue.dispose());
        this.phaseQueueList.length = 0;
    }

    /**
     * Resets the draw request provider to ensure it is empty.
     */
    flush() {
        this.phaseQueueList.forEach(drawQueue => drawQueue.flush());
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
            // TODO: and the list is not expected to be very long.
            const count = this.phaseQueueList.length;
            for (let loop = 0; loop < count; ++loop) {
                if (this.phaseQueueList[loop].id === drawRequest.materialInstance.phase) {
                    this.phaseQueueList[loop].addRequest(drawRequest);
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
        this.phaseQueueList.forEach(drawQueue => drawQueue.execute(renderArgs));
    }
}
