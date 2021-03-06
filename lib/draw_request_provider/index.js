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
        this.renderer = null;

        this.renderPipeline = null;
        this.phaseQueueList = [];
    }

    /**
     * Gets the rendering context currently in use.
     * @returns {WebGLRenderingContext}
     */
    get context() {
        return this.renderer.context;
    }

    /**
     * Prepares this object for accepting draw requests related to the specified render pipeline.
     * @param {Renderer} renderer - The renderer we belong to.
     * @param {RenderPipeline} renderPipeline - The render pipeline we will be collecting draw requests for.
     */
    initialize(renderer, renderPipeline) {
        if (!renderer) {
            throw new Error('No renderer was specified.');
        }

        if (!renderPipeline) {
            throw new Error('No render pipeline specified for draw request provider.');
        }

        if (renderPipeline !== this.renderPipeline) {
            this.dispose();

            this.renderer = renderer;

            const count = renderPipeline.phaseList.length;
            for (let loop = 0; loop < count; loop++) {
                this.phaseQueueList.push(new RenderPhaseDrawQueue(renderPipeline.phaseList[loop]));
            }

            this.renderPipeline = renderPipeline;
        }
    }

    /**
     * Releases all resources currently referenced by this object.
     */
    dispose() {
        this.phaseQueueList.forEach(drawQueue => drawQueue.dispose());
        this.phaseQueueList.length = 0;
        this.renderPipeline = null;
        this.renderer = null;
    }

    /**
     * Resets the draw request provider to ensure it is empty.
     */
    flush() {
        const count = this.phaseQueueList.length;
        for (let loop = 0; loop < count; loop++) {
            this.phaseQueueList[loop].flush();
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

        if (drawRequest.material && drawRequest.primitiveCount > 0) {
            // TODO: It might be faster to use a map, however we are doing just a single comparison
            // TODO: and the list is not expected to be very long.
            const count = this.phaseQueueList.length;
            for (let loop = 0; loop < count; ++loop) {
                if (this.phaseQueueList[loop].id === drawRequest.material.phase) {
                    this.phaseQueueList[loop].addDrawRequest(drawRequest);
                    return this;
                }
            }
        }

        return this;
    }

    /**
     * Performs all rendering stored within this provider.
     * TODO: It may be better to move the execution externally
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    execute(renderArgs) {
        renderArgs.gl.viewport(
            renderArgs.viewportInfo.x,
            renderArgs.viewportInfo.y,
            renderArgs.viewportInfo.width,
            renderArgs.viewportInfo.height,
        );

        renderArgs.gl.enable(renderArgs.gl.SCISSOR_TEST);
        renderArgs.gl.scissor(
            renderArgs.viewportInfo.x,
            renderArgs.viewportInfo.y,
            renderArgs.viewportInfo.width,
            renderArgs.viewportInfo.height,
        );

        for (let loop = 0, len = this.phaseQueueList.length; loop < len; loop++) {
            this.phaseQueueList[loop].execute(renderArgs);
        }

        renderArgs.gl.disable(renderArgs.gl.SCISSOR_TEST);
    }
}
