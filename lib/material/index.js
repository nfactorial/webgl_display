import { CullMode, DepthCompare } from '@nfactorial/webgl_helper';

import MaterialInstance from './instance';
import { createUniform } from './uniform';

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
        this.depthComparison = DepthCompare.LessEqual;
        this.cullMode = CullMode.Back;
        this.disposed = false;
        this.depthTest = true;
        this.depthWrite = true;
        this.systemUniforms = true;
        this.sharedUniforms = [];
        this.instanceUniforms = [];
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
     * Prepares the material for use by the rendering framework.
     * @param {WebGLRenderingContext} gl - The rendering context we belong to.
     */
    initialize(gl) {
        const count = this.program.getActiveUniforms();
        for (let loop = 0; loop < count; ++loop) {
            const desc = this.program.getActiveUniform(loop);

            const uniform = createUniform(gl, this.program, desc.name, desc.type, desc.size, this.systemUniforms);
            if (uniform.shared) {
                this.sharedUniforms.push(uniform);
            } else {
                this.instanceUniforms.push(uniform);
            }
        }
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

        // Rather than clone each uniform, perhaps the instance contains a raw buffer we index into with our
        // own description. To reduce the number of allocations required.
        const count = this.instanceUniforms.length;
        for (let loop = 0; loop < count; loop++) {
            instance.uniforms.push(this.instanceUniforms[loop].clone());
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

        renderArgs.state.useProgram(this.program.id);
        renderArgs.state.enableAttributes(this.program.attributeBuffer);
        renderArgs.state.setDepthTest(this.depthTest, this.depthComparison);
        renderArgs.state.depthWrite = this.depthWrite;

        if (this.cullMode === CullMode.None) {
            renderArgs.state.setCullMode(false);
        } else if (this.cullMode === CullMode.Front) {
            renderArgs.state.setCullMode(true, renderArgs.gl.FRONT);
        } else {
            renderArgs.state.setCullMode(true, renderArgs.gl.BACK);
        }

        const count = this.sharedUniforms.length;
        for (let loop = 0; loop < count; loop++) {
            this.sharedUniforms[loop].apply(renderArgs);
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
