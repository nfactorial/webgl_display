import RenderPhase from '../render_phase';

/**
 * Maintain a list of render phases that are used to produce the final output of a display port.
 */
export default class RenderPipeline {
    constructor(desc) {
        if (!desc) {
            throw new Error('No description was provided.');
        }

        this.name = '';
        this.phaseList = [];

        if (desc.phase) {
            for (const phaseDesc of desc.phase) {
                this.phaseList.push(new RenderPhase(phaseDesc));
            }
        }
    }

    /**
     * Processes all render operations for this render pipeline.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    execute(renderArgs) {
        for (const renderPhase of this.phaseList) {
            renderPhase.onBeginRender(renderArgs);

            renderPhase.execute(renderArgs);

            renderPhase.onEndRender(renderArgs);
        }
    }
}
