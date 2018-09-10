import RenderPhase from '../render_phase';

/**
 * Maintain a list of render phases that are used to produce the final output of a display port.
 *
 * A render pipeline is constructed through multiple render phases.
 * Each render phase is executed in-turn.
 * When a draw request is made, the draw request is assigned to the render phase specified in its material.
 *
 * Render phases may also contain generator objects, generators are objects that output a result to an entire
 * render target.
 *
 */
export default class RenderPipeline {
    constructor(desc) {
        if (!desc) {
            throw new Error('No pipeline description provided.');
        }

        this.name = '';
        this.phaseList = [];

        if (desc.phase) {
            const count = desc.phase.length;
            for (let loop = 0; loop < count; loop++) {
                this.phaseList.push(new RenderPhase(desc.phase[loop]));
            }
        }
    }

    /**
     * Discards all resources referenced by this object.
     */
    dispose() {
        const count = this.phaseList.length;
        for (let loop = 0; loop < count; loop++) {
            this.phaseList[loop].dispose();
        }

        this.phaseList.length = 0;
    }

    /**
     * Processes all render operations for this render pipeline.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    execute(renderArgs) {
        const count = this.phaseList.length;
        for (let loop = 0; loop < count; loop++) {
            this.phaseList[loop].onBeginRender(renderArgs);
            this.phaseList[loop].execute(renderArgs);
            this.phaseList[loop].onEndRender();
        }
    }
}
