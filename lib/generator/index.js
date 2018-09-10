import { InvalidFrameBufferId } from '@nfactorial/webgl_helper';

/**
 * Generators provide output that covers the entire target area.
 *
 * Generators accept a number of input resources. Input resources are named within the shader
 * alphabetically. Such as resourceA, resourceB, resourceC etc.
 */
export default class Generator {
    constructor() {
        this.frameBuffer = InvalidFrameBufferId;
        this.resources = 0;
        this.material = 0;
    }

    /**
     * Discards all resources currently allocated by this object.
     */
    dispose() {
    }

    /**
     * Performs the rendering operations contained within this object.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    execute(renderArgs) {
        renderArgs.bindFrameBuffer(this.frameBuffer);

        this.material.onBeginRender(renderArgs);

        // TODO: Draw full screen polygon

        this.material.onEndRender();
    }
}
