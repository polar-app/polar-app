"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArgsParser_1 = require("../../util/ArgsParser");
const Objects_1 = require("../../util/Objects");
class Args {
    static parse(argv) {
        let result = ArgsParser_1.ArgsParser.parse(argv);
        result = Objects_1.Objects.defaults(result, {
            quit: true,
            browser: "MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_750",
            profile: "hidden",
            amp: true
        });
        return result;
    }
}
exports.Args = Args;
//# sourceMappingURL=Args.js.map