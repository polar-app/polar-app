"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const url = __importStar(require("url"));
class Http {
    static fetchContent(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options === 'string') {
                options = url.parse(options);
            }
            let provider;
            if (options.protocol === "http:") {
                console.log("Using http");
                provider = http_1.default;
            }
            else if (options.protocol === "https:") {
                console.log("Using https");
                provider = https_1.default;
            }
            else {
                throw new Error("No provider for protocol: " + options.protocol);
            }
            return new Promise((resolve, reject) => {
                provider.get(options, response => {
                    if (response.statusCode !== 200) {
                        reject(new Error("Wrong status code: " + response.statusCode));
                    }
                    let data = [];
                    response.on('data', (chunk) => {
                        data.push(chunk);
                    });
                    response.on('end', () => {
                        let buffer = Buffer.concat(data);
                        resolve(buffer);
                    });
                });
            });
        });
    }
    static execute(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options === 'string') {
                options = url.parse(options);
            }
            let provider;
            if (options.protocol === "http:") {
                console.log("Using http");
                provider = http_1.default;
            }
            else if (options.protocol === "https:") {
                console.log("Using https");
                provider = https_1.default;
            }
            else {
                throw new Error("No provider for protocol: " + options.protocol);
            }
            return new Promise((resolve, reject) => {
                provider.get(options, (response) => {
                    if (response.statusCode !== 200) {
                        reject(new Error("Wrong status code: " + response.statusCode));
                    }
                    let data = [];
                    response.on('data', (chunk) => {
                        data.push(chunk);
                    });
                    response.on('end', () => {
                        let buffer = Buffer.concat(data);
                        resolve({
                            response,
                            data: buffer
                        });
                    });
                });
            });
        });
    }
}
exports.Http = Http;
//# sourceMappingURL=Http.js.map