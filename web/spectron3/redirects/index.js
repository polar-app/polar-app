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
const electron_1 = require("electron");
electron_1.app.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://github.com/burtonator/polar-bookshelf/releases/download/v1.80.3/latest-mac.yml";
    const request = electron_1.net.request({ url, redirect: 'follow' });
    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        response.on('data', (chunk) => {
            console.log("got chunk");
        });
        response.on('end', () => {
            console.log('No more data in response.');
        });
    });
    request.end();
}));
//# sourceMappingURL=index.js.map