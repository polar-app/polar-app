import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Divider from "@material-ui/core/Divider";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import * as React from "react";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import FileCopyIcon from '@material-ui/icons/FileCopy';

export const AnnotationRepoTableMenu = deepMemo(function AnnotationRepoTableMenu() {

    const callbacks = useAnnotationRepoCallbacks();

    return (
        <>
            <MUIMenuItem text="Tag"
                         icon={<LocalOfferIcon/>}
                         onClick={callbacks.onTagged}/>

            {/*<MUIMenuItem text="Archive"*/}
            {/*             icon={<LocalOfferIcon/>}*/}
            {/*             onClick={callbacks.onTagged}/>*/}

            <MUIMenuItem text="Copy"
                         icon={<FileCopyIcon/>}
                         onClick={callbacks.onCopyToClipboard}/>

            <Divider/>
            <MUIMenuItem text="Delete"
                         icon={<DeleteForeverIcon/>}
                         onClick={callbacks.onDeleted}/>
        </>
    );

});
