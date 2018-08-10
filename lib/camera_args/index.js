import Vector3 from '../math/vector3';
import Quaternion from '../math/quaternion';

export const CameraType = {
    Perspective: 0,
    Orthographic: 1,
};

const DEFAULT_FIELD_OF_VIEW = 75.0;
const DEFAULT_NEAR_PLANE = 1.0;
const DEFAULT_FAR_PLANE = 1000.0;

/**
 * Describes the settings for a camera that may be used to render the contents of a display port.
 */
export default class CameraArgs {
    constructor() {
        this.orientation = new Quaternion();
        this.position = new Vector3();
        this.type = CameraType.Perspective;
        this.fieldOfView = DEFAULT_FIELD_OF_VIEW;
        this.nearPlane = DEFAULT_NEAR_PLANE;
        this.farPlane = DEFAULT_FAR_PLANE;
    }

    /**
     * Resets all values to their default settings.
     * @returns {CameraArgs} Reference to self to allow for call chaining.
     */
    reset() {
        this.orientation.setIdentity();
        this.position.set(0, 0, 0);
        this.type = CameraType.Perspective;
        this.fieldOfView = DEFAULT_FIELD_OF_VIEW;
        this.nearPlane = DEFAULT_NEAR_PLANE;
        this.farPlane = DEFAULT_FAR_PLANE;

        return this;
    }

    /**
     * Copies the content of another CameraArgs object into our local instance.
     * @param {CameraArgs} other - The CameraArgs object whose settings are to be copied.
     * @returns {CameraArgs} Reference to self to allow for call chaining.
     */
    copy(other) {
        this.orientation.copy(other.orientation);
        this.position.copy(other.position);
        this.type = other.type;
        this.fieldOfView = other.fieldOfView;
        this.nearPlane = other.nearPlane;
        this.farPlane = other.farPlane;

        return this;
    }
}
