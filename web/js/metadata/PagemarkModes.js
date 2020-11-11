"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagemarkModes = void 0;
const PagemarkMode_1 = require("polar-shared/src/metadata/PagemarkMode");
class PagemarkModes {
    static toDescriptors() {
        return Object.keys(PagemarkMode_1.PagemarkMode)
            .map(name => {
            return {
                name,
                title: name.replace(/[-_]+/g, ' ').toLowerCase(),
                key: name.replace(/[-_]+/g, '-').toLowerCase(),
            };
        });
    }
}
exports.PagemarkModes = PagemarkModes;
//# sourceMappingURL=PagemarkModes.js.map