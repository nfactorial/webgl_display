import * as WebGLHelper from '@nfactorial/webgl_helper';

import TransformRef from '../../math/transform_ref';

export default class RequestStore extends TransformRef {
    constructor() {
        super();

        this.indexBuffer = null;
        this.vertexBuffer = null;
        this.primitiveType = WebGLHelper.PrimitiveType.TriangleList;
        this.primitiveCount = 0;
    }

    copyDrawRequest(drawRequest) {
        this.indexBuffer = drawRequest.indexBuffer;
        this.vertexBuffer = drawRequest.vertexBuffer;
        this.primitiveType = drawRequest.primitiveType;
        this.primitiveCount = drawRequest.primitiveCount;
    }
}
