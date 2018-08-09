import RenderArgs from '../render_args';
import DisplayPort from '../display_port';
import TransformCache from '../transform_cache';
import * as WebGLHelper from '@nfactorial/webgl_helper';

/**
 * Core renderer for our display management library.
 */
export default class Renderer extends WebGLHelper.Renderer {
    constructor() {
        super();

        this._displayPorts = [];
        this._renderArgs = new RenderArgs();
        this._transformCache = new TransformCache();
    }

    /**
     * Releases all resources currently in use by the renderer.
     */
    dispose() {
        for (const displayPort of this._displayPorts) {
            displayPort.dispose();
        }

        this._displayPorts.length = 0;

        super.dispose();
    }

    /**
     * Creates a new DisplayPort object for use by the application, display port must be deleted using the deleteDisplayPort method.
     */
    createDisplayPort() {
        const displayPort = new DisplayPort();

        this._displayPorts.push(displayPort);
    }

    /**
     * Deletes the specified display port from the renderer.
     * @param {DisplayPort} displayPort - The display port to be deleted.
     */
    deleteDisplayPort(displayPort) {
        if (!displayPort) {
            throw new Error('No display port specified for deletion.');
        }

        displayPort.dispose();

        const index = this._displayPorts.indexOf(displayPort);
        if (index !== -1) {
            this._displayPorts.splice(index, 1);
        }
    }

    /**
     * Performs all rendering required by the application.
     */
    renderFrame() {
        this._renderArgs.state = this.state;
        this._renderArgs.renderer = this;
        this._renderArgs.gl = this.context;
        this._renderArgs.transformCache = this._transformCache;

        for (const displayPort of this._displayPorts) {
            displayPort.renderContent(this._renderArgs);
        }
    }
}
