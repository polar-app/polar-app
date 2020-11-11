"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageListener = void 0;
const ReactLifecycleHooks_1 = require("../../../../web/js/hooks/ReactLifecycleHooks");
function useMessageListener(handler) {
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        window.addEventListener('message', handler);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        window.removeEventListener('message', handler);
    });
}
exports.useMessageListener = useMessageListener;
//# sourceMappingURL=PostMessageHooks.js.map