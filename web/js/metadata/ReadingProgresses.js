"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingProgresses = void 0;
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class ReadingProgresses {
    static create(progress, progressByMode, preExisting) {
        Preconditions_1.Preconditions.assert(progress, () => progress >= 0 && progress <= 100, "Progress value invalid. Must be within interval [0-100]");
        const created = ISODateTimeStrings_1.ISODateTimeStrings.create();
        const id = Hashcodes_1.Hashcodes.createID({ nonce: this.sequences.id++, created });
        return { id, created, progress, progressByMode, preExisting };
    }
}
exports.ReadingProgresses = ReadingProgresses;
ReadingProgresses.sequences = {
    id: 0,
};
//# sourceMappingURL=ReadingProgresses.js.map