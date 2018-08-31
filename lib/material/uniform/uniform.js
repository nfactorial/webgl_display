/**
 * Represents a Uniform value that is accessed within a shader program.
 */
export default class Uniform {
    /**
     *
     * @param {string} name - The name associated with the uniform.
     * @param location
     * @param {boolean} shared - True if the uniform is shared across all instances of the material otherwise false.
     * @param {function} applyFunc - A method that commits the uniforms value to the WebGL context.
     * @param {function|null} dataFunc - A method that will create the data store for the uniforms value.
     */
    constructor(name, location, shared, applyFunc, dataFunc) {
        this.name = name;
        this.location = location;
        this.shared = shared;
        this.apply = applyFunc;
        this.dataFunc = dataFunc;
        this.value = null;

        if (dataFunc) {
            this.value = dataFunc();
        }
    }

    /**
     * Creates a clone of the current uniform object.
     * @returns {Uniform} A new Uniform instance that contains the same information as this one.
     */
    clone() {
        return new Uniform(this.name, this.location, this.shared, this.apply, this.dataFunc);
    }
}
