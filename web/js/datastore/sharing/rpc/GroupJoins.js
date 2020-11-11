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
exports.GroupJoins = void 0;
const JSONRPC_1 = require("./JSONRPC");
const GroupDatastores_1 = require("../GroupDatastores");
const Logger_1 = require("polar-shared/src/logger/Logger");
const URLParams_1 = require("../../../util/URLParams");
const log = Logger_1.Logger.create();
class GroupJoins {
    static exec(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield JSONRPC_1.JSONRPC.exec('groupJoin', request);
        });
    }
    static execAndAdd(persistenceLayer, invitation) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupID } = invitation;
            yield GroupJoins.exec({ groupID });
            for (const docRef of invitation.docs) {
                const groupDocRef = {
                    groupID,
                    docRef
                };
                log.info("Going to importFromGroup");
                yield GroupDatastores_1.GroupDatastores.importFromGroup(persistenceLayer, groupDocRef);
            }
        });
    }
    static createShareURL(invitation) {
        const param = URLParams_1.URLParams.createJSON(invitation);
        return `https://app.getpolarized.io/apps/add-shared-doc?invitation=${param}`;
    }
}
exports.GroupJoins = GroupJoins;
//# sourceMappingURL=GroupJoins.js.map