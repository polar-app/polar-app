"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pkg = require("./package.json");
const version = pkg.version;
const buff = fs_1.default.readFileSync('web/js/util/Version.ts');
const content = buff.toString('utf-8');
content.replace(/foo/, `asdf`);
//# sourceMappingURL=update-version.js.map