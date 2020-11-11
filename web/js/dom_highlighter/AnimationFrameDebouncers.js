"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationFrameDebouncers = void 0;
var AnimationFrameDebouncers;
(function (AnimationFrameDebouncers) {
    function withAnimationFrame(delegate) {
        let pending = false;
        function handleDelegate() {
            try {
                delegate();
            }
            finally {
                pending = false;
            }
        }
        return () => {
            if (pending) {
                return;
            }
            window.requestAnimationFrame(handleDelegate);
            pending = true;
        };
    }
    AnimationFrameDebouncers.withAnimationFrame = withAnimationFrame;
})(AnimationFrameDebouncers = exports.AnimationFrameDebouncers || (exports.AnimationFrameDebouncers = {}));
//# sourceMappingURL=AnimationFrameDebouncers.js.map