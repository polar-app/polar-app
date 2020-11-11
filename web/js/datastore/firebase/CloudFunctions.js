"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFunctions = void 0;
class CloudFunctions {
    static createEndpoint() {
        const project = process.env.POLAR_TEST_PROJECT || "polar-cors";
        return `https://us-central1-${project}.cloudfunctions.net`;
    }
}
exports.CloudFunctions = CloudFunctions;
//# sourceMappingURL=CloudFunctions.js.map