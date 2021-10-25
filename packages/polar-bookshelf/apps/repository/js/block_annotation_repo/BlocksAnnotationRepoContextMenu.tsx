import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Divider from "@material-ui/core/Divider";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import * as React from "react";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import FileCopyIcon from '@material-ui/icons/FileCopy';

export const BlocksAnnotationRepoTableMenu = deepMemo(function AnnotationRepoTableMenu() {

    return (
        <>
            <MUIMenuItem text="Tag"
                icon={<LocalOfferIcon/>} />

            <MUIMenuItem text="Copy"
                icon={<FileCopyIcon/>} />

            <Divider/>
            <MUIMenuItem text="Delete"
                icon={<DeleteForeverIcon/>} />
        </>
    );

});
