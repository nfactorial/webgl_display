/**
 * Interface for classes that are able to provide camera information to the display port.
 * @interface ICameraProvider
 */

/**
 * Gets the camera description for the display port being rendered.
 * @function
 * @name ICameraProvider#getCameraArgs
 * @param {CameraArgs} cameraArgs - Object that will receive information about the camera in use by the display port.
 */

/**
 * Represents a rectangle on the display that contains rendered data.
 *
 * A display port may contain children that are also rendered. If a display port contains children the parent
 * display port is rendered first as a background then all children are rendered.
 *
 * If a display port is hidden, it will not be rendered. If hidden, the display ports children are also not rendered.
 */
export default class DisplayPort {
     constructor() {
         this.x = 0;
         this.y = 0;
         this.width = 0;
         this.height = 0;
         this.children = [];
         this.parent = null;
         this.renderPipeline = null;
         this.isHidden = false;

         this.drawHandler = null;
         this.cameraProvider = null;
     }

    /**
     * Releases all resources in use by this object.
     */
    dispose() {
         if (this.parent) {
             this.parent._removeChild(this);
             this.parent = null;
         }

         if (this.renderPipeline) {
             this.renderPipeline.dispose();
         }
     }

    /**
     * Renders the content of this display port.
     */
    renderContent(renderArgs) {
        if (!this.isHidden) {
            // TODO: Enable render target, if specified, for this display port. If not, render to the back buffer
            // TODO: Configure viewport on the display for our display port
            // TODO: Obtain camera settings for the content of this display

            renderArgs.displayPort = this;

            if (this.renderPipeline) {
                this.renderPipeline.execute(renderArgs);
            }

            for (const child of this.children) {
                child.renderContent();
            }
        }
     }

    /**
     * Removes the specified display port from the list of children.
     * @param {DisplayPort} child - The child DisplayPort to be removed.
     * @private
     */
     _removeChild(child) {
         const index = this.children.indexOf(child);
         if (-1 !== index) {
             this.children.splice(index, 1);
         }
     }
}
