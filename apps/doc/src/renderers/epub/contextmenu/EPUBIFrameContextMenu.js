"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBIFrameContextMenu = void 0;
const MUIContextMenu_1 = require("../../../../../repository/js/doc_repo/MUIContextMenu");
const EPUBIFrameMenu_1 = require("./EPUBIFrameMenu");
function computeMenuOrigin(event) {
    return {
        clientX: event.clientX,
        clientY: event.clientY,
        target: event.target
    };
}
exports.EPUBIFrameContextMenu = MUIContextMenu_1.createContextMenu(EPUBIFrameMenu_1.EPUBIFrameMenu, { computeOrigin: computeMenuOrigin });
//# sourceMappingURL=EPUBIFrameContextMenu.js.map