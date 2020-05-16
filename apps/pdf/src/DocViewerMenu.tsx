import {MUIMenuItem} from "../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";
import * as React from "react";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const DocViewerMenu = () => {

    return (
        <>
            <MUIMenuItem text="Create Pagemark to Point"
                         icon={<BookmarkIcon/>}
                         onClick={NULL_FUNCTION}/>

        </>
    );

}
