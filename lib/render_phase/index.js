/**
 * The rendering of a scene is split into several phases, where each phase is represented by a RenderPhase object.
 *
 */
export default class RenderPhase {
    constructor(desc) {
        if (!desc) {
            throw new Error('No render phase description provided.');
        }

        this.name = desc.name;
        this.targetName = desc.target;
        this.generators = [];
    }

    /**
     * Called just before rendering begins for this phase, allows the phase to configure render states that are
     * shared between all rendered instances.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    onBeginRender(renderArgs) {

    }

    /**
     * Called after rendering has finished, allows the render phase to perform any necessary cleanup.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    onEndRender(renderArgs) {

    }

    /**
     * Processes all rendering operations for this phase.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    execute(renderArgs) {

    }
}
