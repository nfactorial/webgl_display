import RenderPipeline from '../render_pipeline';

const REGISTERED_PIPELINES = new Map();

/**
 * Registers a new Pipeline description with the framework.
 * @param {object} desc - Description of the pipeline being registered.
 */
export function register(desc) {
    if (!desc) {
        throw new Error('No pipeline description provided.');
    }

    if (!desc.name) {
        throw new Error('No name in pipeline description.');
    }

    if (!desc.phase) {
        throw new Error('No render phases defined in pipeline description.');
    }

    if (REGISTERED_PIPELINES.has(desc.name)) {
        throw new Error(`Pipeline description '${desc.name}' has already been registered.`);
    }

    REGISTERED_PIPELINES.set(desc.name, desc);
}

/**
 * Creates a new RenderPipeline instance based on a registered description.
 * @param {string} name - Name of the pipeline description to use.
 * @returns {RenderPipeline} Object instance that provides a render pipeline based on the supplied description.
 */
export function create(name) {
    if (typeof name !== 'string') {
        throw new Error('Pipeline identifier was not a string.');
    }

    const description = REGISTERED_PIPELINES.get(name);
    if (!description) {
        throw new Error(`Requested pipeline '${name}' could not be found.`);
    }

    return new RenderPipeline(description);
}
