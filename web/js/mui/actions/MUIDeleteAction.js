"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDeleteAction = void 0;
const Functions_1 = require("polar-shared/src/util/Functions");
var MUIDeleteAction;
(function (MUIDeleteAction) {
    function create(props) {
        return (dialogs) => {
            const dialogProps = {
                title: props.title,
                subtitle: props.subtitle,
                type: props.type || 'danger',
                onCancel: props.onCancel || Functions_1.NULL_FUNCTION,
                onAccept: props.onAccept
            };
            dialogs.confirm(dialogProps);
        };
    }
    MUIDeleteAction.create = create;
})(MUIDeleteAction = exports.MUIDeleteAction || (exports.MUIDeleteAction = {}));
//# sourceMappingURL=MUIDeleteAction.js.map