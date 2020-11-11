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
exports.Mailchimp = void 0;
const Fetch_1 = require("polar-shared/src/util/Fetch");
const Arrays_1 = require("polar-shared/src/util/Arrays");
class Mailchimp {
    static subscribe(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://us-central1-polar-cors.cloudfunctions.net/mailinglist/`;
            const userName = this.parseName(name);
            const data = Object.assign({ email }, userName);
            const body = JSON.stringify(data);
            const init = {
                mode: 'cors',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body
            };
            const response = yield Fetch_1.Fetches.fetch(url, init);
            if (response.status !== 200) {
                throw new Error("Mailchimp failed request: " + response.status + ": " + response.statusText);
            }
        });
    }
    static parseName(name) {
        const nameParts = name.split(" ");
        const firstName = Arrays_1.Arrays.first(nameParts) || "";
        const lastName = Arrays_1.Arrays.last(nameParts) || "";
        return { firstName, lastName };
    }
}
exports.Mailchimp = Mailchimp;
//# sourceMappingURL=Mailchimp.js.map