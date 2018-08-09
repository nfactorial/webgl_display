let INSTANCE_ID = 0;

/**
 * A MaterialInstance contains a reference to a material object and parameter overrides for the instance uniforms.
 *
 * @property {Material} material - The material this object is an instance of.
 */
export default class MaterialInstance {
    constructor() {
        this.instanceId = INSTANCE_ID++;
        this.material = null;
        this.instanceUniforms = null;
    }

    /**
     * Retrieves the identifier of the material associated with this material instance.
     * @returns {string} Identifier of the material associated with this material instance.
     */
    get id() {
        return this.material.id;
    }

    /**
     * Retrieves the render phase the material instance expects to be rendered in.
     * @returns {string} The render phase the material expects to be rendered in.
     */
    get phase() {
        return this.material.phase;
    }
}
