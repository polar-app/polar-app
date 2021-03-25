import {deepMemo} from "../../../../../../web/js/react/ReactUtils";
import {MenuComponentProps} from "../../../../../repository/js/doc_repo/MUIContextMenu";
import {MUIMenuItem} from "../../../../../../web/js/mui/menu/MUIMenuItem";
import React from "react";

export interface EPUBIFrameMenuOrigin {

    readonly clientX: number;
    readonly clientY: number;
    readonly target: EventTarget | null;

}

export const EPUBIFrameMenu = deepMemo(function EPUBIFrameMenu(props: MenuComponentProps<EPUBIFrameMenuOrigin>) {

    function handleCreatePagemark() {
        console.log(props.origin!.target);
    }

    return (
        <>
            <MUIMenuItem text="Create Pagemark" onClick={handleCreatePagemark}/>
        </>
    );

});
