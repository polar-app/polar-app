"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHighlighterListener = void 0;
var TextHighlighterListener;
(function (TextHighlighterListener) {
    function start() {
        function handleMessage(event) {
            switch (event.data.type) {
            }
        }
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }
    TextHighlighterListener.start = start;
})(TextHighlighterListener = exports.TextHighlighterListener || (exports.TextHighlighterListener = {}));
//# sourceMappingURL=TextHighlighterListener.js.map