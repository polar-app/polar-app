"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagPaths = void 0;
class TagPaths {
    static createPathEntries(path) {
        const paths = path.split("/");
        let buff = '';
        const result = [];
        let parent;
        for (const current of paths) {
            if (buff === '/') {
                buff = buff + current;
            }
            else {
                buff = buff + '/' + current;
            }
            const toParent = () => {
                if (parent) {
                    return {
                        path: parent.path,
                        basename: parent.basename
                    };
                }
                return undefined;
            };
            const pathEntry = {
                path: buff,
                basename: current,
                parent: toParent()
            };
            result.push(pathEntry);
            parent = pathEntry;
        }
        return result;
    }
}
exports.TagPaths = TagPaths;
//# sourceMappingURL=TagPaths.js.map