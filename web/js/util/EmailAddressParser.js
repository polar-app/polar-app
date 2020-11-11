"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAddressParser = void 0;
class EmailAddressParser {
    static parse(text) {
        const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
        let m = null;
        const result = [];
        do {
            m = re.exec(text);
            if (m) {
                result.push(m[0]);
            }
        } while (m);
        return result;
    }
}
exports.EmailAddressParser = EmailAddressParser;
//# sourceMappingURL=EmailAddressParser.js.map