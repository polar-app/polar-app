"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoQueues = void 0;
var UndoQueues;
(function (UndoQueues) {
    function create(opts = {}) {
        const actions = [];
        let ptr = -1;
        const limit = opts.limit || 25;
        let seq = 0;
        function push(undoFunction) {
            return __awaiter(this, void 0, void 0, function* () {
                const pushResult = {
                    removedFromHead: 0,
                    removedFromTail: 0
                };
                yield undoFunction();
                if (actions.length >= limit) {
                    actions.shift();
                    ptr = ptr - 1;
                    pushResult.removedFromHead = 1;
                }
                if (ptr !== (actions.length - 1)) {
                    const end = ptr + 1;
                    const count = actions.length - end;
                    actions.splice(end, count);
                    pushResult.removedFromTail = count;
                }
                const id = seq++;
                actions.push({
                    id,
                    exec: undoFunction
                });
                ptr = ptr + 1;
                return Object.assign({ id }, pushResult);
            });
        }
        function undo() {
            return __awaiter(this, void 0, void 0, function* () {
                if (ptr <= 0) {
                    return 'at-head';
                }
                const action = actions[ptr - 1];
                console.log("Applying action ID: " + action.id);
                yield action.exec();
                ptr = ptr - 1;
                return 'executed';
            });
        }
        function redo() {
            return __awaiter(this, void 0, void 0, function* () {
                const end = actions.length - 1;
                if (ptr === end) {
                    return 'at-tail';
                }
                const action = actions[ptr + 1];
                yield action.exec();
                ptr = ptr + 1;
                return 'executed';
            });
        }
        function size() {
            return actions.length;
        }
        function pointer() {
            return ptr;
        }
        return { push, undo, redo, size, pointer, limit };
    }
    UndoQueues.create = create;
})(UndoQueues = exports.UndoQueues || (exports.UndoQueues = {}));
//# sourceMappingURL=UndoQueues.js.map