"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAddresses = void 0;
const email_addresses_1 = require("email-addresses");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class EmailAddresses {
    static parseList(input) {
        input = input.replace(/[\r\n]/g, "");
        const parsed = email_addresses_1.parseAddressList(input);
        if (!Preconditions_1.isPresent(parsed)) {
            return [];
        }
        const result = [];
        for (const current of parsed) {
            if (current.type === 'mailbox') {
                const parsedMailbox = current;
                const name = Optional_1.Optional.of(parsedMailbox.name).getOrUndefined();
                const address = parsedMailbox.address;
                result.push({ name, address });
            }
        }
        return result;
    }
    static format(addr) {
        if (addr.name) {
            return `"${addr.name}" <${addr.address}>`;
        }
        return addr.address;
    }
}
exports.EmailAddresses = EmailAddresses;
//# sourceMappingURL=EmailAddresses.js.map