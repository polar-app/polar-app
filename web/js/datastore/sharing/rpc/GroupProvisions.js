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
exports.GroupProvisions = void 0;
const JSONRPC_1 = require("./JSONRPC");
class GroupProvisions {
    static exec(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield JSONRPC_1.JSONRPC.exec('groupProvision', request);
        });
    }
}
exports.GroupProvisions = GroupProvisions;
//# sourceMappingURL=GroupProvisions.js.map