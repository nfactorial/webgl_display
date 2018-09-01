import RenderPhase from '../render_phase';

/**
 * Maintain a list of render phases that are used to produce the final output of a display port.
 */
export default class RenderPipeline {
    constructor(desc) {
        if (!desc) {
            throw new Error('No pipeline description provided.');
        }

        this.name = '';
        this.passList = [];

        if (desc.pass) {
            const count = desc.pass.length;
            for (let loop = 0; loop < count; loop++) {
                this.passList.push(new RenderPhase(desc.pass[loop]));
            }
        }
    }

    /**
     * Processes all render operations for this render pipeline.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    execute(renderArgs) {
        const count = this.passList.length;
        for (let loop = 0; loop < count; loop++) {
            this.passList[loop].onBeginRender(renderArgs);
            this.passList[loop].execute(renderArgs);
            this.passList[loop].onEndRender();
        }
    }
}
