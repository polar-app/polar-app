import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {MUIMenuItem} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Divider from "@material-ui/core/Divider";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import * as React from "react";

export const AnnotationRepoTableMenu = () => {

    const callbacks = useAnnotationRepoCallbacks();

    return (
        <>
            <MUIMenuItem text="Tag" icon={<LocalOfferIcon/>}
                         onClick={callbacks.onTagged}/>
            <Divider/>
            <MUIMenuItem text="Delete" icon={<DeleteForeverIcon/>}
                         onClick={callbacks.onDeleted}/>
        </>
    );
}
