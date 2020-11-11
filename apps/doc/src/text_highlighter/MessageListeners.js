"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageListeners = void 0;
var MessageListeners;
(function (MessageListeners) {
    function createListener(type, handler) {
        return (event) => {
            if (event.data.type === type) {
                handler(event.data.value);
            }
        };
    }
    MessageListeners.createListener = createListener;
    function createDispatcher(type) {
        function computeTarget() {
            let result = window;
            while (result.parent && result.parent !== result) {
                result = result.parent;
            }
            return result;
        }
        const target = computeTarget();
        return (message) => {
            target.postMessage({ type, value: message }, '*');
        };
    }
    MessageListeners.createDispatcher = createDispatcher;
})(MessageListeners = exports.MessageListeners || (exports.MessageListeners = {}));
//# sourceMappingURL=MessageListeners.js.map