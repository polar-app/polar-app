"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupNames = void 0;
const Tags_1 = require("polar-shared/src/tags/Tags");
class GroupNames {
    static assertValid(name) {
        function assertDoesNotContain(ch) {
            if (name.indexOf(ch) !== -1) {
                throw new Error("name must not contain: " + ch);
            }
        }
        assertDoesNotContain(':');
        assertDoesNotContain('#');
        assertDoesNotContain('/');
        Tags_1.Tags.assertValid(name);
    }
}
exports.GroupNames = GroupNames;
//# sourceMappingURL=GroupNames.js.map