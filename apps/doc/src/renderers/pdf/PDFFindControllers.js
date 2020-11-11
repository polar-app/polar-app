"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFFindControllers = void 0;
var PDFFindControllers;
(function (PDFFindControllers) {
    function createFinder(eventBus, findController) {
        const defaultOpts = {
            phraseSearch: false,
            highlightAll: true,
            findPrevious: false,
        };
        const exec = (opts) => {
            function updatefindmatchescount(evt) {
                opts.onMatches(evt.matchesCount);
            }
            function updatefindcontrolstate(evt) {
                opts.onMatches(evt.matchesCount);
            }
            eventBus.on("updatefindmatchescount", updatefindmatchescount);
            eventBus.on('updatefindcontrolstate', updatefindcontrolstate);
            const cancel = () => {
                eventBus.off("updatefindmatchescount", updatefindmatchescount);
                eventBus.off('updatefindcontrolstate', updatefindcontrolstate);
                eventBus.dispatch('findbarclose');
            };
            function next() {
                findController.executeCommand('findagain', Object.assign(Object.assign(Object.assign({}, opts), defaultOpts), { findPrevious: false }));
            }
            function prev() {
                findController.executeCommand('findagain', Object.assign(Object.assign(Object.assign({}, opts), defaultOpts), { findPrevious: true }));
            }
            findController.executeCommand('find', Object.assign(Object.assign({}, opts), defaultOpts));
            return { opts, cancel, next, prev };
        };
        return { exec };
    }
    PDFFindControllers.createFinder = createFinder;
})(PDFFindControllers = exports.PDFFindControllers || (exports.PDFFindControllers = {}));
//# sourceMappingURL=PDFFindControllers.js.map