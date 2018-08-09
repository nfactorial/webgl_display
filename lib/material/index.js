import MaterialInstance from './instance';
import {createSharedUniform} from './shared_uniform';

/**
 * Describes how a collection of primitives should be rendered.
 *
 * The running application does not use materials directly, instead it uses a Material instance.
 * Materials contains two types of uniform values, shared and instanced.
 *
 * During rendering, the title supplies the material instance to be used for rendering. The rendering pipeline gathers
 * all instances that use the same base material together.
 *
 * Once all draw requests have been gathered, the rendering engine then visits each gathered material. It applies the
 * shared uniform values once, when it begins rendering a list of instances. The commits the values for the instances
 * themselves.
 *
 * This allows us to use the same material but change some parameters on a per-instance basis.
 */
export default class Material {
    constructor() {
        this.id = '';
        this.phase = '';
        this.program = null;
        this.depthRead = true;
        this.disposed = false;
        this.depthWrite = true;
        this.sharedUniforms = {};
        this.instanceUniforms = {};
    }

    /**
     * Releases all resources referenced by this object.
     */
    dispose() {
        if (this.disposed) {
            throw new Error('Material disposed multiple times.');
        }

        this.disposed = true;

        if (this.program) {
            this.program.dispose();
            this.program = null;
        }

        this.sharedUniforms.length = 0;
        this.instanceUniforms.length = 0;
    }

    /**
     * Creates a new MaterialInstance that references this material.
     * @returns {MaterialInstance} A MaterialInstance object that references this material.
     */
    createInstance() {
        if (this.disposed) {
            throw new Error('Cannot create instance of disposed material.');
        }

        const instance = new MaterialInstance();

        instance.material = this;
        if (this.instanceUniforms) {
            // instance.instanceUniforms = Object.assign({}, this.instanceUniforms);    // TODO: Create each uniform
        }

        return instance;
    }

    /**
     * Called by the framework when a rendering operation is about to begin using this material.
     * Configures the rendering pipeline for this material and also sets the shared uniform values.
     * @param {RenderArgs} renderArgs - Description of the current rendering pipeline.
     */
    onBeginRender(renderArgs) {
        if (this.disposed) {
            throw new Error('Cannot render disposed material.');
        }

        renderArgs.state.useProgram(this.program ? this.program.id : null);
        renderArgs.state.depthRead = this.depthRead;
        renderArgs.state.depthWrite = this.depthWrite;

        for (const sharedUniform of this.sharedUniforms) {
            sharedUniform.apply(renderArgs, sharedUniform);
        }
    }

    /**
     * Called by the framework when a rendering operation that used this material has completed.
     * @param {RenderArgs} renderArgs - Description of the current rendering pipeline.
     */
    onEndRender(renderArgs) {
        // TODO: Disable any global state
    }
}
