import {useAnnotationRepoCallbacks} from "../annotation_repo/AnnotationRepoStore";
import {MUIMenuItem} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Divider from "@material-ui/core/Divider";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import * as React from "react";
import {useFolderSidebarStore} from "../folder_sidebar/FolderSidebarStore";
import {TagType} from "polar-shared/src/tags/Tags";

interface IProps {
    readonly type: TagType;
}

export const FolderSidebarMenu = () => {

    const callbacks = useAnnotationRepoCallbacks();

    useFolderSidebarStore();

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
