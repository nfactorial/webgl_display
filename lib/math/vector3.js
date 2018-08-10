/**
 * Some code based on: https://github.com/stackgl/gl-vec3
 */
export default class Vector3 {
    constructor() {
        this.elements = new Float32Array(3);
    }

    get x() {
        return this.elements[0];
    }

    get y() {
        return this.elements[1];
    }

    get z() {
        return this.elements[2];
    }

    set x(value) {
        this.elements[0] = value;
    }

    set y(value) {
        this.elements[1] = value;
    }

    set z(value) {
        this.elements[2] = value;
    }

    get lengthSqr() {
        return this.dot(this);
    }

    get length() {
        return Math.sqrt(this.lengthSqr);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * Copies the content of another Vector3 instance into this one.
     * @param {Vector3} other - The Vector3 instance whose content is to be copied.
     * @returns {Vector3} Reference to self to allow for call chaining.
     */
    copy(other) {
        this.elements[0] = other.x;
        this.elements[1] = other.y;
        this.elements[2] = other.z;

        return this;
    }

    minimize(other) {
        this.elements[0] = Math.min(this.elements[0], other.x);
        this.elements[1] = Math.min(this.elements[1], other.y);
        this.elements[2] = Math.min(this.elements[2], other.z);

        return this;
    }

    maximize(other) {
        this.elements[0] = Math.max(this.elements[0], other.x);
        this.elements[1] = Math.max(this.elements[1], other.y);
        this.elements[2] = Math.max(this.elements[2], other.z);

        return this;
    }

    sub(other) {
        this.elements[0] = this.elements[0] - other.x;
        this.elements[1] = this.elements[1] - other.y;
        this.elements[2] = this.elements[2] - other.z;

        return this;
    }

    add(other) {
        this.elements[0] = this.elements[0] + other.x;
        this.elements[1] = this.elements[1] + other.y;
        this.elements[2] = this.elements[2] + other.z;

        return this;
    }

    cross(a, b) {
        const ax = a[0], ay = a[1], az = a[2],
              bx = b[0], by = b[1], bz = b[2];

        this.elements[0] = ay * bz - az * by;
        this.elements[1] = az * bx - ax * bz;
        this.elements[2] = ax * by - ay * bx;

        return this;
    }
}
