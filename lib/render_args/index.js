import Vector3 from 'gl-vec3';
import Matrix4 from 'gl-mat4';
import { CameraType } from '../camera_args';
import { InvalidFrameBufferId } from '@nfactorial/webgl_helper';

/**
 * @typedef {object} SurfaceInfo
 * @property {number} width - The width of the surface (in pixels).
 * @property {number} height - The height of the surface (in pixels).
 */

/**
 * @typedef {object} ViewportInfo
 * @property {number} x - Distance along the horizontal axis where the viewport is located.
 * @property {number} y - Distance along the vertical axis where the viewport located.
 * @property {number} width - Length of the viewports horizontal axis.
 * @property {number} height - Length of the viewports vertical axis.
 */

/**
 * Contains information that describes the state of the current frame being rendered.
 * @property {Matrix4} projectionTransform - View to screen transform for the current rendering pipeline.
 * @property {Matrix4} invViewTransform - View to world transform for the current rendering pipeline.
 * @property {Matrix4} viewTransform - World to view transform for the current rendering pipeline.
 * @property {Vector3} viewPosition - World space position of the current view.
 * @property {SurfaceInfo} displayInfo - Properties related to the current display.
 * @property {SurfaceInfo} targetInfo - Properties related to the current render target.
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
        this.displayInfo = {
            width: 0,
            height: 0,
        };
        this.targetInfo = {
            width: 0,
            height: 0,
        };
        this.viewportInfo = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        this.timer = 0;
        this.gl = null;
        this.state = null;
        this.renderer = null;
        this.displayPort = null;
        this.renderPhase = null;
        this.renderPipeline = null;
        this.transformCache = null;
    }

    /**
     * Configures the rendering pipeline to output results to the specified frame buffer object.
     * @param {FrameBuffer} frameBuffer - The Frame buffer rendering should be output to.
     */
    bindFrameBuffer(frameBuffer) {
        const id = frameBuffer ? frameBuffer.id : InvalidFrameBufferId;

        if (this.state.bindFrameBuffer(id)) {
            if (InvalidFrameBufferId === id) {
                this.targetInfo.width = this.displayInfo.width;
                this.targetInfo.height = this.displayInfo.height;
            } else {
                this.targetInfo.width = frameBuffer.width;
                this.targetInfo.height = frameBuffer.height;
            }

            return true;
        }

        return false;
    }

    /**
     * Prepares the RenderArgs object for use with the supplied camera information.
     * @param {CameraArgs} cameraArgs - The camera configuration to be used.
     * @returns {RenderArgs} Reference to self, to allow for call chaining.
     */
    configureCamera(cameraArgs) {
        if (!cameraArgs) {
            throw new Error('No CameraArgs supplied.');
        }

        Matrix4.fromRotationTranslation(this.invViewTransform, cameraArgs.orientation, cameraArgs.position);
        Matrix4.invert(this.viewTransform, this.invViewTransform);
        Vector3.copy(this.viewPosition, cameraArgs.position);

        switch (cameraArgs.type) {
            case CameraType.Perspective:
                Matrix4.perspective(
                    this.projectionTransform,
                    cameraArgs.fieldOfView,
                    cameraArgs.aspectRatio,
                    cameraArgs.nearPlane,
                    cameraArgs.farPlane,
                );
                break;

            case CameraType.Orthographic:
                const halfWidth = cameraArgs.orthoWidth / 2;
                const halfHeight = cameraArgs.orthoHeight / 2;

                Matrix4.ortho(
                    this.projectionTransform,
                    -halfWidth,
                    halfWidth,
                    -halfHeight,
                    halfHeight,
                    cameraArgs.nearPlane,
                    cameraArgs.farPlane
                );
                break;

            default:
                throw new Error('Unknown camera type.');
        }

        return this;
    }
}
