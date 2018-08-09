
export default class Vector2 {
    constructor() {
        this.elements = new Float32Array(2);
    }

    get x() {
        return this.elements[0];
    }

    get y() {
        return this.elements[1];
    }

    set x(value) {
        this.elements[0] = value;
    }

    set y(value) {
        this.elements[1] = value;
    }

    get lengthSqr() {
        return this.dot(this);
    }

    get length() {
        return Math.sqrt(this.lengthSqr);
    }

    dot(other) {
        return this.x*other.x + this.y*other.y;
    }

    /**
     * Copies the content of another Vector3 instance into this one.
     * @param {Vector2} other - The Vector3 instance whose content is to be copied.
     * @returns {Vector2} Reference to self to allow for call chaining.
     */
    copy(other) {
        this.elements[0] = other.x;
        this.elements[1] = other.y;

        return this;
    }

    minimize(other) {
        this.elements[0] = Math.min(this.elements[0], other.x);
        this.elements[1] = Math.min(this.elements[1], other.y);

        return this;
    }

    maximize(other) {
        this.elements[0] = Math.max(this.elements[0], other.x);
        this.elements[1] = Math.max(this.elements[1], other.y);

        return this;
    }

    sub(other) {
        this.elements[0] = this.elements[0] - other.x;
        this.elements[1] = this.elements[1] - other.y;

        return this;
    }

    add(other) {
        this.elements[0] = this.elements[0] + other.x;
        this.elements[1] = this.elements[1] + other.y;

        return this;
    }
}
