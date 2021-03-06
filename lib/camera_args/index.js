import Vector3 from 'gl-vec3';
import Quaternion from 'gl-quat';

export const CameraType = {
    Perspective: 0,
    Orthographic: 1,
};

const DEFAULT_FIELD_OF_VIEW = 75.0;
const DEFAULT_NEAR_PLANE = 1.0;
const DEFAULT_FAR_PLANE = 1000.0;
const DEFAULT_ORTHO_WIDTH = 1;
const DEFAULT_ORTHO_HEIGHT = 1;
const DEFAULT_ASPECT_RATIO = 1;

/**
 * Describes the settings for a camera that may be used to render the contents of a display port.
 */
export default class CameraArgs {
    constructor() {
        this.orientation = Quaternion.create();
        this.position = Vector3.create();
        this.type = CameraType.Perspective;
        this.aspectRatio = DEFAULT_ASPECT_RATIO;
        this.fieldOfView = DEFAULT_FIELD_OF_VIEW;
        this.nearPlane = DEFAULT_NEAR_PLANE;
        this.farPlane = DEFAULT_FAR_PLANE;
        this.orthoWidth = DEFAULT_ORTHO_WIDTH;
        this.orthoHeight = DEFAULT_ORTHO_HEIGHT;
    }

    /**
     * Resets all values to their default settings.
     * @returns {CameraArgs} Reference to self to allow for call chaining.
     */
    reset() {
        Quaternion.identity(this.orientation);
        Vector3.set(this.position, 0, 0, 0);
        this.type = CameraType.Perspective;
        this.aspectRatio = DEFAULT_ASPECT_RATIO;
        this.fieldOfView = DEFAULT_FIELD_OF_VIEW;
        this.nearPlane = DEFAULT_NEAR_PLANE;
        this.farPlane = DEFAULT_FAR_PLANE;
        this.orthoWidth = DEFAULT_ORTHO_WIDTH;
        this.orthoHeight = DEFAULT_ORTHO_HEIGHT;

        return this;
    }

    /**
     * Copies the content of another CameraArgs object into our local instance.
     * @param {CameraArgs} other - The CameraArgs object whose settings are to be copied.
     * @returns {CameraArgs} Reference to self to allow for call chaining.
     */
    copy(other) {
        Quaternion.copy(this.orientation, other.orientation);
        Vector3.copy(this.position, other.position);
        this.aspectRatio = other.aspectRatio;
        this.type = other.type;
        this.fieldOfView = other.fieldOfView;
        this.nearPlane = other.nearPlane;
        this.farPlane = other.farPlane;
        this.orthoWidth = other.orthoWidth;
        this.orthoHeight = other.orthoHeight;

        return this;
    }
}
