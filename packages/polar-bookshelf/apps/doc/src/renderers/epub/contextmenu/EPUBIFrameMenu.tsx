// FIXME: Am going to have to inject the event listener into the root or just
// use a window event listener?
//
import {deepMemo} from "../../../../../../web/js/react/ReactUtils";
import {MenuComponentProps} from "../../../../../repository/js/doc_repo/MUIContextMenu";
import {MUIMenuItem} from "../../../../../../web/js/mui/menu/MUIMenuItem";
import React from "react";

export interface EPUBIFrameMenuOrigin {

    readonly clientX: number;
    readonly clientY: number;
    readonly target: EventTarget | null;

}

export const EPUBIFrameMenu = deepMemo((props: MenuComponentProps<EPUBIFrameMenuOrigin>) => {

    function handleCreatePagemark() {
        console.log(props.origin!.target);
    }

    return (
        <>
            <MUIMenuItem text="Create Pagemark" onClick={handleCreatePagemark}/>
        </>
    );

});
