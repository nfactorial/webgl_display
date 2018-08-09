/**
 * Maintains a collection of draw requests that are associated with a specific material.
 */
export default class MaterialDrawQueue {
    constructor() {
        this.id = '';
        this.count = 0;
        this.material = null;
        this.instanceList = [];
    }

    /**
     * Prepares the object for rendering materials of the specified type.
     * @param {Material} material
     */
    initialize(material) {
        if (!material) {
            throw new Error('No material specified.');
        }

        this.id = material.id;
        this.material = material;
    }

    /**
     * Releases all resources referenced by this object.
     */
    dispose() {
        // TODO: Invoke dispose on all instance queues.

        this.id = '';
        this.count = 0;
        this.material = null;
        this.instanceList.length = 0;
    }

    /**
     * Removes all draw requests from this queue.
     */
    flush() {
        this.count = 0;
    }

    execute(renderArgs) {
        this.material.onBeginRender();

        for (let loop = 0; loop < this.count; loop++) {
            this.instanceList[loop].execute(renderArgs);
        }

        this.material.onEndRender();
    }

    /**
     * Adds a new draw request to the queue.
     * @param {DrawRequest} drawRequest - The request to be added.
     */
    addDrawRequest(drawRequest) {
        for (const instanceQueue of this.instanceList) {
            if (instanceQueue.id === drawRequest.materialInstance.instanceId) {
                instanceQueue.addDrawRequest(drawRequest);
                return;
            }
        }

        // TODO: Create new instance queue
    }
}
