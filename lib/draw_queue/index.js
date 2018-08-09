
export default class DrawQueue {
    constructor() {
        this._capacity = 0;
        this._count = 0;
        this._buffer = null;
    }

    addDrawRequest(drawRequest) {
        if (this._count < this._capacity) {
            // TODO: Add request to queue
        } else {
            console.warn('WARN: DrawQueue capacity exceeded.');
        }

        return this;
    }
}
