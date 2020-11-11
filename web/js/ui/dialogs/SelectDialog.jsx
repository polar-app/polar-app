"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectDialog = void 0;
var react_1 = require("react");
var DialogTitle_1 = require("@material-ui/core/DialogTitle");
var DialogActions_1 = require("@material-ui/core/DialogActions/DialogActions");
var Button_1 = require("@material-ui/core/Button");
var DialogContent_1 = require("@material-ui/core/DialogContent");
var ListItemText_1 = require("@material-ui/core/ListItemText");
var ListItem_1 = require("@material-ui/core/ListItem");
var List_1 = require("@material-ui/core/List");
var Box_1 = require("@material-ui/core/Box");
var DialogContentText_1 = require("@material-ui/core/DialogContentText");
var WithDeactivatedKeyboardShortcuts_1 = require("../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts");
var MUIDialog_1 = require("./MUIDialog");
/**
 * Select from a list of options.
 */
exports.SelectDialog = function (props) {
    var _a = react_1.default.useState(true), open = _a[0], setOpen = _a[1];
    var handleCancel = function () {
        props.onCancel();
        setOpen(false);
    };
    var handleDone = function (option) {
        // noop
        setOpen(false);
        props.onDone(option);
    };
    var handleClose = function (event, reason) {
        props.onCancel();
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    function convertOptionToListItem(option) {
        return (<ListItem_1.default key={option.id} autoFocus={option.id === props.defaultValue} button onClick={function () { return handleDone(option); }}>
                <ListItemText_1.default primary={option.label}/>
            </ListItem_1.default>);
    }
    return (<MUIDialog_1.MUIDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">

            <WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts>
                <>
                    <DialogTitle_1.default id="form-dialog-title">{props.title}</DialogTitle_1.default>

                    <DialogContent_1.default>

                        {props.description !== undefined && (<Box_1.default pt={1}>
                                <DialogContentText_1.default id="dialog-description">
                                    {props.description}
                                </DialogContentText_1.default>
                            </Box_1.default>)}

                        <List_1.default>
                            {props.options.map(convertOptionToListItem)}
                        </List_1.default>
                    </DialogContent_1.default>
                    <DialogActions_1.default>
                        <Button_1.default onClick={handleCancel}>
                            Cancel
                        </Button_1.default>
                    </DialogActions_1.default>
                </>
            </WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts>

        </MUIDialog_1.MUIDialog>);
};
