import * as WebGLHelper from '@nfactorial/webgl_helper';

const DEFAULT_CLEAR_DEPTH = 1;
const DEFAULT_CLEAR_STENCIL = 0;
const DEFAULT_CLEAR_COLOR = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
};

/**
 * If the user sets the clearDebug flag in a render-phase, we switch the clear colors of the display between red
 * and green each frame. This allows the developer to easily see any areas that are not cleared properly.
 */
const DEBUG_CLEAR_COLORS = [
    {
        r: 1,
        g: 0,
        b: 0,
        a: 1,
    },
    {
        r: 0,
        g: 1,
        b: 0,
        a: 1,
    },
];

/**
 * The rendering of a scene is split into several phases, where each phase is represented by a RenderPhase object.
 * RenderPhases are described within the pipeline definition.
 */
export default class RenderPhase {
    constructor(desc) {
        if (!desc) {
            throw new Error('No render phase description provided.');
        }

        this._debugFrame = 0;

        this._frameBuffer = WebGLHelper.InvalidFrameBufferId;

        this._clearFlags = {
            color: false,
            depth: false,
            stencil: false,
        };

        this.name = desc.name;
        this.targetName = desc.target;
        this.generators = [];
        this.clearDebug = false;
        this.clearDepth = DEFAULT_CLEAR_DEPTH;
        this.clearStencil = DEFAULT_CLEAR_STENCIL;
        this.clearColor = {
            r: DEFAULT_CLEAR_COLOR.r,
            g: DEFAULT_CLEAR_COLOR.g,
            b: DEFAULT_CLEAR_COLOR.b,
            a: DEFAULT_CLEAR_COLOR.a,
        };

        // We allow the clear flags to be implied by the presence of the values in the phase description
        if (typeof desc.clearColor === 'object') {
            this._clearFlags.color = true;

            this.clearColor.r = typeof desc.clearColor.r === 'number' ? desc.clearColor.r : DEFAULT_CLEAR_COLOR.r;
            this.clearColor.g = typeof desc.clearColor.g === 'number' ? desc.clearColor.g : DEFAULT_CLEAR_COLOR.g;
            this.clearColor.b = typeof desc.clearColor.b === 'number' ? desc.clearColor.b : DEFAULT_CLEAR_COLOR.b;
            this.clearColor.a = typeof desc.clearColor.a === 'number' ? desc.clearColor.a : DEFAULT_CLEAR_COLOR.a;
        }

        if (typeof desc.clearDepth === 'number') {
            this.clearDepth = desc.clearDepth;
            this._clearFlags.depth = true;
        }

        if (typeof desc.clearStencil === 'number') {
            this.clearStencil = desc.clearStencil;
            this._clearFlags.stencil = true;
        }

        // However, we allow any implied settings to be overridden by the description. In-case we were wrong.
        if (typeof desc.clearFlags === 'object') {
            if (typeof desc.clearFlags.color === 'boolean') {
                this._clearFlags.color = desc.clearFlags.color;
            }

            if (typeof desc.clearFlags.depth === 'boolean') {
                this._clearFlags.depth = desc.clearFlags.depth;
            }

            if (typeof desc.clearFlags.stencil === 'boolean') {
                this._clearFlags.stencil = desc.clearFlags.stencil;
            }
        }
    }

    /**
     * Retrieves the FrameBuffer object associated with this render phase.
     * @returns {FrameBuffer} The frame buffer object the render phase expects rendering operations to target.
     */
    get frameBuffer() {
        return this._frameBuffer;
    }

    /**
     * Configures which buffers are cleared before this render phase performs its operations.
     * @param {boolean} clearColor - If true, the color buffer will be cleared before rendering.
     * @param {boolean} clearDepth - If true, the depth buffer will be cleared before rendering.
     * @param {boolean} clearStencil - If true, the stencil buffer will be cleared before rendering.
     * @returns {RenderPhase} Reference to self, to allow for call chaining.
     */
    setClearFlags(clearColor = false, clearDepth = false, clearStencil = false) {
        this._clearFlags.color = clearColor;
        this._clearFlags.depth = clearDepth;
        this._clearFlags.stencil = clearStencil;

        return this;
    }

    /**
     * Called just before rendering begins for this phase, allows the phase to configure render states that are
     * shared between all rendered instances.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    onBeginRender(renderArgs) {
        renderArgs.bindFrameBuffer(this._frameBuffer);

        const clearFlags = (renderArgs.gl.COLOR_BUFFER_BIT * this._clearFlags.color)
            | (renderArgs.gl.DEPTH_BUFFER_BIT * this._clearFlags.depth)
            | (renderArgs.gl.STENCIL_BUFFER_BIT * this._clearFlags.stencil);

        if (clearFlags) {
            if (this.clearDebug) {
                this._debugFrame ^= 0x01;

                renderArgs.state.setClearColor(
                    DEBUG_CLEAR_COLORS[this._debugFrame].r,
                    DEBUG_CLEAR_COLORS[this._debugFrame].g,
                    DEBUG_CLEAR_COLORS[this._debugFrame].b,
                    DEBUG_CLEAR_COLORS[this._debugFrame].a,
                );
            } else {
                renderArgs.state.setClearColor(
                    this.clearColor.r,
                    this.clearColor.g,
                    this.clearColor.b,
                    this.clearColor.a,
                );
            }

            renderArgs.state.clearDepth = this.clearDepth;
            renderArgs.state.clearStencil = this.clearStencil;
            renderArgs.gl.clear(clearFlags);
        }
    }

    /**
     * Called after rendering has finished, allows the render phase to perform any necessary cleanup.
     * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
     */
    onEndRender(renderArgs) {
        const count = this.generators.length;
        for (let loop = 0; loop < count; ++loop) {
            this.generators[loop].execute(renderArgs);
        }
    }
}
