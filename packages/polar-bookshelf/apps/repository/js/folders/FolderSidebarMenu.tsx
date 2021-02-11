import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Divider from "@material-ui/core/Divider";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import * as React from "react";
import {TagType} from "polar-shared/src/tags/Tags";
import {Strings} from "polar-shared/src/util/Strings";
import {useFolderSidebarCallbacks} from "../folder_sidebar/FolderSidebarStore";

interface IProps {
    readonly type: TagType;
}

export const FolderSidebarMenu = (props: IProps) => {

    const {onDelete, onCreateUserTag} = useFolderSidebarCallbacks();

    const handleDelete = React.useCallback(() => {
        onDelete();
    }, [onDelete])

    return (
        <>
            <MUIMenuItem text={"Create " + Strings.upperFirst(props.type)}
                         icon={<LocalOfferIcon/>}
                         onClick={() => onCreateUserTag(props.type)}/>
            <Divider/>

            <MUIMenuItem text="Delete"
                         icon={<DeleteForeverIcon/>}
                         onClick={handleDelete}/>

        </>
    );

}
