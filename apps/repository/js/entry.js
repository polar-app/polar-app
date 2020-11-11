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
const Logging_1 = require("../../../web/js/logger/Logging");
const Repository_1 = require("../../../web/js/apps/repository/Repository");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting logging init");
        yield Logging_1.Logging.init();
        console.log("Starting logging init... done");
        yield new Repository_1.Repository().start();
    });
}
start()
    .catch(err => console.error("Could not start repository app: ", err));
//# sourceMappingURL=entry.js.map