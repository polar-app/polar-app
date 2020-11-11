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
exports.FileWriter = void 0;
const Files_1 = require("polar-shared/src/util/Files");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class FileWriter {
    constructor(path) {
        this.path = path;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.stream = Files_1.Files.createWriteStream(this.path);
        });
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertPresent(this.stream, "no stream");
            this.stream.write(data);
        });
    }
    close(err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.stream) {
                this.stream.close();
            }
        });
    }
}
exports.FileWriter = FileWriter;
//# sourceMappingURL=FileWriter.js.map