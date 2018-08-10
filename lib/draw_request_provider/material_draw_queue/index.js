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
        // Depending how many different instances there are, it might not be suitable to scan the list for
        // each added instance. Need to investigate at some point.
        const count = this.instanceList.length;
        for (let loop = 0; loop < count; loop++) {
            if (this.instanceList[loop].id === drawRequest.materialInstance.instanceId) {
                this.instanceList[loop].addDrawRequest(drawRequest);
            }
        }

        // TODO: Create new instance queue
    }
}
