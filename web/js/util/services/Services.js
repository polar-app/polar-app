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
exports.Services = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class Services {
    static start(...services) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            services.forEach(service => {
                log.info("Starting service: " + service.constructor.name);
                promises.push(service.start());
            });
            yield Promise.all(promises);
        });
    }
    static stop(serviceReferences) {
        Object.entries(serviceReferences).forEach(serviceReference => {
            let name = serviceReference[0];
            let service = serviceReference[1];
            let message = `Stopping service ${name}...`;
            log.info(message);
            service.stop();
            log.info(message + "done");
        });
    }
}
exports.Services = Services;
//# sourceMappingURL=Services.js.map