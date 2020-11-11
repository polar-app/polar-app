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
exports.CacheFirstThenServerGetOptions = exports.DocumentReferences = void 0;
class DocumentReferences {
    static get(ref, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = opts.source || 'default';
            if ('default' === source || 'server' === source || 'cache' === source) {
                return yield ref.get({ source });
            }
            else if (opts.source === 'cache-then-server') {
                return this.getWithOrder(ref, 'cache', 'server');
            }
            else if (opts.source === 'server-then-cache') {
                return this.getWithOrder(ref, 'cache', 'server');
            }
            else {
                throw new Error("Unable to fetch reference");
            }
        });
    }
    static getWithOrder(ref, primarySource, secondarySource) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ref.get({ source: primarySource });
            }
            catch (err) {
                console.warn(`Unable to fetch from primary source ${primarySource} and reverting to secondary ${secondarySource}`);
                return yield ref.get({ source: secondarySource });
            }
        });
    }
}
exports.DocumentReferences = DocumentReferences;
class CacheFirstThenServerGetOptions {
    constructor() {
        this.source = 'cache-then-server';
    }
}
exports.CacheFirstThenServerGetOptions = CacheFirstThenServerGetOptions;
//# sourceMappingURL=DocumentReferences.js.map