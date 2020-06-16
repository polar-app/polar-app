import React from "react";
import {MUIDialogControllerContext} from "./MUIDialogController";

const MUIDialogControllerTest = () => (
    <MUIDialogControllerContext.Consumer>
        {(dialogs) => (
            <div>hello world</div>
        )}
    </MUIDialogControllerContext.Consumer>
);
