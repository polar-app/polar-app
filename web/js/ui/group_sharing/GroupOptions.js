"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupOptions = void 0;
class GroupOptions {
    static toGroupOptions(groups) {
        return groups.filter(group => group.visibility === 'public')
            .map(group => {
            return {
                value: group.name,
                label: group.name,
            };
        });
    }
}
exports.GroupOptions = GroupOptions;
//# sourceMappingURL=GroupOptions.js.map