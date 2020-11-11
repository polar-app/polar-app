"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyMaps = void 0;
var KeyMaps;
(function (KeyMaps) {
    function keyMap(opts) {
        function toKeySequence(option) {
            const action = option.action || 'keydown';
            return {
                sequence: option.sequences[0],
                sequences: option.sequences,
                action,
                name: option.name,
                group,
                description: option.description
            };
        }
        const result = {};
        const { group, keyMap } = opts;
        for (const key of Object.keys(keyMap)) {
            result[key] = toKeySequence(keyMap[key]);
        }
        return result;
    }
    KeyMaps.keyMap = keyMap;
})(KeyMaps = exports.KeyMaps || (exports.KeyMaps = {}));
//# sourceMappingURL=KeyMaps.js.map