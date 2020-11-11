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
const FirebaseDatastores_1 = require("./FirebaseDatastores");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const Assertions_1 = require("../test/Assertions");
describe('FirebaseDatastores', function () {
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const backend = Backend_1.Backend.STASH;
            const fileRef = {
                name: "chubby.pdf",
                backend
            };
            const uid = "SSVzZnZrmZbCnavWVw6LmoVVCeA3";
            const storagePath = FirebaseDatastores_1.FirebaseDatastores.computeStoragePath(backend, fileRef, uid);
            Assertions_1.assertJSON(storagePath, {
                "path": "stash/1DkF2nhfKbnzmNaaLFo7LritFAGg5nunancvCGVe.pdf",
                "settings": {
                    "cacheControl": "public,max-age=604800",
                    "contentType": "application/pdf"
                }
            });
        });
    });
});
//# sourceMappingURL=FirebaseDatastoresTest.js.map