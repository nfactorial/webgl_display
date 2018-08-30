import DrawRequestQueue from '../draw_request_queue';

/**
 * Maintains a collection of draw requests that are associated with a specific material.
 */
export default class MaterialDrawQueue {
    constructor() {
        this.id = '';
        this.count = 0;
        this.material = null;
        this.requestList = [];
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
        this.requestList.forEach(queue => {
            queue.dispose();
        });

        this.id = '';
        this.count = 0;
        this.material = null;
        this.requestList.length = 0;
    }

    /**
     * Removes all draw requests from this queue.
     */
    flush() {
        this.count = 0;
    }

    /**
     * Processes all draw requests contained within this draw queue.
     * @param {RenderArgs} renderArgs
     */
    execute(renderArgs) {
        this.material.onBeginRender();

        for (let loop = 0; loop < this.count; loop += 1) {
            this.requestList[loop].execute(renderArgs);
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
        const count = this.requestList.length;
        for (let loop = 0; loop < count; loop++) {
            if (this.requestList[loop].id === drawRequest.materialInstance.instanceId) {
                this.requestList[loop].addDrawRequest(drawRequest);
                return;
            }
        }

        if (this.count === this.requestList.length) {
            this.requestList.push(new DrawRequestQueue());
        }

        const requestQueue = this.requestList[this.count++];

        requestQueue.initialize(drawRequest.materialInstance);
        requestQueue.addDrawRequest(drawRequest);
    }
}
