"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jquery = require("jquery");
global.$ = global.jQuery = jquery;
function $(arg) {
    return jquery(arg);
}
exports.default = $;
//# sourceMappingURL=JQuery.js.map