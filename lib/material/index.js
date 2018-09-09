import { createUniform } from './uniform';
import { CullMode, DepthCompare } from '@nfactorial/webgl_helper';

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
 *
 * Material instances are not concrete yet, when used it feels like an additional un-necessary layer.
 * However, I do like the separation of shared uniforms and instance uniforms. The main goal was for materials to be
 * able to share shaders and programs. Which I still would like to support.
 *
 * Currently, there are a few options I am considering.
 *
 * 1) Remove material instances. Only use materials.
 * 2) Materials may, themselves, inherit from other materials. With their own uniform values.*
 * 3) Shaders and programs are created via a factory, allowing different materials to share the same shaders and programs.
 * 4) Extract materials from the webgl_display module, and move into their own module. This allows different implementations to be written.
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
        this.uniformMap = {};
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
        this.uniformMap = {};

        const count = this.program.getActiveUniforms();
        for (let loop = 0; loop < count; ++loop) {
            const desc = this.program.getActiveUniform(loop);

            const uniform = createUniform(gl, this.program, desc.name, desc.type, desc.size, this.systemUniforms);
            if (uniform.shared) {
                this.sharedUniforms.push(uniform);
            } else {
                this.instanceUniforms.push(uniform);
            }
            this.uniformMap[uniform.name] = uniform;
        }
    }

    /**
     * Retrieves an object that contains each uniform available within the material.
     * @returns {object} Object containing each uniform used by the material.
     */
    get uniforms() {
        return this.uniformMap;
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

        this.commitSharedUniforms(renderArgs);
    }

    /**
     * Called by the framework when a rendering operation that used this material has completed.
     * @param {RenderArgs} renderArgs - Description of the current rendering pipeline.
     */
    onEndRender(renderArgs) {
        // TODO: Disable any global state
    }

    /**
     * Commits all uniforms that are shared across all instances to the current render context.
     * @param {RenderArgs} renderArgs - Description of the current frame being processed.
     */
    commitSharedUniforms(renderArgs) {
        const count = this.sharedUniforms.length;
        for (let loop = 0; loop < count; loop++) {
            this.sharedUniforms[loop].apply(renderArgs);
        }
    }

    /**
     * Commits all uniforms that use data from the rendered instance to the current render context.
     * @param {RenderArgs} renderArgs - Description of the current frame being processed.
     * @param {DrawRequest} drawRequest - The geometry instance being rendered.
     */
    commitInstanceUniforms(renderArgs, drawRequest) {
        const count = this.instanceUniforms.length;
        for (let loop = 0; loop < count; loop++) {
            this.instanceUniforms[loop].apply(renderArgs, drawRequest);
        }
    }
}
