"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GALoggers = void 0;
const Reducers_1 = require("polar-shared/src/util/Reducers");
class GALoggers {
    static getError(args) {
        const error = args.filter(arg => arg instanceof Error)
            .reduce(Reducers_1.Reducers.FIRST, undefined);
        return error;
    }
    static toEvent(error) {
        if (!error) {
            return undefined;
        }
        const action = error.message.replace(/[^a-zA-Z]+/g, "-")
            .substring(0, 80)
            .toLowerCase();
        return { category: 'error', action };
    }
}
exports.GALoggers = GALoggers;
//# sourceMappingURL=GALoggers.js.map