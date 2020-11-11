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
exports.ResolvablePromise = void 0;
class ResolvablePromise {
    constructor() {
        this.resolve = () => { };
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.promise;
        });
    }
    set(value) {
        this.resolve(value);
    }
    catch(onrejected) {
        return this.promise.catch(onrejected);
    }
    then(onresolved, onrejected) {
        return this.promise.then(onresolved, onrejected);
    }
    finally(onfinally) {
        return this.promise.finally(onfinally);
    }
}
exports.ResolvablePromise = ResolvablePromise;
//# sourceMappingURL=ResolvablePromise.js.map