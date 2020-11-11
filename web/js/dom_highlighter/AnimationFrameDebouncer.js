"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationFrameDebouncer;
(function (AnimationFrameDebouncer) {
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
    AnimationFrameDebouncer.withAnimationFrame = withAnimationFrame;
})(AnimationFrameDebouncer || (AnimationFrameDebouncer = {}));
//# sourceMappingURL=AnimationFrameDebouncer.js.map