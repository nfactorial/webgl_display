import Vector3 from 'gl-vec3';
import Matrix4 from 'gl-mat4';

import CameraArgs from '../camera_args';
import RenderArgs from '../render_args';

import * as PipelineProvider from '../pipeline_provider';
import DrawRequestProvider from '../draw_request_provider';

/**
 * Interface for objects that provide draw requests to the framework.
 * @interface IDrawRequestHandler
 */

/**
 * When invoked, the framework expects the render provider instance to provide information about the camera being used.
 * @function
 * @name IDrawRequestHandler#getCameraArgs
 * @param {CameraArgs} cameraArgs - Object that the function is expected to store camera information within.
 * @param {RenderArgs} renderArgs - Description of the current frame being rendered.
 */

/**
 * When invoked, the framework expects the draw handler to supply a list of draw requests to be rendered.
 * @function
 * @name IDrawRequestHandler#onDrawRequest
 * @param {DrawRequestProvider} drawProvider - The object draw requests must be submitted to.
 */

/**
 * Interface for objects that can output rendered information.
 * @interface IRenderProvider
 */

/**
 * Performs a set of render operations that produce an output.
 * @function
 * @name IRenderProvider#renderContent
 * @param {RenderArgs} renderArgs - Object describing the current frame being rendered.
 */

const VIEW_TRANSFORM = Matrix4.create();
const PROJECTION_TRANSFORM = Matrix4.create();

const RENDER_ARGS = new RenderArgs();

/**
 * Represents a rectangle on the display that contains rendered data.
 *
 * A display port may contain children that are also rendered. If a display port contains children the parent
 * display port is rendered first as a background then all children are rendered.
 *
 * If a display port is hidden, it will not be rendered. If hidden, the display ports children are also not rendered.
 *
 * We do want to be able to create DisplayPorts that do not provide any rendering. This will be useful as
 * containers for layouts. This is left for the future once the core API is ready.
 *
 * TODO: We don't want the DisplayPort to be the only method of rendering, we will eventually provide a base class
 * TODO: or interface or 'something' that is lower level, allowing applications to provide their own rendering pipe.
 * TODO: Or, have the rendering pipeline allow other implementations
 * @implements IRenderProvider
 */
export default class DisplayPort {
    /**
     *
     * @param {Renderer} renderer
     * @param {IDrawRequestHandler|null} drawHandler
     * @param {string} pipeline - Name of the render pipeline to be used for this display port.
     */
    constructor(renderer, drawHandler, pipeline) {
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
        this.children = [];
        this.parent = null;
        this.isHidden = false;

        this.drawHandler = drawHandler;
        this.cameraArgs = new CameraArgs();
        this.renderPipeline = pipeline ? PipelineProvider.create(pipeline) : null;
        this.requestProvider = new DrawRequestProvider();

        this.requestProvider.initialize(renderer, this.renderPipeline);
    }

    /**
     * Releases all resources in use by this object.
     */
    dispose() {
        if (this.parent) {
            this.parent._removeChild(this);
            this.parent = null;
        }

        if (this.requestProvider) {
            this.requestProvider.dispose();
            this.requestProvider = null;
        }

        if (this.renderPipeline) {
            this.renderPipeline.dispose();
            this.renderPipeline = null;
        }
    }

    /**
     * Changes the rendering pipeline in use by this display port.
     * @param {string} id - Identifier of the pipeline to be used.
     * @returns {DisplayPort} Reference to self, to allow for call chaining.
     */
    changePipeline(id) {
        if (this.renderPipeline && this.renderPipeline.name === id) {
            return this;
        }

        if (this.renderPipeline) {
            this.renderPipeline.dispose();
            this.renderPipeline = null;
        }

        if (id) {
            this.renderPipeline = PipelineProvider.create(id);
        }

        return this;
    }

    /**
     * Renders the content of this display port.
     * @param {RenderArgs} renderArgs - Object describing the current frame being rendered.
     * @returns {DisplayPort} Reference to self, to allow for call chaining.
     */
    renderContent(renderArgs) {
        if (!this.isHidden) {
            if (this.drawHandler && this.renderPipeline) {
                renderArgs.displayPort = this;
                renderArgs.viewportInfo.x = Math.floor(this.x * renderArgs.targetInfo.width);
                renderArgs.viewportInfo.y = Math.floor(this.y * renderArgs.targetInfo.height);
                renderArgs.viewportInfo.width = Math.floor(this.width * renderArgs.targetInfo.width);
                renderArgs.viewportInfo.height = Math.floor(this.height * renderArgs.targetInfo.height);

                // Obtain camera settings for the content of this display
                this.drawHandler.getCameraArgs(this.cameraArgs, renderArgs);

                renderArgs.configureCamera(this.cameraArgs);

                this.drawHandler.onDrawRequest(this.requestProvider);

                this.requestProvider.execute(renderArgs);
                this.requestProvider.flush();
            }

            const count = this.children.length;
            for (let loop = 0; loop < count; loop++) {
                this.children[loop].renderContent(renderArgs);
            }
        }

        return this;
    }

    /**
     *
     * @param {Ray} ray
     * @param {number} x
     * @param {number} y
     * @returns {Ray} The supplied Ray object.
     */
    createRay(ray, x, y) {
        RENDER_ARGS.configureCamera(this.cameraArgs);

        Matrix4.invert(PROJECTION_TRANSFORM, RENDER_ARGS.projectionTransform);
        Matrix4.fromQuat(VIEW_TRANSFORM, this.cameraArgs.orientation);

        Vector3.copy(ray.origin, this.cameraArgs.position);
        Vector3.set(ray.direction, x, -y, 0.5);
        Vector3.transformMat4(ray.direction, ray.direction, PROJECTION_TRANSFORM);
        Vector3.transformMat4(ray.direction, ray.direction, VIEW_TRANSFORM);
        Vector3.sub(ray.direction, ray.direction, ray.origin);
        Vector3.normalize(ray.direction, ray.direction);

        return ray;
    }

    /**
     * Removes the specified display port from the list of children.
     * @param {DisplayPort} child - The child DisplayPort to be removed.
     * @private
     */
    _removeChild(child) {
        const index = this.children.indexOf(child);

        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
}
