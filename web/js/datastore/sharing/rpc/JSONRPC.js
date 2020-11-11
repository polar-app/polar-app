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
exports.JSONRPCError = exports.JSONRPC = void 0;
const Firebase_1 = require("../../../firebase/Firebase");
const CloudFunctions_1 = require("../../firebase/CloudFunctions");
class JSONRPC {
    static exec(func, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = Firebase_1.Firebase.init();
            const user = app.auth().currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }
            const idToken = yield user.getIdToken();
            const userRequest = {
                idToken,
                request,
            };
            const endpoint = CloudFunctions_1.CloudFunctions.createEndpoint();
            const url = `${endpoint}/${func}`;
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userRequest)
            });
            if (response.status !== 200) {
                throw new JSONRPCError(response, "Unable to handle RPC: " + func);
            }
            return yield response.json();
        });
    }
}
exports.JSONRPC = JSONRPC;
class JSONRPCError extends Error {
    constructor(response, message) {
        super(message);
        this.response = response;
    }
}
exports.JSONRPCError = JSONRPCError;
//# sourceMappingURL=JSONRPC.js.map