import Vector3 from 'gl-vec3';
import Matrix4 from 'gl-mat4';

/**
 * Contains information that describes the state of the current frame being rendered.
 * @property {Matrix} projectionTransform - View to screen transform for the current rendering pipeline.
 * @property {Matrix} invViewTransform - View to world transform for the current rendering pipeline.
 * @property {Matrix} viewTransform - World to view transform for the current rendering pipeline.
 * @property {Vector3} viewPosition - World space position of the current view.
 * @property {WebGLRenderingContext} gl - The rendering context to be used for rendering.
 * @property {number} timer - Timer that increments in real-time, can be used for animation
 * @property {WebGLState} state - The state manager for the currently active WebGL context.
 * @property {Renderer} renderer - The renderer that is managing the rendering state being processed.
 * @property {DisplayPort} displayPort - The display port that is currently being rendered.
 * @property {RenderPhase} renderPhase - The render phase that is currently being rendered.
 * @property {RenderPipeline} renderPipeline - The render pipeline that is currently being rendered.
 * @property {TransformCache} transformCache - Object that may be used to allocate transforms during the frame.
 */
export default class RenderArgs {
    constructor() {
        // TODO: Maybe add a 'gameTimer' that is similar to timer, but doesn't increment when the game is paused
        // TODO: Perhaps pre-compute view * projection transform
        this.projectionTransform = Matrix4.create();
        this.invViewTransform = Matrix4.create();
        this.viewTransform = Matrix4.create();
        this.viewPosition = Vector3.create();
        this.timer = 0;
        this.gl = null;
        this.state = null;
        this.renderer = null;
        this.displayPort = null;
        this.renderPhase = null;
        this.renderPipeline = null;
        this.transformCache = null;
    }
}
